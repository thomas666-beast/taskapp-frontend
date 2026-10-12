'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import { useTheme } from '@/lib/theme'
import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/cn'

export function AppHeader() {
  const { user, logout } = useAuth()
  const { theme, toggle } = useTheme()
  const pathname = usePathname()
  if (!user) return null

  const linkCls = (href: string) =>
    cn(
      'text-sm px-3 py-1.5 rounded-md transition-colors',
      pathname === href
        ? 'bg-[var(--accent-soft)] text-[var(--accent)] font-medium'
        : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--bg-subtle)]'
    )

  return (
    <header className="border-b border-[var(--border)] bg-[var(--bg)]">
      <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 min-w-0">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-6 h-6 rounded-md bg-[var(--accent)]" />
            <span className="font-semibold text-[var(--text)]">Taskapp</span>
          </Link>

          <nav className="flex items-center gap-1">
            <Link href="/" className={linkCls('/')}>Tasks</Link>
            {user.role === 'WORKER' && (
              <Link href="/dashboard" className={linkCls('/dashboard')}>Dashboard</Link>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Button variant="ghost" size="sm" onClick={toggle} aria-label="Toggle theme">
            {theme === 'dark' ? '☀︎' : '☾'}
          </Button>
          <div className="hidden sm:flex items-center gap-2">
            <Avatar username={user.username} size={28} />
            <div className="text-sm leading-tight">
              <div className="font-medium text-[var(--text)]">{user.username}</div>
              <div className="text-xs text-[var(--text-muted)]">{user.role}</div>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={logout}>Sign out</Button>
        </div>
      </div>
    </header>
  )
}
