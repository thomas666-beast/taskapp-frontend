export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

const TOKEN_KEY = 'taskapp.token'

export function getToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string | null) {
  if (typeof window === 'undefined') return
  if (token) localStorage.setItem(TOKEN_KEY, token)
  else localStorage.removeItem(TOKEN_KEY)
}

export class ApiError extends Error {
  constructor(public status: number, message: string, public details?: unknown) {
    super(message)
  }
}

async function request<T>(
  path: string,
  options: RequestInit & { auth?: boolean } = {}
): Promise<T> {
  const { auth = true, headers = {}, ...rest } = options

  const finalHeaders: Record<string, string> = {
    ...(headers as Record<string, string>),
  }

  // Only set Content-Type when a body is present
  if (rest.body !== undefined && rest.body !== null) {
    finalHeaders['Content-Type'] = 'application/json'
  }

  if (auth) {
    const token = getToken()
    if (token) finalHeaders.Authorization = `Bearer ${token}`
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...rest,
    headers: finalHeaders,
  })

  if (res.status === 204) return undefined as T

  const text = await res.text()
  const body = text ? JSON.parse(text) : {}

  if (!res.ok) {
    throw new ApiError(res.status, body.error || res.statusText, body.details)
  }
  return body as T
}

export const api = {
  get:   <T>(path: string, opts?: RequestInit) => request<T>(path, { ...opts, method: 'GET' }),
  post:  <T>(path: string, body?: unknown, opts?: RequestInit) =>
           request<T>(path, { ...opts, method: 'POST', body: body ? JSON.stringify(body) : undefined }),
  put:   <T>(path: string, body?: unknown, opts?: RequestInit) =>
           request<T>(path, { ...opts, method: 'PUT', body: body ? JSON.stringify(body) : undefined }),
  delete:<T>(path: string, opts?: RequestInit) =>
           request<T>(path, { ...opts, method: 'DELETE' }),
}
