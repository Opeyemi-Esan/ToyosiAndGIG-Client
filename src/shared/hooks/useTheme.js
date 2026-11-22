import { create } from 'zustand'

const read = () =>
  typeof document !== 'undefined' && document.documentElement.classList.contains('dark') ? 'dark' : 'light'

// public/theme-init.js already applied the saved/system theme before first paint.
export const useTheme = create((set, get) => ({
  theme: read(),
  setTheme: (theme) => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    try {
      localStorage.setItem('theme', theme)
    } catch {
      /* storage blocked: the choice just won't persist */
    }
    set({ theme })
  },
  toggle: () => get().setTheme(get().theme === 'dark' ? 'light' : 'dark'),
}))
