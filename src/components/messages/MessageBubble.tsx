'use client'

import { Avatar } from '@/components/ui/Avatar'
import { formatTime } from '@/lib/format'
import { cn } from '@/lib/cn'
import type { Message } from '@/lib/types'
import { useAuth } from '@/lib/auth'

export function MessageBubble({
  message,
  senderName,
}: {
  message: Message
  senderName: string
}) {
  const { user } = useAuth()
  if (!user) return null

  const mine = message.senderId === user.id

  return (
    <div className={cn('flex gap-3', mine && 'flex-row-reverse')}>
      {!mine && <Avatar username={senderName} size={32} />}
      <div className={cn('max-w-[75%] min-w-0', mine && 'items-end flex flex-col')}>
        <div className="flex items-center gap-2 mb-1 px-1">
          <span className="text-xs font-medium text-[var(--text-muted)]">
            {mine ? 'You' : senderName}
          </span>
          <span className="text-[10px] text-[var(--text-subtle)]">
            {formatTime(message.createdAt)}
          </span>
        </div>
        <div
          className={cn(
            'radius-lg px-3.5 py-2.5 text-sm break-words',
            mine
              ? 'bg-[var(--accent)] text-[var(--accent-fg)]'
              : 'bg-[var(--bg-subtle)] text-[var(--text)]'
          )}
        >
          <MessageContent message={message} mine={mine} />
        </div>
      </div>
    </div>
  )
}

function MessageContent({ message, mine }: { message: Message; mine: boolean }) {
  if (message.type === 'TEXT') {
    return <span className="whitespace-pre-wrap">{message.text}</span>
  }

  if (message.type === 'IMAGE' && message.fileUrl) {
    return (
      <a href={message.fileUrl} target="_blank" rel="noreferrer">
        <img
          src={message.fileUrl}
          alt={message.fileName ?? 'image'}
          className="rounded-md max-h-72 max-w-full"
        />
      </a>
    )
  }

  if (message.type === 'AUDIO' && message.fileUrl) {
    return (
      <audio controls src={message.fileUrl} className="max-w-full">
        Your browser does not support audio.
      </audio>
    )
  }

  // FILE
  return (
    <a
      href={message.fileUrl ?? '#'}
      target="_blank"
      rel="noreferrer"
      className={cn(
        'flex items-center gap-2 underline underline-offset-2',
        mine ? 'text-[var(--accent-fg)]' : 'text-[var(--accent)]'
      )}
    >
      <span className="truncate max-w-[240px]">{message.fileName ?? 'file'}</span>
      {message.fileSize != null && (
        <span className="text-xs opacity-75 shrink-0">
          {formatBytes(message.fileSize)}
        </span>
      )}
    </a>
  )
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}
