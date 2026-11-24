import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { usePlayerStore } from '../store/playerStore'
import { usePlayer } from '../hooks/usePlayer'
import { TransportControls, VolumeControl } from './PlayerControls'
import { CloseIcon, CollapseIcon, ExpandIcon } from '../../../shared/components/Icons'
import logo from '../../../assets/images/logo.png'

// Persistent bottom player (lives in MainLayout so music keeps playing while people browse).
export default function MusicPlayer() {
  const mediaRef = useRef(null)
  const stageRef = useRef(null) // wrapper around the video: this is the element that goes full screen
  const idleTimer = useRef(null)
  const tapTimer = useRef(null)
  const lastPointer = useRef('mouse') // 'mouse' | 'touch' | 'pen': what the person is using right now

  const { song, mediaProps, seek, previous, hasNext, failed } = usePlayer(mediaRef)
  const videoOpen = usePlayerStore((s) => s.videoOpen)
  const toggleVideo = usePlayerStore((s) => s.toggleVideo)
  const close = usePlayerStore((s) => s.close)

  const [isFullscreen, setIsFullscreen] = useState(false)
  const [controlsVisible, setControlsVisible] = useState(true)
  const [tapShown, setTapShown] = useState(false) // touch screens: tapping the video reveals the button for a few seconds
  const [sideGap, setSideGap] = useState(0) // black space left/right of the picture, so the button sits ON the picture

  const showVideo = Boolean(song?.isVideo) && videoOpen
  const canFullscreen = Boolean(song?.isVideo)

  // Work out where the picture itself is inside the (full width) video element
  useLayoutEffect(() => {
    const media = mediaRef.current
    const stage = stageRef.current
    if (!media || !stage) return undefined
    const measure = () => {
      if (!media.videoWidth || !media.videoHeight) return setSideGap(0)
      const pictureWidth = Math.min(media.clientWidth, media.clientHeight * (media.videoWidth / media.videoHeight))
      setSideGap(Math.max(0, (media.clientWidth - pictureWidth) / 2))
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(stage)
    media.addEventListener('loadedmetadata', measure)
    return () => {
      observer.disconnect()
      media.removeEventListener('loadedmetadata', measure)
    }
  }, [song?.id, showVideo])

  // In full screen, hide the controls after a few seconds without movement
  const wake = useCallback(() => {
    setControlsVisible(true)
    clearTimeout(idleTimer.current)
    idleTimer.current = setTimeout(() => setControlsVisible(false), 3000)
  }, [])

  // Touch screens have no hover: a tap on the video shows the button, then it hides again
  const onStagePointerDown = (e) => {
    lastPointer.current = e.pointerType
    if (e.pointerType === 'mouse') return
    if (isFullscreen) {
      wake() // full screen: a tap reveals the controls again
      return
    }
    setTapShown(true)
    clearTimeout(tapTimer.current)
    tapTimer.current = setTimeout(() => setTapShown(false), 3500)
  }
  useEffect(() => () => clearTimeout(tapTimer.current), [])

  // Keep our state in sync with the browser (the Esc key also leaves full screen)
  useEffect(() => {
    const onChange = () => setIsFullscreen(document.fullscreenElement === stageRef.current)
    document.addEventListener('fullscreenchange', onChange)
    return () => document.removeEventListener('fullscreenchange', onChange)
  }, [])

  // Leave full screen if the song stops being a video (next track is audio) or the player closes
  useEffect(() => {
    if (!canFullscreen && document.fullscreenElement) document.exitFullscreen?.().catch(() => {})
  }, [canFullscreen])

  const toggleFullscreen = useCallback(async () => {
    const stage = stageRef.current
    const media = mediaRef.current
    if (!stage || !media) return

    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen()
        return
      }
      // A hidden video cannot go full screen: show it first
      if (!usePlayerStore.getState().videoOpen) {
        usePlayerStore.getState().toggleVideo()
        await new Promise((resolve) => requestAnimationFrame(resolve))
      }
      if (stage.requestFullscreen) await stage.requestFullscreen()
      else if (media.webkitEnterFullscreen) media.webkitEnterFullscreen() // iPhone Safari: native video player
    } catch {
      /* the browser refused (permissions policy, etc.): stay in the normal view */
    }
  }, [])

  useEffect(() => {
    if (isFullscreen) {
      // Mouse: controls show at first, then follow the pointer. Touch: hidden until the video is tapped.
      if (lastPointer.current === 'mouse') wake()
      else setControlsVisible(false)
    } else {
      clearTimeout(idleTimer.current)
      setControlsVisible(true)
    }
    return () => clearTimeout(idleTimer.current)
  }, [isFullscreen, wake])

  if (!song) return null

  return (
    <div role="region" aria-label="Music player" className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface/95 shadow-2xl backdrop-blur">
      {/* One media element handles both audio and video files */}
      <div
        ref={stageRef}
        onPointerMove={isFullscreen ? (e) => e.pointerType === 'mouse' && wake() : undefined}
        onPointerLeave={isFullscreen ? (e) => e.pointerType === 'mouse' && setControlsVisible(false) : undefined}
        onPointerDown={onStagePointerDown}
        className={showVideo ? `group relative bg-black ${isFullscreen && !controlsVisible ? 'cursor-none' : ''}` : 'hidden'}
      >
        <video
          ref={mediaRef}
          playsInline
          preload="metadata"
          {...mediaProps}
          className={isFullscreen ? 'h-full w-full bg-black object-contain' : 'mx-auto max-h-[45vh] w-full bg-black'}
        />

        {/* Normal view, video songs only: expand button on the corner of the picture. Hidden until hover (computer) or tap (touch) */}
        {canFullscreen && !isFullscreen && (
          <button
            type="button"
            onClick={toggleFullscreen}
            aria-label="Full screen"
            title="Full screen"
            style={{ right: sideGap + 12 }}
            className={`absolute top-3 grid h-10 w-10 place-items-center rounded-full bg-black/60 text-xl text-white ring-1 ring-white/20 transition hover:bg-black/80 focus-visible:opacity-100 group-hover:opacity-100 ${tapShown ? 'opacity-100' : 'opacity-0'}`}
          >
            <ExpandIcon />
          </button>
        )}

        {/* Full screen view: title, controls and exit button (fade away when idle) */}
        {isFullscreen && (
          <div className={`pointer-events-none absolute inset-0 flex flex-col justify-between transition-opacity duration-300 ${controlsVisible ? 'opacity-100' : 'opacity-0'}`}>
            <div className={`${controlsVisible ? 'pointer-events-auto' : 'pointer-events-none'} flex items-start justify-between gap-4 bg-gradient-to-b from-black/80 to-transparent p-4 text-white`}>
              <div className="min-w-0">
                <p className="truncate text-lg font-semibold">{song.title}</p>
                <p className="truncate text-sm text-white/70">{song.artist}</p>
              </div>
              <button
                type="button"
                onClick={toggleFullscreen}
                aria-label="Exit full screen"
                title="Exit full screen"
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/15 text-xl hover:bg-white/25"
              >
                <CollapseIcon />
              </button>
            </div>
            <div className={`${controlsVisible ? 'pointer-events-auto' : 'pointer-events-none'} bg-gradient-to-t from-black/80 to-transparent px-4 pb-5 pt-10 text-white`}>
              <div className="mx-auto max-w-3xl">
                <TransportControls onPrevious={previous} onSeek={seek} hasNext={hasNext} />
              </div>
            </div>
          </div>
        )}
      </div>

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

        <div className="flex items-center justify-end gap-2 sm:flex sm:w-1/4">
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