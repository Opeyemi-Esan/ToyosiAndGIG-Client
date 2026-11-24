import { usePlayerStore } from '../store/playerStore'
import { MuteIcon, NextIcon, PauseIcon, PlayIcon, PrevIcon, RepeatIcon, ReplayIcon, VolumeIcon } from '../../../shared/components/Icons'
import { formatTime } from '../../../shared/utils/format'

const iconButton = 'grid h-9 w-9 place-items-center rounded-full text-xl transition hover:bg-fg/10 disabled:opacity-40'

// Repeat / previous / play-pause / next / replay + the seek bar
export function TransportControls({ onPrevious, onSeek, hasNext }) {
  const isPlaying = usePlayerStore((s) => s.isPlaying)
  const currentTime = usePlayerStore((s) => s.currentTime)
  const duration = usePlayerStore((s) => s.duration)
  const toggle = usePlayerStore((s) => s.toggle)
  const next = usePlayerStore((s) => s.next)
  const setPlaying = usePlayerStore((s) => s.setPlaying)
  const repeat = usePlayerStore((s) => s.repeat)
  const toggleRepeat = usePlayerStore((s) => s.toggleRepeat)
  // Start the current song again from the beginning (also works after it has finished)
  const replay = () => {
    onSeek(0)
    setPlaying(true)
  }
  const safeDuration = Number.isFinite(duration) && duration > 0 ? duration : 0

  return (
    <div className="w-full">
      <div className="flex items-center justify-center gap-2">
        <button
          type="button"
          onClick={toggleRepeat}
          aria-label={repeat ? 'Turn repeat off' : 'Turn repeat on'}
          aria-pressed={repeat}
          title={repeat ? 'Repeat: on' : 'Repeat: off'}
          className={`${iconButton} ${repeat ? 'bg-brand-500/20 text-accent' : ''}`}
        >
          <RepeatIcon />
        </button>
        <button type="button" onClick={onPrevious} aria-label="Previous" className={iconButton}>
          <PrevIcon />
        </button>
        <button
          type="button"
          onClick={toggle}
          aria-label={isPlaying ? 'Pause' : 'Play'}
          className="grid h-11 w-11 place-items-center rounded-full bg-brand-500 text-2xl text-ink transition hover:bg-brand-400"
        >
          {isPlaying ? <PauseIcon /> : <PlayIcon />}
        </button>
        <button type="button" onClick={next} disabled={!hasNext} aria-label="Next" className={iconButton}>
          <NextIcon />
        </button>
        <button type="button" onClick={replay} aria-label="Replay" title="Replay" className={iconButton}>
          <ReplayIcon />
        </button>
      </div>
      <div className="mt-1 flex items-center gap-2 text-xs tabular-nums text-muted">
        <span className="w-9 text-right">{formatTime(currentTime)}</span>
        <input
          type="range"
          min={0}
          max={safeDuration}
          step={0.1}
          value={Math.min(currentTime, safeDuration)}
          onChange={(e) => onSeek(Number(e.target.value))}
          disabled={!safeDuration}
          aria-label="Seek"
          className="h-1 flex-1 cursor-pointer accent-brand-500"
        />
        <span className="w-9">{formatTime(safeDuration)}</span>
      </div>
    </div>
  )
}

export function VolumeControl({ className = '' }) {
  const volume = usePlayerStore((s) => s.volume)
  const muted = usePlayerStore((s) => s.muted)
  const setVolume = usePlayerStore((s) => s.setVolume)
  const toggleMute = usePlayerStore((s) => s.toggleMute)

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <button type="button" onClick={toggleMute} aria-label={muted ? 'Unmute' : 'Mute'} className={iconButton}>
        {muted || volume === 0 ? <MuteIcon /> : <VolumeIcon />}
      </button>
      <input
        type="range"
        min={0}
        max={1}
        step={0.05}
        value={muted ? 0 : volume}
        onChange={(e) => setVolume(Number(e.target.value))}
        aria-label="Volume"
        className="h-1 w-24 cursor-pointer accent-brand-500"
      />
    </div>
  )
}