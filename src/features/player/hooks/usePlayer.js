import { useEffect, useState } from 'react'
import { selectCurrentSong, usePlayerStore } from '../store/playerStore'

// Connects the <video> element (plays audio and video files) to the player store.
// Spread `mediaProps` onto the element; use the rest to build the controls.
export function usePlayer(mediaRef) {
  const song = usePlayerStore(selectCurrentSong)
  const isPlaying = usePlayerStore((s) => s.isPlaying)
  const volume = usePlayerStore((s) => s.volume)
  const muted = usePlayerStore((s) => s.muted)
  const index = usePlayerStore((s) => s.index)
  const queueLength = usePlayerStore((s) => s.queue.length)
  const [failedId, setFailedId] = useState(null)

  const store = usePlayerStore.getState

  // New track: start playing it if we should be playing
  useEffect(() => {
    const media = mediaRef.current
    if (!media || !song) return
    if (store().isPlaying) media.play().catch(() => store().setPlaying(false))
  }, [song?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  // Play / pause requests from anywhere in the app
  useEffect(() => {
    const media = mediaRef.current
    if (!media || !song) return
    if (isPlaying && media.paused) media.play().catch(() => store().setPlaying(false))
    if (!isPlaying && !media.paused) media.pause()
  }, [isPlaying, song]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const media = mediaRef.current
    if (!media) return
    media.volume = volume
    media.muted = muted
  }, [volume, muted, song, mediaRef])

  const mediaProps = {
    src: song?.mediaUrl ?? undefined,
    onTimeUpdate: (e) => store().setTime(e.currentTarget.currentTime),
    onLoadedMetadata: (e) => store().setDuration(e.currentTarget.duration),
    onDurationChange: (e) => store().setDuration(e.currentTarget.duration),
    onPlay: () => store().setPlaying(true),
    // Keep the store in sync with browser/OS media controls, but ignore the pause fired while a new source loads
    onPause: (e) => {
      if (!e.currentTarget.ended && e.currentTarget.readyState >= 2) store().setPlaying(false)
    },
    onEnded: () => store().next(),
    onError: () => {
      setFailedId(song?.id ?? null)
      store().setPlaying(false)
    },
  }

  const seek = (seconds) => {
    if (mediaRef.current) mediaRef.current.currentTime = seconds
    store().setTime(seconds)
  }

  const previous = () => {
    const media = mediaRef.current
    if ((media && media.currentTime > 3) || index <= 0) seek(0)
    else store().previous()
  }

  return {
    song,
    mediaProps,
    seek,
    previous,
    hasNext: index < queueLength - 1,
    hasPrevious: index > 0,
    failed: Boolean(song) && failedId === song.id,
  }
}
