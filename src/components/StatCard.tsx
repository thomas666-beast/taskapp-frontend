import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

export function StatCard({
  label,
  value,
  hint,
  accent = false,
  className,
}: {
  label: string
  value: ReactNode
  hint?: string
  accent?: boolean
  className?: string
}) {
  return (
    <div
      className={cn(
        'p-5 radius-lg border surface-elev shadow-card',
        accent
          ? 'border-[var(--accent)] bg-[var(--accent-soft)]'
          : 'border-[var(--border)]',
        className
      )}
    >
      <div
        className={cn(
          'text-xs font-medium uppercase tracking-wide mb-2',
          accent ? 'text-[var(--accent)]' : 'text-[var(--text-muted)]'
        )}
      >
        {label}
      </div>
      <div
        className={cn(
          'text-3xl font-semibold tabular-nums',
          accent ? 'text-[var(--accent)]' : 'text-[var(--text)]'
        )}
      >
        {value}
      </div>
      {hint && (
        <div className="text-xs text-[var(--text-muted)] mt-1">{hint}</div>
      )}
    </div>
  )
}
