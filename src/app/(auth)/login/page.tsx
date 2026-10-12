'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/lib/auth'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Field } from '@/components/ui/Field'
import { ApiError } from '@/lib/api'

export default function LoginPage() {
  const { login } = useAuth()
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(username, password)
      router.push('/')
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-[var(--text)] mb-1">Welcome back</h1>
      <p className="text-sm text-[var(--text-muted)] mb-6">Sign in to continue.</p>

      <form onSubmit={onSubmit} className="space-y-4">
        <Field label="Username">
          <Input value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" required />
        </Field>
        <Field label="Password">
          <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required />
        </Field>

        {error && <div className="text-sm text-[var(--danger)]">{error}</div>}

        <Button type="submit" loading={loading} className="w-full">Sign in</Button>
      </form>

      <p className="text-sm text-[var(--text-muted)] text-center mt-6">
        No account?{' '}
        <Link href="/register" className="text-[var(--accent)] hover:underline">Create one</Link>
      </p>
    </div>
  )
}
