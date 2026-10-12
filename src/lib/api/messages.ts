import { api } from '@/lib/api'
import type { Message } from '@/lib/types'

export function listMessages(taskId: string) {
  return api.get<{ messages: Message[] }>(`/tasks/${taskId}/messages`)
}

export function sendTextMessage(taskId: string, text: string) {
  return api.post<{ message: Message }>(`/tasks/${taskId}/messages`, { type: 'TEXT', text })
}
