import axios from 'axios'
import { useAuthStore } from '../features/auth/store/authStore'
import { toSession } from '../features/auth/api/session'
import { useBusyStore } from './busyStore'
import { ENDPOINTS } from './endpoints'

const baseURL = import.meta.env.VITE_API_BASE_URL
const USE_COOKIE_SESSION = import.meta.env.VITE_API_WITH_CREDENTIALS === 'true'

if (!baseURL && import.meta.env.PROD) {
  throw new Error('VITE_API_BASE_URL is not set')
}

export class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

// Pulls the human-readable message out of whatever the backend returned:
//  1. Response<T>:               { message, isSuccess, statusCode, data }   (also accepts "Message")
//  2. ASP.NET validation errors: { errors: { Field: ["message", ...] } }
//  3. ProblemDetails:            { detail } or { title }
function extractMessage(data) {
  if (!data) return null
  if (typeof data === 'string') {
    const text = data.trim()
    return text && text.length < 300 && !text.startsWith('<') ? text : null // ignore HTML error pages
  }
  if (typeof data !== 'object') return null

  const direct = data.message ?? data.Message
  if (typeof direct === 'string' && direct.trim()) return direct

  const errors = data.errors ?? data.Errors
  if (errors && typeof errors === 'object') {
    const messages = Object.values(errors).flat().filter((m) => typeof m === 'string' && m.trim())
    if (messages.length) return messages.join('\n')
  }

  const detail = data.detail ?? data.title
  return typeof detail === 'string' && detail.trim() ? detail : null
}

function fallbackMessage(status) {
  if (status === 401) return 'You are not signed in or your session has expired.'
  if (status === 403) return 'You do not have permission to do that.'
  if (status === 413) return 'The file you uploaded is too large.'
  if (status === 429) return 'Too many requests. Please wait a moment and try again.'
  return 'Something went wrong. Please try again.'
}

const apiClient = axios.create({
  baseURL: baseURL || 'https://localhost:7060',
  timeout: 20000,
  headers: { Accept: 'application/json' },
  withCredentials: USE_COOKIE_SESSION,
})

// ---- Session refresh -------------------------------------------------------------------------
// Uses a plain axios call (not apiClient) so it can never trigger its own 401 handling.
// ONE shared promise: if several callers ask at once (page load in dev mode, many requests
// expiring together) they all wait for the same request. The backend rotates the refresh
// token on every use, so two parallel refreshes would otherwise invalidate each other.
let refreshPromise = null

export function refreshSession() {
  if (!USE_COOKIE_SESSION) return Promise.resolve(null)

  if (!refreshPromise) {
    refreshPromise = axios
      .post(`${apiClient.defaults.baseURL}${ENDPOINTS.auth.refresh}`, null, {
        withCredentials: true,
        timeout: 20000,
        headers: { Accept: 'application/json' },
      })
      .then((res) => {
        const session = toSession(res.data?.data)
        if (session) useAuthStore.getState().setSession(session)
        return session
      })
      .catch(() => null) // no valid refresh cookie: the caller treats this as signed out
      .finally(() => {
        refreshPromise = null
      })
  }
  return refreshPromise
}

// Attach the in-memory access token and start the busy indicator.
// Pass { silent: true } in a request config to skip the busy overlay (background calls).
apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken
  if (token) config.headers.Authorization = `Bearer ${token}`

  if (!config.silent) {
    config.busyCounted = true
    useBusyStore.getState().start()
  }
  return config
})

const stopBusy = (config) => {
  if (config?.busyCounted) {
    config.busyCounted = false
    useBusyStore.getState().end()
  }
}

// The backend wraps results as Response<T> { data, message, statusCode, isSuccess }.
// Resolve normally on success, otherwise throw an ApiError with a safe, user-facing message.
apiClient.interceptors.response.use(
  (res) => {
    stopBusy(res.config)
    const body = res.data
    if (body && typeof body === 'object' && 'isSuccess' in body && !body.isSuccess) {
      throw new ApiError(body.message || 'Request failed', body.statusCode ?? res.status)
    }
    return res
  },
  async (error) => {
    stopBusy(error.config)

    if (axios.isCancel(error)) return Promise.reject(error)

    const status = error.response?.status
    if (!error.response) {
      return Promise.reject(new ApiError('Network error. Please check your connection and try again.'))
    }

    // Expired access token: refresh once, then repeat the original request with the new token.
    const original = error.config
    const store = useAuthStore.getState()
    const isAuthCall = String(original?.url ?? '').includes('/api/auth/')

    if (status === 401 && store.accessToken && original && !original._retried && !isAuthCall) {
      original._retried = true

      // Another request already refreshed while this one was in flight: just retry with the new token
      const sentWith = original.headers?.Authorization
      if (sentWith && sentWith !== `Bearer ${store.accessToken}`) {
        return apiClient(original)
      }

      const session = await refreshSession()
      if (session?.accessToken) return apiClient(original)

      useAuthStore.getState().clearSession() // refresh failed: really signed out
    } else if (status === 401 && store.accessToken) {
      store.clearSession()
    }

    // Show the backend's own message exactly as it sends it. Your API already returns safe
    // messages (Response<T>.Fail and the global exception handler), so there is nothing to hide.
    // Only when the backend sends no readable message do we use a generic fallback.
    const message = extractMessage(error.response.data) ?? fallbackMessage(status)
    return Promise.reject(new ApiError(message, status))
  },
)

// Returns the `data` of a Response<T> (or the raw body if it is not wrapped)
export const unwrap = (res) => res.data?.data ?? res.data

export default apiClient