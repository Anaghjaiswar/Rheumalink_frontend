import { useEffect, useRef, useState, useCallback } from "react"
import { getQueueWebSocketUrl } from "../services/api"

export interface LiveQueueSyncOptions {
  doctorId?: number | string
  onQueueChange: () => void
  enabled?: boolean
  pollIntervalMs?: number
}

export function useLiveQueueSync({
  doctorId,
  onQueueChange,
  enabled = true,
  pollIntervalMs = 8000,
}: LiveQueueSyncOptions) {
  const [isConnected, setIsConnected] = useState(false)
  const [lastSyncedAt, setLastSyncedAt] = useState<Date>(new Date())

  // Keep latest callback ref to prevent stale closures without re-triggering effect
  const callbackRef = useRef(onQueueChange)
  useEffect(() => {
    callbackRef.current = onQueueChange
  }, [onQueueChange])

  // Debounced trigger to prevent UI hammering when multiple events arrive in < 250ms
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const triggerUpdate = useCallback(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }
    debounceTimerRef.current = setTimeout(() => {
      callbackRef.current()
      setLastSyncedAt(new Date())
    }, 250)
  }, [])

  useEffect(() => {
    if (!enabled) return

    let socket: WebSocket | null = null
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null
    let pollTimer: ReturnType<typeof setInterval> | null = null
    let isUnmounted = false
    let retryDelay = 1000

    const connectWebSocket = () => {
      if (isUnmounted) return

      try {
        const wsUrl = getQueueWebSocketUrl(doctorId)
        socket = new WebSocket(wsUrl)

        socket.onopen = () => {
          if (isUnmounted) return
          setIsConnected(true)
          retryDelay = 1000 // Reset backoff on successful connect
        }

        socket.onmessage = (event) => {
          if (isUnmounted) return
          try {
            const data = JSON.parse(event.data)
            if (data.type === "queue_update" || data.message === "Queue changed") {
              triggerUpdate()
            }
          } catch {
            triggerUpdate()
          }
        }

        socket.onerror = () => {
          if (isUnmounted) return
          setIsConnected(false)
        }

        socket.onclose = () => {
          if (isUnmounted) return
          setIsConnected(false)
          // Exponential backoff reconnect: 1s, 2s, 4s, up to 10s max
          reconnectTimer = setTimeout(() => {
            retryDelay = Math.min(retryDelay * 1.8, 10000)
            connectWebSocket()
          }, retryDelay)
        }
      } catch (err) {
        setIsConnected(false)
        reconnectTimer = setTimeout(connectWebSocket, 3000)
      }
    }

    // 1. Initial WebSocket connection
    connectWebSocket()

    // 2. Fallback resilient background polling
    if (pollIntervalMs > 0) {
      pollTimer = setInterval(() => {
        if (!isUnmounted) {
          triggerUpdate()
        }
      }, pollIntervalMs)
    }

    // 3. Tab Visibility Re-sync (when user switches back to browser tab)
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && !isUnmounted) {
        triggerUpdate()
        if (!socket || socket.readyState !== WebSocket.OPEN) {
          connectWebSocket()
        }
      }
    }
    document.addEventListener("visibilitychange", handleVisibilityChange)

    return () => {
      isUnmounted = true
      document.removeEventListener("visibilitychange", handleVisibilityChange)
      if (reconnectTimer) clearTimeout(reconnectTimer)
      if (pollTimer) clearInterval(pollTimer)
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current)
      if (socket) {
        socket.onclose = null
        socket.onerror = null
        socket.close()
      }
    }
  }, [doctorId, enabled, pollIntervalMs, triggerUpdate])

  return {
    isConnected,
    lastSyncedAt,
    triggerSync: triggerUpdate,
  }
}
