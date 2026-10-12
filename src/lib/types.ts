export type Role = 'USER' | 'WORKER' | 'ADMIN'
export type TaskStatus = 'OPEN' | 'WORKER_CONFIRMED' | 'COMPLETED' | 'CANCELLED'
export type MessageType = 'TEXT' | 'IMAGE' | 'AUDIO' | 'FILE'

export type User = {
  id: string
  username: string
  role: Role
  createdAt?: string
}

export type Worker = {
  id: string
  username: string
  description: string
  createdAt: string
}

export type Task = {
  id: string
  userId: string
  workerId: string
  title: string
  status: TaskStatus
  rating: number | null
  workerConfirmedAt: string | null
  userConfirmedAt: string | null
  autoConfirmAt: string | null
  createdAt: string
  updatedAt: string
  closedAt: string | null
}

export type Message = {
  id: string
  taskId: string
  senderId: string
  type: MessageType
  text: string | null
  fileUrl: string | null
  fileName: string | null
  fileSize: number | null
  createdAt: string
}

export type WorkerStats = {
  total: number
  open: number
  workerConfirmed: number
  completed: number
  cancelled: number
  rated: number
  averageRating: number | null
}
