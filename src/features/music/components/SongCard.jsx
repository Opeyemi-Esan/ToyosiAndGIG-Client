import { selectCurrentSong, usePlayerStore } from '../../player/store/playerStore'
import { ExternalIcon, PauseIcon, PlayIcon } from '../../../shared/components/Icons'
import logo from '../../../assets/images/logo.png'

export default function SongCard({ song, queue }) {
  const current = usePlayerStore(selectCurrentSong)
  const isPlaying = usePlayerStore((s) => s.isPlaying)
  const play = usePlayerStore((s) => s.play)
  const toggle = usePlayerStore((s) => s.toggle)

  const active = current?.id === song.id
  const playing = active && isPlaying

  return (
    <article className="group overflow-hidden rounded-2xl border border-line bg-surface transition hover:-translate-y-0.5 hover:shadow-lg">
      <div className="relative aspect-square bg-ink">
        <img
          src={song.coverUrl ?? logo}
          alt=""
          loading="lazy"
          className={`h-full w-full ${song.coverUrl ? 'object-cover' : 'object-contain p-8'}`}
        />
        {song.isVideo && (
          <span className="absolute left-3 top-3 rounded-full bg-black/70 px-2.5 py-1 text-xs font-medium text-white">Video</span>
        )}
        {song.mediaUrl && (
          <button
            type="button"
            onClick={() => (active ? toggle() : play(song, queue))}
            aria-label={`${playing ? 'Pause' : 'Play'} ${song.title}`}
            className="absolute bottom-3 right-3 grid h-12 w-12 place-items-center rounded-full bg-brand-500 text-2xl text-ink shadow-lg transition hover:scale-105 hover:bg-brand-400"
          >
            {playing ? <PauseIcon /> : <PlayIcon />}
          </button>
        )}
      </div>
      <div className="p-4">
        <h3 className="truncate font-semibold">{song.title}</h3>
        <p className="truncate text-sm text-muted">{song.artist}</p>
        {song.streamingLink && (
          <a
            href={song.streamingLink}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:underline"
          >
            Listen on streaming <ExternalIcon />
          </a>
        )}
      </div>
    </article>
  )
}
