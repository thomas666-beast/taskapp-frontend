'use client'

import { useRef, useState } from 'react'
import { Textarea } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { uploadFile } from '@/lib/api/uploads'
import { sendTextMessage, sendFileMessage } from '@/lib/api/messages'
import type { Message } from '@/lib/types'
import { cn } from '@/lib/cn'

export function Composer({
  taskId,
  locked,
  onSent,
}: {
  taskId: string
  locked: boolean
  onSent: (message: Message) => void
}) {
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)
  const [uploading, setUploading] = useState<null | 'image' | 'audio' | 'file'>(null)
  const [error, setError] = useState('')

  const imageInput = useRef<HTMLInputElement>(null)
  const audioInput = useRef<HTMLInputElement>(null)
  const fileInput = useRef<HTMLInputElement>(null)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = text.trim()
    if (!trimmed || sending || locked) return
    setSending(true)
    setError('')
    try {
      const res = await sendTextMessage(taskId, trimmed)
      onSent(res.message)
      setText('')
    } catch {
      setError('Could not send message')
    } finally {
      setSending(false)
    }
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      onSubmit(e as any)
    }
  }

  const handleFile = async (
    file: File | undefined | null,
    kind: 'IMAGE' | 'AUDIO' | 'FILE',
  ) => {
    if (!file || locked) return
    setUploading(kind.toLowerCase() as any)
    setError('')
    try {
      const up = await uploadFile(file)
      const res = await sendFileMessage(taskId, kind, up.url, up.name, up.size)
      onSent(res.message)
    } catch (err: any) {
      setError(err?.message ?? 'Upload failed')
    } finally {
      setUploading(null)
      if (imageInput.current) imageInput.current.value = ''
      if (audioInput.current) audioInput.current.value = ''
      if (fileInput.current) fileInput.current.value = ''
    }
  }

  if (locked) {
    return (
      <div className="p-4 text-center text-sm text-[var(--text-muted)] border-t border-[var(--border)]">
        This task is closed. Chat is read-only.
      </div>
    )
  }

  return (
    <form
      onSubmit={onSubmit}
      className="border-t border-[var(--border)] p-3 space-y-2"
    >
      {error && <div className="text-xs text-[var(--danger)] px-1">{error}</div>}

      <div className="flex items-end gap-2">
        <div className="flex gap-1">
          <input
            ref={imageInput}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0], 'IMAGE')}
          />
          <input
            ref={audioInput}
            type="file"
            accept="audio/*"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0], 'AUDIO')}
          />
          <input
            ref={fileInput}
            type="file"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0], 'FILE')}
          />

          <IconButton
            title="Image"
            onClick={() => imageInput.current?.click()}
            disabled={!!uploading}
            active={uploading === 'image'}
          >📷</IconButton>
          <IconButton
            title="Audio"
            onClick={() => audioInput.current?.click()}
            disabled={!!uploading}
            active={uploading === 'audio'}
          >🎤</IconButton>
          <IconButton
            title="File"
            onClick={() => fileInput.current?.click()}
            disabled={!!uploading}
            active={uploading === 'file'}
          >📎</IconButton>
        </div>

        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Write a message… (Enter to send, Shift+Enter for newline)"
          rows={1}
          className={cn('flex-1', 'min-h-[40px] max-h-40')}
          disabled={sending}
        />

        <Button
          type="submit"
          loading={sending}
          disabled={!text.trim()}
          size="md"
        >
          Send
        </Button>
      </div>
    </form>
  )
}

function IconButton({
  children,
  onClick,
  disabled,
  active,
  title,
}: {
  children: React.ReactNode
  onClick: () => void
  disabled?: boolean
  active?: boolean
  title?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={cn(
        'w-9 h-9 rounded-md text-base flex items-center justify-center transition-colors',
        active
          ? 'bg-[var(--accent-soft)] text-[var(--accent)]'
          : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--bg-subtle)]',
        disabled && 'opacity-50 cursor-not-allowed'
      )}
    >
      {children}
    </button>
  )
}
