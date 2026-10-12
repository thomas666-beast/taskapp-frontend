export function relativeTime(input: string | Date): string {
  const date = typeof input === 'string' ? new Date(input) : input
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000)

  if (seconds < 60) return 'just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`

  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

export function formatTime(input: string | Date): string {
  const date = typeof input === 'string' ? new Date(input) : input
  return date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
}

export function formatDateTime(input: string | Date): string {
  const date = typeof input === 'string' ? new Date(input) : input
  return date.toLocaleString(undefined, {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
  })
}
