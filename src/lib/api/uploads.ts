import { API_URL, getToken, ApiError } from '@/lib/api'

export type UploadResult = {
  url: string
  name: string
  size: number
  mime: string
}

export async function uploadFile(file: File): Promise<UploadResult> {
  const form = new FormData()
  form.append('file', file)

  const headers: Record<string, string> = {}
  const token = getToken()
  if (token) headers.Authorization = `Bearer ${token}`

  const res = await fetch(`${API_URL}/uploads`, {
    method: 'POST',
    headers,
    body: form,
  })

  const text = await res.text()
  const body = text ? JSON.parse(text) : {}

  if (!res.ok) {
    throw new ApiError(res.status, body.error || 'Upload failed')
  }

  return body as UploadResult
}
