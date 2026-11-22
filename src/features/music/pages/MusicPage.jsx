import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAlbums, useSongs } from '../hooks/useMusic'
import SongGrid, { SongGridSkeleton } from '../components/SongGrid'
import SectionHeading from '../../../shared/components/SectionHeading'
import Input from '../../../shared/components/Input'
import logo from '../../../assets/images/logo.png'

const chip = (active) =>
  `rounded-full border px-4 py-1.5 text-sm font-medium transition ${
    active ? 'border-brand-500 bg-brand-500 text-ink' : 'border-line hover:bg-fg/5'
  }`

export default function MusicPage() {
  const { data: songs = [], isPending, isError, error } = useSongs()
  const { data: albums = [] } = useAlbums()
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('All')

  const filters = useMemo(() => {
    const types = new Set(['All', 'Audio', 'Video'])
    songs.forEach((s) => s.songType && types.add(s.songType))
    return [...types]
  }, [songs])

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    return songs.filter((s) => {
      const matchesFilter =
        filter === 'All' || (filter === 'Video' && s.isVideo) || (filter === 'Audio' && !s.isVideo) || s.songType === filter
      const matchesQuery = !q || s.title.toLowerCase().includes(q) || s.artist.toLowerCase().includes(q)
      return matchesFilter && matchesQuery
    })
  }, [songs, query, filter])

  return (
    <section className="container-x py-12 sm:py-16">
      <SectionHeading eyebrow="Music" title="Listen to our songs" subtitle="Play any track right here, or open it on your favourite streaming platform." />

      {albums.length > 0 && (
        <div className="mb-12">
          <h2 className="mb-4 text-xl font-bold">Albums</h2>
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
            {albums.map((album) => (
              <Link key={album.id} to={`/music/albums/${encodeURIComponent(album.id)}`} className="group block">
                <div className="aspect-square overflow-hidden rounded-2xl border border-line bg-ink">
                  <img src={album.coverUrl ?? logo} alt="" loading="lazy" className={`h-full w-full transition group-hover:scale-105 ${album.coverUrl ? 'object-cover' : 'object-contain p-8'}`} />
                </div>
                <p className="mt-2 truncate font-semibold group-hover:text-accent">{album.title}</p>
                <p className="truncate text-sm text-muted">{album.artist}</p>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter songs">
          {filters.map((f) => (
            <button key={f} type="button" onClick={() => setFilter(f)} aria-pressed={filter === f} className={chip(filter === f)}>
              {f}
            </button>
          ))}
        </div>
        <Input
          type="search"
          placeholder="Search songs…"
          aria-label="Search songs"
          maxLength={80}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full sm:w-72"
        />
      </div>

      {isPending && <SongGridSkeleton count={8} />}
      {isError && (
        <p role="alert" className="rounded-lg bg-red-500/10 p-4 text-center text-sm text-red-700 dark:text-red-300">
          {error.message}
        </p>
      )}
      {!isPending && !isError && visible.length === 0 && <p className="py-16 text-center text-muted">No songs found.</p>}
      {visible.length > 0 && <SongGrid songs={visible} />}
    </section>
  )
}
