import { cn } from '@/lib/cn'
import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes } from 'react'

const base =
  'w-full px-3 py-2 text-sm radius-md border border-[var(--border)] ' +
  'bg-[var(--bg)] text-[var(--text)] ' +
  'placeholder:text-[var(--text-subtle)] ' +
  'focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent ' +
  'transition-shadow'

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...rest }, ref) => (
    <input ref={ref} className={cn(base, className)} {...rest} />
  )
)
Input.displayName = 'Input'

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...rest }, ref) => (
    <textarea ref={ref} className={cn(base, 'resize-none', className)} {...rest} />
  )
)
Textarea.displayName = 'Textarea'
