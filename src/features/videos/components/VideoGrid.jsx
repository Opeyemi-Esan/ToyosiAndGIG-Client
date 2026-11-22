import { useState } from 'react'
import Modal from '../../../shared/components/Modal'
import { PlayIcon } from '../../../shared/components/Icons'
import { isYoutubeId } from '../../../shared/utils/security'
import logo from '../../../assets/images/logo.png'

function VideoCard({ video, onOpen }) {
  const playable = isYoutubeId(video.youtubeId)

  return (
    <article>
      <button
        type="button"
        disabled={!playable}
        onClick={() => onOpen(video)}
        aria-label={playable ? `Play ${video.title}` : `${video.title} (coming soon)`}
        className="group relative block aspect-video w-full overflow-hidden rounded-2xl border border-line bg-ink disabled:cursor-default"
      >
        {playable ? (
          <>
            <img
              src={`https://i.ytimg.com/vi/${video.youtubeId}/hqdefault.jpg`}
              alt=""
              loading="lazy"
              className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
            />
            <span className="absolute inset-0 grid place-items-center bg-black/25 transition group-hover:bg-black/40">
              <span className="grid h-14 w-14 place-items-center rounded-full bg-brand-500 text-3xl text-ink shadow-lg transition group-hover:scale-110">
                <PlayIcon />
              </span>
            </span>
          </>
        ) : (
          <span className="grid h-full w-full place-items-center bg-gradient-to-br from-brand-700/40 to-ink">
            <span className="text-center">
              <img src={logo} alt="" className="mx-auto h-14 w-14 opacity-80" />
              <span className="mt-2 block text-xs font-medium uppercase tracking-widest text-white/70">Coming soon</span>
            </span>
          </span>
        )}
      </button>
      <h3 className="mt-3 truncate font-semibold">{video.title}</h3>
      <p className="text-sm text-muted">{video.category}</p>
    </article>
  )
}

// Grid of video thumbnails. Clicking one opens it in a dialog (YouTube privacy-enhanced embed).
export default function VideoGrid({ videos, columns = 'sm:grid-cols-2 lg:grid-cols-3' }) {
  const [selected, setSelected] = useState(null)

  return (
    <>
      <div className={`grid gap-6 ${columns}`}>
        {videos.map((video) => (
          <VideoCard key={video.id} video={video} onOpen={setSelected} />
        ))}
      </div>

      <Modal open={Boolean(selected)} onClose={() => setSelected(null)} title={selected?.title ?? 'Video'} className="bg-black">
        {selected && (
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
