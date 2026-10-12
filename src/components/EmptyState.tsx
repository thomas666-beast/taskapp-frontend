import type { ReactNode } from 'react'

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string
  description: string
  action?: ReactNode
}) {
  return (
    <div className="text-center py-16 px-4">
      <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-[var(--bg-subtle)] flex items-center justify-center">
        <div className="w-3 h-3 rounded-full bg-[var(--accent)]" />
      </div>
      <h3 className="text-base font-medium text-[var(--text)] mb-1">{title}</h3>
      <p className="text-sm text-[var(--text-muted)] mb-6 max-w-xs mx-auto">{description}</p>
      {action}
    </div>
  )
}
