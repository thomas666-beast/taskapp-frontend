import { cn } from '@/lib/cn'

const COLORS = [
  '#4f46e5', '#0891b2', '#059669', '#d97706',
  '#dc2626', '#7c3aed', '#db2777', '#2563eb',
]

function hash(str: string) {
  let h = 0
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0
  return Math.abs(h)
}

export function Avatar({
  username,
  size = 32,
  className,
}: {
  username: string
  size?: number
  className?: string
}) {
  const initials = username.slice(0, 2).toUpperCase()
  const bg = COLORS[hash(username) % COLORS.length]
  return (
    <div
      className={cn('inline-flex items-center justify-center font-semibold text-white shrink-0', className)}
      style={{
        background: bg,
        width: size,
        height: size,
        borderRadius: '50%',
        fontSize: size * 0.4,
      }}
    >
      {initials}
    </div>
  )
}
