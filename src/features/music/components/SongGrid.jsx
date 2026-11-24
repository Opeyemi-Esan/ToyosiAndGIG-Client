import SongCard from './SongCard'

// Responsive grid: 1 column on phones up to 4 on large screens
export default function SongGrid({ songs }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {songs.map((song) => (
        <SongCard key={song.id} song={song} queue={songs} />
      ))}
    </div>
  )
}

export function SongGridSkeleton({ count = 4 }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" aria-hidden="true">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="animate-pulse overflow-hidden rounded-2xl border border-line bg-surface">
          <div className="aspect-square bg-fg/10" />
          <div className="space-y-2 p-4">
            <div className="h-4 w-3/4 rounded bg-fg/10" />
            <div className="h-3 w-1/2 rounded bg-fg/10" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function FeaturedSongGrid({ songs }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
      {songs.map((song) => (
        <SongCard key={song.id} song={song} queue={songs} />
      ))}
    </div>
  )
}

export function FeaturedSongGridSkeleton({ count = 3 }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3" aria-hidden="true">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="animate-pulse overflow-hidden rounded-2xl border border-line bg-surface">
          <div className="aspect-square bg-fg/10" />
          <div className="space-y-2 p-4">
            <div className="h-4 w-3/4 rounded bg-fg/10" />
            <div className="h-3 w-1/2 rounded bg-fg/10" />
          </div>
        </div>
      ))}
    </div>
  )
}
