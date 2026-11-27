import { useState } from 'react'
import Modal from '../../../shared/components/Modal'
import { ExternalIcon, PlayIcon } from '../../../shared/components/Icons'
import { formatDate } from '../../../shared/utils/format'
import { usePlayerStore } from '../../player/store/playerStore'
import logo from '../../../assets/images/logo.png'

// What happens when a card is clicked:
//   uploaded video  -> plays in the dialog (video player)
//   YouTube link    -> plays in the dialog (privacy-enhanced embed)
//   other live link -> opens in a new tab
const playsInDialog = (v) => Boolean(v.videoUrl || v.youtubeId)

function thumbnailOf(v) {
  if (v.thumbnailUrl) return v.thumbnailUrl
  if (v.youtubeId) return `https://i.ytimg.com/vi/${v.youtubeId}/hqdefault.jpg`
  return null
}

function VideoCard({ video, onOpen }) {
  const thumb = thumbnailOf(video)
  const hasLink = playsInDialog(video) || Boolean(video.liveLink)

  const cardClass = 'group relative block aspect-video w-full cursor-pointer overflow-hidden rounded-2xl border border-line bg-ink disabled:cursor-default'
  const face = (
    <>
      {thumb ? (
        <img src={thumb} alt="" loading="lazy" className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
      ) : (
        <span className="grid h-full w-full place-items-center bg-linear-to-br from-brand-700/40 to-ink">
          <img src={logo} alt="" className="h-14 w-14 opacity-80" />
        </span>
      )}
      {hasLink && (
        <span className="absolute inset-0 grid place-items-center bg-black/25 transition group-hover:bg-black/40">
          <span className="grid h-14 w-14 place-items-center rounded-full bg-brand-500 text-3xl text-ink shadow-lg transition group-hover:scale-110">
            {playsInDialog(video) ? <PlayIcon /> : <ExternalIcon />}
          </span>
        </span>
      )}
      {video.isLive && (
        <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-red-600 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-white">
          <span aria-hidden="true" className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
          Live
        </span>
      )}
    </>
  )

  return (
    <article>
      {playsInDialog(video) ? (
        <button type="button" onClick={() => onOpen(video)} aria-label={`Play ${video.title}`} className={cardClass}>
          {face}
        </button>
      ) : video.liveLink ? (
        <a href={video.liveLink} target="_blank" rel="noopener noreferrer" aria-label={`Open ${video.title} in a new tab`} className={cardClass}>
          {face}
        </a>
      ) : (
        <button type="button" disabled aria-label={`${video.title} (not available)`} className={cardClass}>
          {face}
        </button>
      )}
      <h3 className="mt-3 truncate font-semibold">{video.title}</h3>
      <p className="text-sm text-muted">
        {video.category}
        {video.eventDate && ` · ${formatDate(video.eventDate)}`}
      </p>
      {video.description && <p className="mt-1 line-clamp-2 text-sm text-muted">{video.description}</p>}
    </article>
  )
}

export function VideoGridSkeleton({ count = 3, columns = 'sm:grid-cols-2 lg:grid-cols-3' }) {
  return (
    <div className={`grid animate-pulse gap-6 ${columns}`} aria-hidden="true">
      {Array.from({ length: count }, (_, i) => (
        <div key={i}>
          <div className="aspect-video rounded-2xl bg-fg/10" />
          <div className="mt-3 h-4 w-2/3 rounded bg-fg/10" />
          <div className="mt-2 h-3 w-1/3 rounded bg-fg/10" />
        </div>
      ))}
    </div>
  )
}

// Grid of videos from the API. Clicking one opens it in a dialog (or a new tab for external live links).
export default function VideoGrid({ videos, columns = 'sm:grid-cols-2 lg:grid-cols-3' }) {
  const [selected, setSelected] = useState(null)

  // Stop the music player first so two things never play at once
  const open = (video) => {
    usePlayerStore.getState().setPlaying(false)
    setSelected(video)
  }

  return (
    <>
      <div className={`grid gap-6 ${columns}`}>
        {videos.map((video) => (
          <VideoCard key={video.id} video={video} onOpen={open} />
        ))}
      </div>

      <Modal open={Boolean(selected)} onClose={() => setSelected(null)} title={selected?.title ?? 'Video'} className="bg-black">
        {selected?.videoUrl && (
          <video
            src={selected.videoUrl}
            poster={selected.thumbnailUrl ?? undefined}
            controls
            autoPlay
            playsInline
            controlsList="nodownload"
            className="max-h-[80vh] w-full bg-black"
          />
        )}
        {selected && !selected.videoUrl && selected.youtubeId && (
          <div className="aspect-video w-full">
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${selected.youtubeId}?autoplay=1&rel=0`}
              title={selected.title}
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
              sandbox="allow-scripts allow-same-origin allow-presentation"
              className="h-full w-full border-0"
            />
          </div>
        )}
      </Modal>
    </>
  )
}