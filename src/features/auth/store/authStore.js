import { create } from 'zustand'

// Session lives in memory only: never in localStorage/sessionStorage, where any XSS could read it.
// If VITE_API_WITH_CREDENTIALS=true the session is restored on reload from the backend's httpOnly refresh cookie.
export const useAuthStore = create((set) => ({
  user: null,
  accessToken: null,
  ready: false, // true once the first session-restore attempt has finished
  setSession: ({ user, accessToken }) => set({ user, accessToken }),
  setUser: (user) => set({ user }),
  clearSession: () => set({ user: null, accessToken: null }),
  setReady: () => set({ ready: true }),
}))
