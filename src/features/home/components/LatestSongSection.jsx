import { useSongs } from '../../music/hooks/useMusic'
import SongPlayButton from '../../music/components/SongPlayButton'
import SectionHeading from '../../../shared/components/SectionHeading'
import Reveal from '../../../shared/components/Reveal'
import { ExternalIcon } from '../../../shared/components/Icons'
import { formatDate } from '../../../shared/utils/format'
import logo from '../../../assets/images/logo.png'

export default function LatestSongSection() {
  const { data: songs, isPending } = useSongs()
  const song = songs?.[0] // useSongs sorts newest first

  if (isPending) {
    return (
      <section className="py-16 sm:py-20" aria-hidden="true">
        <div className="container-x">
          <div className="grid animate-pulse gap-8 rounded-3xl border border-line bg-surface p-6 md:grid-cols-2 md:p-10">
            <div className="aspect-square rounded-2xl bg-fg/10" />
            <div className="space-y-4 self-center">
              <div className="h-4 w-24 rounded bg-fg/10" />
              <div className="h-10 w-3/4 rounded bg-fg/10" />
              <div className="h-4 w-1/2 rounded bg-fg/10" />
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (!song) return null // no songs yet (or the API is unreachable): hide the section

  return (
    <section className="py-16 sm:py-20">
      <div className="container-x">
        <SectionHeading animate eyebrow="New release" title="Latest song" />
        <div className="grid items-center gap-8 overflow-hidden rounded-3xl border border-line bg-surface p-6 md:grid-cols-2 md:gap-12 md:p-10">
          <Reveal from="left" className="relative mx-auto aspect-square w-full max-w-md overflow-hidden rounded-2xl bg-ink">
            <img src={song.coverUrl ?? logo} alt="" className={`h-full w-full ${song.coverUrl ? 'object-cover' : 'object-contain p-12'}`} />
            <span className="absolute left-4 top-4 rounded-full bg-brand-500 px-3 py-1 text-xs font-bold uppercase tracking-wider text-ink">New</span>
          </Reveal>

          <Reveal from="right" delay={150} className="text-center md:text-left">
            <h3 className="text-3xl font-bold sm:text-4xl">{song.title}</h3>
            <p className="mt-2 text-lg text-muted">
              {song.artist}
              {song.releaseDate && ` · ${formatDate(song.releaseDate)}`}
            </p>
            {song.description && <p className="mt-4 text-muted">{song.description}</p>}
            <div className="mt-7 flex flex-wrap justify-center gap-3 md:justify-start">
              <SongPlayButton song={song} queue={songs} size="lg" />
              {song.streamingLink && (
                <a
                  href={song.streamingLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-line px-7 py-3.5 text-base font-semibold hover:bg-fg/5"
                >
                  Listen on streaming <ExternalIcon />
                </a>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}