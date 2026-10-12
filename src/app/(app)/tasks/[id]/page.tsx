'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { Skeleton } from '@/components/ui/Skeleton'
import { TaskHeader } from '@/components/TaskHeader'
import { MessageList } from '@/components/messages/MessageList'
import { Composer } from '@/components/messages/Composer'
import { RateModal } from '@/components/RateModal'
import { getTask } from '@/lib/api/tasks'
import { listMessages } from '@/lib/api/messages'
import { useTaskSocket, type WsEvent } from '@/lib/ws'
import type { Task, Message } from '@/lib/types'
import { useAuth } from '@/lib/auth'

export default function TaskDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()

  const [task, setTask] = useState<Task | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [names, setNames] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showRate, setShowRate] = useState(false)

  // ── Initial fetch ─────────────────────────────────────
  useEffect(() => {
    if (!id || !user) return
    setLoading(true)
    setError('')
    Promise.all([getTask(id), listMessages(id)])
      .then(([t, m]) => {
        setTask(t.task)
        setMessages(m.messages)
        const map: Record<string, string> = {}
        map[t.task.userId] = user.id === t.task.userId ? user.username : 'User'
        map[t.task.workerId] = user.id === t.task.workerId ? user.username : 'Worker'
        if (user.id === t.task.userId) map[t.task.userId] = user.username
        if (user.id === t.task.workerId) map[t.task.workerId] = user.username
        setNames(map)
      })
      .catch(() => setError('Could not load task'))
      .finally(() => setLoading(false))
  }, [id, user])

  // ── Fill missing names by resolving both parties ─────
  useEffect(() => {
    if (!task || !user) return
    // Try to enrich names via /workers/:id when the other party is a worker
    // (users can't call /workers, workers can't see other workers by id;
    // backend doesn't expose a public user lookup in V1, so we fall back to
    // generic labels. Step 16 will add a proper people endpoint.)
    setNames((prev) => {
      const next = { ...prev }
      if (!next[task.userId]) next[task.userId] = 'User'
      if (!next[task.workerId]) next[task.workerId] = 'Worker'
      return next
    })
  }, [task, user])

  // ── WebSocket events ──────────────────────────────────
  const onEvent = useCallback((evt: WsEvent) => {
    if (evt.type === 'message:new') {
      setMessages((prev) => {
        if (prev.some((m) => m.id === evt.message.id)) return prev
        return [...prev, evt.message]
      })
    }
    if (evt.type === 'task:updated') {
      setTask(evt.task)
    }
  }, [])

  const { connected } = useTaskSocket(id ?? null, onEvent)

  if (!user) return null

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-28 w-full" />
        <Skeleton className="h-16 w-3/4" />
        <Skeleton className="h-16 w-2/3 ml-auto" />
      </div>
    )
  }

  if (error || !task) {
    return (
      <div className="p-4 radius-lg border border-[var(--danger)] bg-[var(--danger-soft)] text-sm text-[var(--danger)]">
        {error || 'Task not found'}
      </div>
    )
  }

  const isWorker = user.id === task.workerId
  const otherName = isWorker ? names[task.userId] ?? 'User' : names[task.workerId] ?? 'Worker'
  const locked = task.status === 'COMPLETED' || task.status === 'CANCELLED'

  return (
    <div className="space-y-6">
      <TaskHeader
        task={task}
        otherName={otherName}
        onUpdate={setTask}
        onRate={() => setShowRate(true)}
      />

      <div className="radius-lg border border-[var(--border)] surface-elev shadow-card overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--border)]">
          <span className="text-xs font-medium text-[var(--text-muted)]">Chat</span>
          <span
            className={
              'text-xs ' +
              (connected ? 'text-[var(--success)]' : 'text-[var(--text-subtle)]')
            }
            title={connected ? 'Live' : 'Disconnected'}
          >
            {connected ? '● Live' : '○ Offline'}
          </span>
        </div>

        <div className="p-4 max-h-[60vh] overflow-y-auto">
          {messages.length === 0 ? (
            <div className="text-center text-sm text-[var(--text-muted)] py-8">
              No messages yet. Say hello.
            </div>
          ) : (
            <MessageList messages={messages} names={names} />
          )}
        </div>

        <Composer
          taskId={task.id}
          locked={locked}
          onSent={(msg) => setMessages((prev) => (prev.some((m) => m.id === msg.id) ? prev : [...prev, msg]))}
        />
      </div>

      <RateModal
        open={showRate}
        taskId={task.id}
        onClose={() => setShowRate(false)}
        onRated={setTask}
      />
    </div>
  )
}
