import { create } from 'zustand'

// Counts API requests currently in flight. The BusyOverlay (logo + rolling ring)
// shows while count > 0. Updated by the axios interceptors in apiClient.js.
export const useBusyStore = create((set) => ({
  count: 0,
  start: () => set((s) => ({ count: s.count + 1 })),
  end: () => set((s) => ({ count: Math.max(0, s.count - 1) })),
}))
