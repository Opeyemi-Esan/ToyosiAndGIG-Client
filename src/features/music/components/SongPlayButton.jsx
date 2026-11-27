import { selectCurrentSong, usePlayerStore } from '../../player/store/playerStore'
import Button from '../../../shared/components/Button'
import { PauseIcon, PlayIcon } from '../../../shared/components/Icons'

// Play/pause button for a song. Renders nothing if the song has no playable file.
// `queue` = the list the song came from, so Next/Previous work in the player.
export default function SongPlayButton({ song, queue, variant = 'primary', size = 'md', className = 'cursor-pointer' }) {
  const current = usePlayerStore(selectCurrentSong)
  const isPlaying = usePlayerStore((s) => s.isPlaying)
  const play = usePlayerStore((s) => s.play)
  const toggle = usePlayerStore((s) => s.toggle)

  if (!song.mediaUrl) return null

  const active = current?.id === song.id
  const playing = active && isPlaying

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={() => (active ? toggle() : play(song, queue))}
      aria-label={`${playing ? 'Pause' : 'Play'} ${song.title}`}
    >
      {playing ? <PauseIcon /> : <PlayIcon />}
      {playing ? 'Pause' : 'Play'}
    </Button>
  )
}
