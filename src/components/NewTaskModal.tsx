'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Field } from '@/components/ui/Field'
import { Avatar } from '@/components/ui/Avatar'
import { ApiError } from '@/lib/api'
import { listWorkers, createTask } from '@/lib/api/tasks'
import type { Worker, Task } from '@/lib/types'
import { cn } from '@/lib/cn'

export function NewTaskModal({
  open,
  onClose,
  onCreated,
}: {
  open: boolean
  onClose: () => void
  onCreated: (task: Task) => void
}) {
  const [workers, setWorkers] = useState<Worker[]>([])
  const [loadingWorkers, setLoadingWorkers] = useState(false)
  const [selectedWorker, setSelectedWorker] = useState<string | null>(null)
  const [title, setTitle] = useState('')
  const [error, setError] = useState('')
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    if (!open) return
    setTitle('')
    setSelectedWorker(null)
    setError('')
    setLoadingWorkers(true)
    listWorkers()
      .then((res) => setWorkers(res.workers))
      .catch(() => setError('Could not load workers'))
      .finally(() => setLoadingWorkers(false))
  }, [open])

  useEffect(() => {
    if (!open) return
    const onEsc = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onEsc)
    return () => document.removeEventListener('keydown', onEsc)
  }, [open, onClose])

  if (!open) return null

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedWorker) return
    setError('')
    setCreating(true)
    try {
      const res = await createTask(selectedWorker, title.trim())
      onCreated(res.task)
      onClose()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Something went wrong')
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md surface-elev radius-lg shadow-modal border border-[var(--border)] p-6">
        <h2 className="text-lg font-semibold text-[var(--text)] mb-1">New task</h2>
        <p className="text-sm text-[var(--text-muted)] mb-5">
          Pick a worker and describe what you need.
        </p>

        <form onSubmit={onSubmit} className="space-y-4">
          <Field label="Title">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Fix my laptop"
              maxLength={120}
              minLength={3}
              required
              autoFocus
            />
          </Field>

          <div>
            <span className="block text-sm font-medium text-[var(--text)] mb-1.5">Worker</span>
            <div className="max-h-64 overflow-y-auto border border-[var(--border)] radius-md divide-y divide-[var(--border)]">
              {loadingWorkers && (
                <div className="p-4 text-sm text-[var(--text-muted)] text-center">Loading…</div>
              )}
              {!loadingWorkers && workers.length === 0 && (
                <div className="p-4 text-sm text-[var(--text-muted)] text-center">
                  No workers yet.
                </div>
              )}
              {workers.map((w) => (
                <button
                  key={w.id}
                  type="button"
                  onClick={() => setSelectedWorker(w.id)}
                  className={cn(
                    'w-full flex items-center gap-3 p-3 text-left transition-colors',
                    selectedWorker === w.id
                      ? 'bg-[var(--accent-soft)]'
                      : 'hover:bg-[var(--bg-subtle)]'
                  )}
                >
                  <Avatar username={w.username} size={32} />
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-[var(--text)] truncate">
                      {w.username}
                    </div>
                    {w.description && (
                      <div className="text-xs text-[var(--text-muted)] truncate">
                        {w.description}
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {error && <div className="text-sm text-[var(--danger)]">{error}</div>}

          <div className="flex gap-2 justify-end pt-2">
            <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
            <Button type="submit" loading={creating} disabled={!selectedWorker || title.trim().length < 3}>
              Create task
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
