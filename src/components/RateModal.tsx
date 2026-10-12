'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { ApiError } from '@/lib/api'
import { rateTask } from '@/lib/api/tasks'
import type { Task } from '@/lib/types'
import { cn } from '@/lib/cn'

export function RateModal({
  open,
  taskId,
  onClose,
  onRated,
}: {
  open: boolean
  taskId: string
  onClose: () => void
  onRated: (task: Task) => void
}) {
  const [hover, setHover] = useState(0)
  const [selected, setSelected] = useState(0)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  if (!open) return null

  const submit = async () => {
    if (selected < 1) return
    setBusy(true)
    setError('')
    try {
      const res = await rateTask(taskId, selected)
      onRated(res.task)
      onClose()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Something went wrong')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm surface-elev radius-lg shadow-modal border border-[var(--border)] p-6">
        <h2 className="text-lg font-semibold text-[var(--text)] mb-1">Rate this worker</h2>
        <p className="text-sm text-[var(--text-muted)] mb-5">
          Your rating helps other users pick the right person.
        </p>

        <div className="flex justify-center gap-2 mb-6" onMouseLeave={() => setHover(0)}>
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onMouseEnter={() => setHover(n)}
              onClick={() => setSelected(n)}
              className={cn(
                'text-3xl transition-transform',
                (hover || selected) >= n ? 'text-yellow-400 scale-110' : 'text-[var(--border)]'
              )}
              aria-label={`${n} stars`}
            >
              ★
            </button>
          ))}
        </div>

        {error && <div className="text-sm text-[var(--danger)] mb-4">{error}</div>}

        <div className="flex gap-2 justify-end">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={submit} loading={busy} disabled={selected < 1}>
            Submit rating
          </Button>
        </div>
      </div>
    </div>
  )
}
