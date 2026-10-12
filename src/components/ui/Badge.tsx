import { cn } from '@/lib/cn'
import type { TaskStatus } from '@/lib/types'

const MAP: Record<TaskStatus, { label: string; style: string }> = {
  OPEN:             { label: 'Open',             style: 'bg-[var(--accent-soft)] text-[var(--accent)]' },
  WORKER_CONFIRMED: { label: 'Awaiting you',     style: 'bg-[var(--warning-soft)] text-[var(--warning)]' },
  COMPLETED:        { label: 'Completed',        style: 'bg-[var(--success-soft)] text-[var(--success)]' },
  CANCELLED:        { label: 'Cancelled',        style: 'bg-[var(--danger-soft)] text-[var(--danger)]' },
}

export function StatusBadge({ status, className }: { status: TaskStatus; className?: string }) {
  const { label, style } = MAP[status]
  return (
    <span className={cn('inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full', style, className)}>
      {label}
    </span>
  )
}
