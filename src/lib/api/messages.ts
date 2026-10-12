import { api } from '@/lib/api'
import type { Message } from '@/lib/types'
import type { MessageType } from '@/lib/types'

export function listMessages(taskId: string) {
  return api.get<{ messages: Message[] }>(`/tasks/${taskId}/messages`)
}

export function sendTextMessage(taskId: string, text: string) {
  return api.post<{ message: Message }>(`/tasks/${taskId}/messages`, { type: 'TEXT', text })
}

export function sendFileMessage(
  taskId: string,
  type: Exclude<MessageType, 'TEXT'>,
  fileUrl: string,
  fileName: string,
  fileSize: number,
) {
  return api.post<{ message: Message }>(`/tasks/${taskId}/messages`, {
    type,
    fileUrl,
    fileName,
    fileSize,
  })
}
