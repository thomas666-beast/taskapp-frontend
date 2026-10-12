'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import { AppHeader } from '@/components/AppHeader'
import { Skeleton } from '@/components/ui/Skeleton'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) router.replace('/login')
  }, [loading, user, router])

  if (loading || !user) {
    return (
      <div className="min-h-screen p-6 max-w-3xl mx-auto space-y-4">
        <Skeleton className="h-12 w-48" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    )
  }

  return (
    <div className="min-h-screen surface">
      <AppHeader />
      <main className="max-w-4xl mx-auto px-4 py-6">{children}</main>
    </div>
  )
}
