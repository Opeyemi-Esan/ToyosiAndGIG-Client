import { useRef } from 'react'
import { usePlayerStore } from '../store/playerStore'
import { usePlayer } from '../hooks/usePlayer'
import { TransportControls, VolumeControl } from './PlayerControls'
import { CloseIcon } from '../../../shared/components/Icons'
import logo from '../../../assets/images/logo.png'

// Persistent bottom player (lives in MainLayout so music keeps playing while people browse).
export default function MusicPlayer() {
  const mediaRef = useRef(null)
  const { song, mediaProps, seek, previous, hasNext, failed } = usePlayer(mediaRef)
  const videoOpen = usePlayerStore((s) => s.videoOpen)
  const toggleVideo = usePlayerStore((s) => s.toggleVideo)
  const close = usePlayerStore((s) => s.close)

  if (!song) return null

  const showVideo = song.isVideo && videoOpen

  return (
    <div role="region" aria-label="Music player" className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface/95 shadow-2xl backdrop-blur">
      {/* One media element handles both audio and video files */}
      <video
        ref={mediaRef}
        playsInline
        preload="metadata"
        {...mediaProps}
        className={showVideo ? 'mx-auto max-h-[45vh] w-full bg-black' : 'hidden'}
      />

      <div className="container-x flex flex-col items-stretch gap-3 py-3 sm:flex-row sm:items-center sm:gap-6">
        <div className="flex min-w-0 items-center gap-3 sm:w-1/4">
          <img src={song.coverUrl ?? logo} alt="" className="h-11 w-11 shrink-0 rounded-lg object-cover" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{song.title}</p>
            <p className="truncate text-xs text-muted">{failed ? 'Could not play this file' : song.artist}</p>
          </div>
          <button type="button" onClick={close} aria-label="Close player" className="grid h-8 w-8 shrink-0 place-items-center rounded-full hover:bg-fg/10 sm:hidden">
            <CloseIcon />
          </button>
        </div>

        <div className="sm:w-1/2">
          <TransportControls onPrevious={previous} onSeek={seek} hasNext={hasNext} />
        </div>

        <div className="hidden items-center justify-end gap-2 sm:flex sm:w-1/4">
          {song.isVideo && (
            <button type="button" onClick={toggleVideo} className="rounded-lg border border-line px-3 py-1.5 text-xs font-medium hover:bg-fg/5">
              {videoOpen ? 'Hide video' : 'Show video'}
            </button>
          )}
          <VolumeControl />
          <button type="button" onClick={close} aria-label="Close player" className="grid h-9 w-9 place-items-center rounded-full hover:bg-fg/10">
            <CloseIcon />
          </button>
        </div>
      </div>
    </div>
  )
}
