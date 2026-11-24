import { create } from 'zustand'

// Global player state. The actual <audio>/<video> element lives in MusicPlayer and is driven by usePlayer.
export const usePlayerStore = create((set, get) => ({
  queue: [],
  index: -1,
  isPlaying: false,
  volume: 0.8,
  muted: false,
  currentTime: 0,
  duration: 0,
  videoOpen: true,
  muted: false,
  repeat: false, // keep repeating the current song   <-- add (below `muted: false,`)

  // Play `song`; `queue` lets next/previous move through the list it came from
  play: (song, queue) => {
    const list = queue?.length ? queue : [song]
    const index = Math.max(0, list.findIndex((s) => s.id === song.id))
    set({ queue: list, index, isPlaying: true, currentTime: 0, duration: 0 })
  },
  toggle: () => set((s) => ({ isPlaying: !s.isPlaying })),
  next: () => {
    const { queue, index } = get()
    if (index < queue.length - 1) set({ index: index + 1, isPlaying: true, currentTime: 0, duration: 0 })
    else set({ isPlaying: false })
  },
  previous: () => {
    const { index } = get()
    if (index > 0) set({ index: index - 1, isPlaying: true, currentTime: 0, duration: 0 })
  },
  setPlaying: (isPlaying) => set({ isPlaying }),
  setVolume: (volume) => set({ volume, muted: volume === 0 }),
  toggleMute: () => set((s) => ({ muted: !s.muted })),
  setTime: (currentTime) => set({ currentTime }),
  setDuration: (duration) => set({ duration }),
  toggleVideo: () => set((s) => ({ videoOpen: !s.videoOpen })),
  close: () => set({ queue: [], index: -1, isPlaying: false, currentTime: 0, duration: 0 }),
  toggleMute: () => set((s) => ({ muted: !s.muted })),
  toggleRepeat: () => set((s) => ({ repeat: !s.repeat })),   // <-- add (below toggleMute)
}))

export const selectCurrentSong = (s) => s.queue[s.index] ?? null
