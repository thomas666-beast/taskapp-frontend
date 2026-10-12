'use client'

import { useAuth } from '@/lib/auth'
import { Card } from '@/components/ui/Card'

export default function HomePage() {
  const { user } = useAuth()
  if (!user) return null

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-[var(--text)]">Hello, {user.username}</h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">
          Signed in as <strong>{user.role}</strong>.
        </p>
      </div>

      <Card className="p-6 text-sm text-[var(--text-muted)]">
        Task list comes in Step 12. The foundation is here.
      </Card>
    </div>
  )
}
