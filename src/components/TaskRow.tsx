'use client'

import Link from 'next/link'
import type { Task } from '@/lib/types'
import { StatusBadge } from '@/components/ui/Badge'
import { relativeTime } from '@/lib/format'
import { useAuth } from '@/lib/auth'

export function TaskRow({ task, workerName, userName }: {
  task: Task
  workerName?: string
  userName?: string
}) {
  const { user } = useAuth()
  if (!user) return null

  // Show "who the task is with" from the other party's perspective
  const other =
    user.role === 'WORKER'
      ? (userName ?? 'User')
      : user.role === 'USER'
        ? (workerName ?? 'Worker')
        : `${userName ?? 'User'} → ${workerName ?? 'Worker'}`

  return (
    <Link
      href={`/tasks/${task.id}`}
      className="block p-4 radius-lg border border-[var(--border)] surface-elev shadow-card hover:border-[var(--accent)] transition-colors"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-medium text-[var(--text)] truncate">{task.title}</h3>
            <StatusBadge status={task.status} />
          </div>
          <p className="text-sm text-[var(--text-muted)]">
            {other} · {relativeTime(task.createdAt)}
          </p>
        </div>
        {task.rating !== null && (
          <span className="text-sm text-[var(--text-muted)] shrink-0">★ {task.rating}</span>
        )}
      </div>
    </Link>
  )
}
