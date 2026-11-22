import { Link, useParams } from 'react-router-dom'
import { useAlbum } from '../hooks/useMusic'
import SongGrid from '../components/SongGrid'
import SongPlayButton from '../components/SongPlayButton'
import { PageLoader } from '../../../shared/components/Loader'
import Button from '../../../shared/components/Button'
import { formatDate } from '../../../shared/utils/format'
import logo from '../../../assets/images/logo.png'

export default function AlbumPage() {
  const { id } = useParams()
  const { data: album, isPending, isError, error } = useAlbum(id)

  if (isPending) return <PageLoader />
  if (isError) {
    return (
      <section className="container-x py-20 text-center">
        <p role="alert" className="text-muted">{error.message}</p>
        <Button as={Link} to="/music" variant="outline" className="mt-6">
          Back to music
        </Button>
      </section>
    )
  }

  const firstPlayable = album.songs.find((s) => s.mediaUrl)

  return (
    <section className="container-x py-12 sm:py-16">
      <Link to="/music" className="text-sm font-medium text-accent hover:underline">
        ← All music
      </Link>

      <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-end">
        <div className="aspect-square w-48 shrink-0 overflow-hidden rounded-2xl border border-line bg-ink sm:w-56">
          <img src={album.coverUrl ?? logo} alt="" className={`h-full w-full ${album.coverUrl ? 'object-cover' : 'object-contain p-8'}`} />
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">Album</p>
          <h1 className="mt-1 text-3xl font-bold sm:text-5xl">{album.title}</h1>
          <p className="mt-2 text-muted">
            {album.artist}
            {album.releaseDate && ` · ${formatDate(album.releaseDate)}`} · {album.songs.length} {album.songs.length === 1 ? 'song' : 'songs'}
          </p>
          {album.description && <p className="mt-3 max-w-xl text-muted">{album.description}</p>}
          {firstPlayable && <SongPlayButton song={firstPlayable} queue={album.songs.filter((s) => s.mediaUrl)} size="lg" className="mt-5" />}
        </div>
      </div>

      <div className="mt-12">
        {album.songs.length ? <SongGrid songs={album.songs} /> : <p className="text-muted">No songs in this album yet.</p>}
      </div>
    </section>
  )
}
