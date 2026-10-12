'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'

export default function TaskDetailPage() {
  const { id } = useParams<{ id: string }>()

  return (
    <div className="space-y-6">
      <Link href="/" className="text-sm text-[var(--text-muted)] hover:text-[var(--text)]">
        ← Back
      </Link>
      <div className="p-6 radius-lg border border-[var(--border)] surface-elev shadow-card text-sm text-[var(--text-muted)]">
        Task detail comes in Step 13. Task ID: <code className="text-[var(--text)]">{id}</code>
      </div>
    </div>
  )
}
