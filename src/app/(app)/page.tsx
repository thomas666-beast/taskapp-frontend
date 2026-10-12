'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/auth'
import { Button } from '@/components/ui/Button'
import { Skeleton } from '@/components/ui/Skeleton'
import { TaskRow } from '@/components/TaskRow'
import { EmptyState } from '@/components/EmptyState'
import { NewTaskModal } from '@/components/NewTaskModal'
import { listTasks, listWorkers } from '@/lib/api/tasks'
import type { Task, Worker } from '@/lib/types'

export default function HomePage() {
  const { user } = useAuth()
  const [tasks, setTasks] = useState<Task[]>([])
  const [workers, setWorkers] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showNew, setShowNew] = useState(false)

  const load = () => {
    setLoading(true)
    setError('')
    Promise.all([
      listTasks(),
      user?.role !== 'WORKER' ? listWorkers() : Promise.resolve({ workers: [] as Worker[] }),
    ])
      .then(([t, w]) => {
        setTasks(t.tasks)
        const map: Record<string, string> = {}
        for (const worker of w.workers) map[worker.id] = worker.username
        setWorkers(map)
      })
      .catch(() => setError('Could not load tasks'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { if (user) load() }, [user])

  if (!user) return null

  const isWorker = user.role === 'WORKER'
  const isUser = user.role === 'USER'

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--text)]">
            {isWorker ? 'Assigned tasks' : 'Your tasks'}
          </h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            {isWorker ? 'Tasks assigned to you.' : 'Tasks you have created.'}
          </p>
        </div>

        {isUser && (
          <Button onClick={() => setShowNew(true)}>New task</Button>
        )}
      </div>

      {loading && (
        <div className="space-y-3">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      )}

      {!loading && error && (
        <div className="p-4 radius-lg border border-[var(--danger)] bg-[var(--danger-soft)] text-sm text-[var(--danger)]">
          {error}
          <button onClick={load} className="ml-2 underline">Retry</button>
        </div>
      )}

      {!loading && !error && tasks.length === 0 && (
        <EmptyState
          title={isWorker ? 'No tasks assigned yet' : 'No tasks yet'}
          description={
            isWorker
              ? 'When someone assigns you a task, it will appear here.'
              : 'Create your first task and pick a worker to get started.'
          }
          action={
            isUser ? (
              <Button onClick={() => setShowNew(true)}>Create your first task</Button>
            ) : undefined
          }
        />
      )}

      {!loading && !error && tasks.length > 0 && (
        <div className="space-y-3">
          {tasks.map((task) => (
            <TaskRow
              key={task.id}
              task={task}
              workerName={workers[task.workerId]}
            />
          ))}
        </div>
      )}

      <NewTaskModal
        open={showNew}
        onClose={() => setShowNew(false)}
        onCreated={(task) => setTasks((prev) => [task, ...prev])}
      />
    </div>
  )
}
