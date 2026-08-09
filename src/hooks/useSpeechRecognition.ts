import { useState, useRef, useCallback } from "react"

declare global {
  interface Window {
    SpeechRecognition: any
    webkitSpeechRecognition: any
  }
}

export function useSpeechRecognition(
  currentValue: string,
  onUpdate: (val: string) => void,
  lang: string = "en-IN"
) {
  const [isListening, setIsListening] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const recognitionRef = useRef<any>(null)

  const isSupported = typeof window !== "undefined" && !!(window.SpeechRecognition || window.webkitSpeechRecognition)

  const toggleListening = useCallback(() => {
    if (!isSupported) {
      alert("Web Speech API is not supported in this browser.")
      return
    }

    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
      setIsListening(false)
      return
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    recognitionRef.current = recognition

    recognition.lang = lang
    recognition.continuous = false
    recognition.interimResults = true

    const initialVal = currentValue || ""
    let finalTranscript = ""

    recognition.onstart = () => {
      setIsListening(true)
      setError(null)
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    recognition.onresult = (event: any) => {
      let interimTranscript = ""
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const transcript = event.results[i][0].transcript
        if (event.results[i].isFinal) {
          finalTranscript += transcript
        } else {
          interimTranscript += transcript
        }
      }

      const prefix = initialVal ? initialVal.trim() + " " : ""
      if (interimTranscript) {
        onUpdate(prefix + finalTranscript + interimTranscript)
      } else {
        onUpdate(prefix + finalTranscript)
      }
    }

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error)
      if (event.error === "not-allowed") {
        alert("Voice Typing Error: Microphone access is blocked. Please allow microphone permissions in your browser.")
      } else if (event.error === "network") {
        alert("Voice Typing Error: Network error. Chrome requires an internet connection for Speech Recognition.")
      }
      setIsListening(false)
    }

    try {
      recognition.start()
    } catch (e) {
      console.error("Failed to start speech recognition", e)
      setIsListening(false)
    }
  }, [isSupported, isListening, lang, currentValue, onUpdate])

  return { isListening, toggleListening, isSupported, error }
}
