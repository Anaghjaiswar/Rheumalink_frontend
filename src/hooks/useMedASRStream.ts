import { useState, useRef, useCallback } from "react"

export interface UseMedASRStreamOptions {
  token?: string
  aiServicePort?: number | string
  currentValue?: string
  onTranscriptUpdate: (text: string) => void
  onRecordingStart?: () => void
  onRecordingStop?: () => void
}

export function useMedASRStream({
  token = "rc_live_jrmEVRrDg1QxJ_Ei5ou7jEXH6-zTyOeA",
  aiServicePort = 8001,
  currentValue = "",
  onTranscriptUpdate,
  onRecordingStart,
  onRecordingStop,
}: UseMedASRStreamOptions) {
  const [isRecording, setIsRecording] = useState(false)
  const [status, setStatus] = useState<"idle" | "connecting" | "listening" | "processing" | "error">("idle")
  const [error, setError] = useState<string | null>(null)
  const [audioLevel, setAudioLevel] = useState<number>(0)

  const baseTextRef = useRef<string>("")
  const websocketRef = useRef<WebSocket | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const processorRef = useRef<ScriptProcessorNode | null>(null)
  const microphoneRef = useRef<MediaStreamAudioSourceNode | null>(null)

  const stopRecording = useCallback(async (): Promise<string> => {
    setIsRecording(false)
    setStatus("processing")

    // Disconnect Web Audio nodes cleanly
    if (processorRef.current) {
      processorRef.current.disconnect()
      processorRef.current.onaudioprocess = null
      processorRef.current = null
    }

    if (microphoneRef.current) {
      microphoneRef.current.disconnect()
      microphoneRef.current = null
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }

    if (audioContextRef.current) {
      try {
        await audioContextRef.current.close()
      } catch {}
      audioContextRef.current = null
    }

    setAudioLevel(0)

    // Wait 400ms to allow trailing audio buffers to be processed by MedASR
    await new Promise(resolve => setTimeout(resolve, 400))

    if (websocketRef.current) {
      if (websocketRef.current.readyState === WebSocket.OPEN || websocketRef.current.readyState === WebSocket.CONNECTING) {
        websocketRef.current.close()
      }
      websocketRef.current = null
    }

    setStatus("idle")
    if (onRecordingStop) onRecordingStop()

    return ""
  }, [onRecordingStop])

  const startRecording = useCallback(async (customBaseText?: string) => {
    setError(null)
    setStatus("connecting")

    baseTextRef.current = customBaseText !== undefined ? customBaseText : (currentValue || "")

    const hostname = typeof window !== "undefined" && window.location.hostname ? window.location.hostname : "localhost"
    const wsProtocol = typeof window !== "undefined" && window.location.protocol === "https:" ? "wss:" : "ws:"
    const wsUrl = `${wsProtocol}//${hostname}:${aiServicePort}/v1/stream-transcribe?token=${token}`

    try {
      const ws = new WebSocket(wsUrl)
      ws.binaryType = "arraybuffer"
      websocketRef.current = ws

      ws.onopen = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            audio: {
              channelCount: 1,
              sampleRate: 16000,
              echoCancellation: true,
              noiseSuppression: true,
            },
          })
          streamRef.current = stream

          const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext
          const audioCtx = new AudioContextClass({ sampleRate: 16000 })
          audioContextRef.current = audioCtx

          const microphone = audioCtx.createMediaStreamSource(stream)
          microphoneRef.current = microphone

          // ScriptProcessor for real-time 16kHz PCM audio streaming
          const processor = audioCtx.createScriptProcessor(4096, 1, 1)
          processorRef.current = processor

          processor.onaudioprocess = (e) => {
            if (!websocketRef.current || websocketRef.current.readyState !== WebSocket.OPEN) return

            const inputData = e.inputBuffer.getChannelData(0)

            // Compute audio volume level for live visualizer
            let sum = 0
            for (let i = 0; i < inputData.length; i++) {
              sum += inputData[i] * inputData[i]
            }
            const rms = Math.sqrt(sum / inputData.length)
            setAudioLevel(Math.min(rms * 4, 1))

            // Convert Float32 samples [-1.0, 1.0] to 16-bit signed PCM bytes for MedASR
            const pcmData = new Int16Array(inputData.length)
            for (let i = 0; i < inputData.length; i++) {
              const sample = Math.max(-1, Math.min(1, inputData[i]))
              pcmData[i] = sample < 0 ? sample * 0x8000 : sample * 0x7FFF
            }

            websocketRef.current.send(pcmData.buffer)
          }

          microphone.connect(processor)
          processor.connect(audioCtx.destination)

          setIsRecording(true)
          setStatus("listening")
          if (onRecordingStart) onRecordingStart()
        } catch (mediaErr: any) {
          console.error("Microphone access error:", mediaErr)
          setError("Microphone permission denied. Please allow microphone access in your browser.")
          setStatus("error")
          if (ws.readyState === WebSocket.OPEN) ws.close()
        }
      }

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          if (data.type === "intermediate" || data.type === "final") {
            if (data.text) {
              const prefix = baseTextRef.current ? baseTextRef.current.trim() + " " : ""
              onTranscriptUpdate(prefix + data.text)
            }
          } else if (data.type === "error") {
            setError(data.message || "MedASR transcription error")
          }
        } catch (parseErr) {
          console.error("Error parsing WebSocket message:", parseErr)
        }
      }

      ws.onerror = (wsErr) => {
        console.error("MedASR WebSocket connection error:", wsErr)
        setError("Unable to connect to MedASR AI service on port 8001.")
        setStatus("error")
      }

      ws.onclose = () => {
        setIsRecording(false)
      }
    } catch (err: any) {
      console.error("MedASR WebSocket initialization failed:", err)
      setError(err.message || "Failed to initialize MedASR transcription.")
      setStatus("error")
    }
  }, [aiServicePort, token, currentValue, onTranscriptUpdate, onRecordingStart])

  const toggleRecording = useCallback(() => {
    if (isRecording) {
      stopRecording()
    } else {
      startRecording()
    }
  }, [isRecording, startRecording, stopRecording])

  return {
    isRecording,
    status,
    error,
    audioLevel,
    startRecording,
    stopRecording,
    toggleRecording,
  }
}
