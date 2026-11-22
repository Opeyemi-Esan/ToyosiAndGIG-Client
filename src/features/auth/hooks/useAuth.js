import { useEffect } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '../store/authStore'
import * as authApi from '../api/authApi'

const USE_COOKIE_SESSION = import.meta.env.VITE_API_WITH_CREDENTIALS === 'true'

// Call once at the app root: restores the session from the httpOnly refresh cookie (if enabled)
export function useSessionBootstrap() {
  useEffect(() => {
    const { setSession, setReady } = useAuthStore.getState()
    if (!USE_COOKIE_SESSION) {
      setReady()
      return
    }
    authApi
      .refresh()
      .then((session) => session?.accessToken && setSession(session))
      .catch(() => {
        /* not signed in: that's fine */
      })
      .finally(setReady)
  }, [])
}

export function useAuth() {
  const user = useAuthStore((s) => s.user)
  const ready = useAuthStore((s) => s.ready)
  const setSession = useAuthStore((s) => s.setSession)
  const clearSession = useAuthStore((s) => s.clearSession)
  const queryClient = useQueryClient()

  const login = useMutation({
    mutationFn: authApi.login,
    onSuccess: (session) => setSession(session),
  })

  const register = useMutation({
    mutationFn: authApi.register,
    // If the backend returns a session on register, sign the user straight in
    onSuccess: (session) => {
      if (session?.accessToken) setSession(session)
    },
  })

  const logout = useMutation({
    mutationFn: authApi.logout,
    onSettled: () => {
      clearSession()
      queryClient.clear() // drop any cached private data
    },
  })

  return { user, ready, isAuthenticated: Boolean(user), login, register, logout }
}
