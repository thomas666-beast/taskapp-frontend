import type { ReactNode } from 'react'

export function Field({
  label,
  error,
  children,
}: {
  label: string
  error?: string
  children: ReactNode
}) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-[var(--text)] mb-1.5">{label}</span>
      {children}
      {error && <span className="block text-xs text-[var(--danger)] mt-1">{error}</span>}
    </label>
  )
}
