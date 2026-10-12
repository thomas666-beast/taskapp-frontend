import { cn } from '@/lib/cn'

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'animate-pulse bg-[var(--bg-subtle)] radius-md',
        className
      )}
    />
  )
}
