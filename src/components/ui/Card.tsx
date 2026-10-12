import { cn } from '@/lib/cn'
import type { HTMLAttributes } from 'react'

export function Card({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...rest}
      className={cn(
        'surface-elev border border-[var(--border)] radius-lg shadow-card',
        className
      )}
    />
  )
}
