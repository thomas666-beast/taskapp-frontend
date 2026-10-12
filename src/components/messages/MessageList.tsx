'use client'

import { useEffect, useRef } from 'react'
import { MessageBubble } from './MessageBubble'
import type { Message } from '@/lib/types'

export function MessageList({
  messages,
  names,
}: {
  messages: Message[]
  names: Record<string, string>
}) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length])

  return (
    <div className="space-y-4">
      {messages.map((m) => (
        <MessageBubble
          key={m.id}
          message={m}
          senderName={names[m.senderId] ?? 'Unknown'}
        />
      ))}
      <div ref={bottomRef} />
    </div>
  )
}
