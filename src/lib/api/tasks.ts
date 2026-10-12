import { api } from '@/lib/api'
import type { Task, Worker } from '@/lib/types'

export function listTasks() {
  return api.get<{ tasks: Task[] }>('/tasks')
}

export function getTask(id: string) {
  return api.get<{ task: Task }>(`/tasks/${id}`)
}

export function createTask(workerId: string, title: string) {
  return api.post<{ task: Task }>('/tasks', { workerId, title })
}

export function listWorkers() {
  return api.get<{ workers: Worker[] }>('/workers')
}

export function getWorker(id: string) {
  return api.get<{ worker: Worker }>(`/workers/${id}`)
}
