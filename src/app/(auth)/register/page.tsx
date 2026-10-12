'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/lib/auth'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Field } from '@/components/ui/Field'
import { ApiError } from '@/lib/api'
import { cn } from '@/lib/cn'

type Role = 'USER' | 'WORKER'

export default function RegisterPage() {
  const { register } = useAuth()
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<Role>('USER')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await register(username, password, role)
      router.push('/')
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-[var(--text)] mb-1">Create account</h1>
      <p className="text-sm text-[var(--text-muted)] mb-6">Pick a role. You can change it later.</p>

      <form onSubmit={onSubmit} className="space-y-4">
        <Field label="Username">
          <Input value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" required minLength={3} maxLength={24} />
        </Field>
        <Field label="Password">
          <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" required minLength={6} />
        </Field>

        <div>
          <span className="block text-sm font-medium text-[var(--text)] mb-1.5">Role</span>
          <div className="grid grid-cols-2 gap-2">
            {(['USER', 'WORKER'] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={cn(
                  'px-3 py-2 text-sm radius-md border transition-colors',
                  role === r
                    ? 'border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)] font-medium'
                    : 'border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)]'
                )}
              >
                {r === 'USER' ? 'I need help' : 'I do tasks'}
              </button>
            ))}
          </div>
        </div>

        {error && <div className="text-sm text-[var(--danger)]">{error}</div>}

        <Button type="submit" loading={loading} className="w-full">Create account</Button>
      </form>

      <p className="text-sm text-[var(--text-muted)] text-center mt-6">
        Have an account?{' '}
        <Link href="/login" className="text-[var(--accent)] hover:underline">Sign in</Link>
      </p>
    </div>
  )
}
