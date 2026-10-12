'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import { Skeleton } from '@/components/ui/Skeleton'
import { StatCard } from '@/components/StatCard'
import { Button } from '@/components/ui/Button'
import { getWorkerStats } from '@/lib/api/tasks'
import type { WorkerStats } from '@/lib/types'

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()

  const [stats, setStats] = useState<WorkerStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Redirect non-workers
  useEffect(() => {
    if (!authLoading && user && user.role !== 'WORKER') {
      router.replace('/')
    }
  }, [authLoading, user, router])

  const load = () => {
    setLoading(true)
    setError('')
    getWorkerStats()
      .then((res) => setStats(res.stats))
      .catch(() => setError('Could not load stats'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    if (user?.role === 'WORKER') load()
  }, [user])

  if (authLoading || !user) return null
  if (user.role !== 'WORKER') return null

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-[var(--text)]">Dashboard</h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">
          Your tasks and ratings at a glance.
        </p>
      </div>

      {loading && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
        </div>
      )}

      {!loading && error && (
        <div className="p-4 radius-lg border border-[var(--danger)] bg-[var(--danger-soft)] text-sm text-[var(--danger)]">
          {error}
          <button onClick={load} className="ml-2 underline">Retry</button>
        </div>
      )}

      {!loading && !error && stats && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <StatCard label="Total" value={stats.total} />
            <StatCard label="Open" value={stats.open} />
            <StatCard label="Awaiting user" value={stats.workerConfirmed} />
            <StatCard label="Completed" value={stats.completed} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <StatCard
              label="Average rating"
              value={
                stats.averageRating !== null ? (
                  <span>
                    ★ {stats.averageRating.toFixed(2)}
                    <span className="text-base font-normal text-[var(--text-muted)] ml-2">
                      ({stats.rated} rated)
                    </span>
                  </span>
                ) : (
                  <span className="text-[var(--text-muted)] text-lg font-normal">
                    No ratings yet
                  </span>
                )
              }
              accent={stats.averageRating !== null}
            />
            <StatCard label="Cancelled" value={stats.cancelled} />
          </div>

          {stats.total === 0 && (
            <div className="p-6 radius-lg border border-[var(--border)] bg-[var(--bg-subtle)] text-center">
              <p className="text-sm text-[var(--text-muted)] mb-3">
                You don't have any tasks yet. Users will see your profile and assign you work.
              </p>
              <Button variant="secondary" onClick={() => router.push('/')}>
                View assigned tasks
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
