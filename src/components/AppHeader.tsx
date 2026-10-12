'use client'

import Link from 'next/link'
import { useAuth } from '@/lib/auth'
import { useTheme } from '@/lib/theme'
import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'

export function AppHeader() {
  const { user, logout } = useAuth()
  const { theme, toggle } = useTheme()
  if (!user) return null

  return (
    <header className="border-b border-[var(--border)] bg-[var(--bg)]">
      <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-[var(--accent)]" />
          <span className="font-semibold text-[var(--text)]">Taskapp</span>
        </Link>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={toggle} aria-label="Toggle theme">
            {theme === 'dark' ? '☀︎' : '☾'}
          </Button>
          <div className="flex items-center gap-2">
            <Avatar username={user.username} size={28} />
            <div className="text-sm">
              <div className="font-medium text-[var(--text)] leading-tight">{user.username}</div>
              <div className="text-xs text-[var(--text-muted)] leading-tight">{user.role}</div>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={logout}>Sign out</Button>
        </div>
      </div>
    </header>
  )
}
