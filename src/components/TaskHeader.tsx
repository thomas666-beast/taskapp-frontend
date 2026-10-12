'use client'

import Link from 'next/link'
import { useAuth } from '@/lib/auth'
import { Button } from '@/components/ui/Button'
import { StatusBadge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { ApiError } from '@/lib/api'
import { workerConfirm, userConfirm, rateTask } from '@/lib/api/tasks'
import type { Task } from '@/lib/types'
import { useState } from 'react'

export function TaskHeader({
  task,
  otherName,
  onUpdate,
  onRate,
}: {
  task: Task
  otherName: string
  onUpdate: (t: Task) => void
  onRate: () => void
}) {
  const { user } = useAuth()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  if (!user) return null

  const isWorker = user.id === task.workerId
  const isUser = user.id === task.userId

  const run = async (fn: () => Promise<{ task: Task }>) => {
    setBusy(true)
    setError('')
    try {
      const res = await fn()
      onUpdate(res.task)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Something went wrong')
    } finally {
      setBusy(false)
    }
  }

  const canWorkerConfirm = isWorker && task.status === 'OPEN'
  const canUserConfirm = isUser && task.status === 'WORKER_CONFIRMED'
  const canRate = isUser && task.status === 'COMPLETED' && task.rating === null

  return (
    <div className="space-y-4">
      <Link href="/" className="text-sm text-[var(--text-muted)] hover:text-[var(--text)] inline-block">
        ← Back
      </Link>

      <div className="p-5 radius-lg border border-[var(--border)] surface-elev shadow-card">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <h1 className="text-xl font-semibold text-[var(--text)] truncate">
                {task.title}
              </h1>
              <StatusBadge status={task.status} />
              {task.rating !== null && (
                <span className="text-sm text-[var(--text-muted)]">★ {task.rating}/5</span>
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
              <Avatar username={otherName} size={24} />
              <span>{otherName}</span>
            </div>
          </div>

          <div className="flex gap-2 shrink-0">
            {canWorkerConfirm && (
              <Button onClick={() => run(() => workerConfirm(task.id))} loading={busy}>
                Mark as done
              </Button>
            )}
            {canUserConfirm && (
              <Button onClick={() => run(() => userConfirm(task.id))} loading={busy}>
                Confirm completion
              </Button>
            )}
            {canRate && (
              <Button onClick={onRate} variant="secondary">
                Rate worker
              </Button>
            )}
          </div>
        </div>

        {canUserConfirm && (
          <p className="text-xs text-[var(--text-muted)] mt-3">
            If you don't confirm within 1 hour, the task completes automatically.
          </p>
        )}

        {error && <div className="text-sm text-[var(--danger)] mt-3">{error}</div>}
      </div>
    </div>
  )
}
