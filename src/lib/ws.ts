'use client'

import { useEffect, useRef, useState } from 'react'
import { API_URL, getToken } from '@/lib/api'

export type WsEvent =
  | { type: 'ready' }
  | { type: 'task:joined'; taskId: string }
  | { type: 'message:new'; message: any }
  | { type: 'task:updated'; task: any }
  | { type: 'error'; error: string }

export function useTaskSocket(taskId: string | null, onEvent: (evt: WsEvent) => void) {
  const [connected, setConnected] = useState(false)
  const onEventRef = useRef(onEvent)
  onEventRef.current = onEvent

  useEffect(() => {
    if (!taskId) return
    const token = getToken()
    if (!token) return

    const wsUrl = API_URL.replace(/^http/, 'ws') + `/ws?token=${encodeURIComponent(token)}`
    const ws = new WebSocket(wsUrl)
    let alive = true

    ws.onopen = () => {
      if (!alive) return
      setConnected(true)
    }

    ws.onmessage = (e) => {
      if (!alive) return
      try {
        const evt = JSON.parse(e.data) as WsEvent
        if (evt.type === 'ready') {
          ws.send(JSON.stringify({ type: 'task:join', taskId }))
          return
        }
        onEventRef.current(evt)
      } catch {}
    }

    ws.onclose = () => {
      if (!alive) return
      setConnected(false)
    }

    ws.onerror = () => {
      // close will follow
    }

    return () => {
      alive = false
      try { ws.close() } catch {}
    }
  }, [taskId])

  return { connected }
}
