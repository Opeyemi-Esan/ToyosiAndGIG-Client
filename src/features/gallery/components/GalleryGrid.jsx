import { useState } from 'react'
import Modal from '../../../shared/components/Modal'
import { NextIcon, PlayIcon, PrevIcon } from '../../../shared/components/Icons'
import { formatDate } from '../../../shared/utils/format'
import { usePlayerStore } from '../../player/store/playerStore'

export function GallerySkeleton({ count = 8 }) {
  return (
    <div className="grid animate-pulse grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4" aria-hidden="true">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="aspect-square rounded-xl bg-fg/10" />
      ))}
    </div>
  )
}

function Tile({ item, onOpen }) {
  const isVideo = item.mediaKey === 'video'
  return (
    <button
      type="button"
      onClick={() => onOpen(item)}
      aria-label={`${isVideo ? 'Play' : 'Open'} ${item.title || 'item'}`}
      className="group relative block aspect-square w-full overflow-hidden rounded-xl border border-line bg-ink"
    >
      {isVideo ? (
        // #t=0.1 makes the browser show a frame as the preview, without downloading the whole video
        <video src={`${item.fileUrl}#t=0.1`} preload="metadata" muted playsInline tabIndex={-1} aria-hidden="true" className="h-full w-full object-cover cursor-pointer" />
      ) : (
        <img src={item.fileUrl} alt={item.title} loading="lazy" className="h-full w-full object-cover transition duration-300 group-hover:scale-105 cursor-pointer" />
      )}
      {isVideo && (
        <span className="absolute inset-0 grid place-items-center bg-black/25 transition group-hover:bg-black/40">
          <span className="grid h-12 w-12 place-items-center rounded-full bg-brand-500 text-2xl text-ink shadow-lg cursor-pointer">
            <PlayIcon />
          </span>
        </span>
      )}
      {item.title && (
        <span className="absolute inset-x-0 bottom-0 truncate bg-linear-to-t from-black/80 to-transparent px-3 pb-2 pt-8 text-left text-sm font-medium text-white opacity-0 transition group-hover:opacity-100 group-focus-visible:opacity-100">
          {item.title}
        </span>
      )}
    </button>
  )
}

// Grid of photos or videos. Click opens a viewer (with previous / next) inside the dialog.
export default function GalleryGrid({ items }) {
  const [index, setIndex] = useState(null)
  const current = index === null ? null : items[index]

  const open = (item) => {
    if (item.mediaKey === 'video') usePlayerStore.getState().setPlaying(false) // never two things playing at once
    setIndex(items.findIndex((i) => i.id === item.id))
  }
  const step = (delta) => setIndex((i) => (i === null ? i : (i + delta + items.length) % items.length))

  return (
    <>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {items.map((item) => (
          <Tile key={item.id} item={item} onOpen={open} />
        ))}
      </div>

      <Modal open={Boolean(current)} onClose={() => setIndex(null)} title={current?.title || 'Gallery'} className="bg-black">
        {current && (
          <div>
            {current.mediaKey === 'video' ? (
              <video key={current.id} src={current.fileUrl} controls autoPlay playsInline controlsList="nodownload" className="max-h-[80vh] w-full bg-black" />
            ) : (
              <img key={current.id} src={current.fileUrl} alt={current.title} className="max-h-[80vh] w-full object-contain" />
            )}

            <div className="flex items-center justify-between gap-3 bg-surface px-4 py-3 text-fg">
              <div className="min-w-0">
                <p className="truncate font-semibold">{current.title}</p>
                <p className="truncate text-sm text-muted">
                  {current.capturedDate && formatDate(current.capturedDate)}
                  {current.capturedDate && current.description && ' · '}
                  {current.description}
                </p>
              </div>
              {items.length > 1 && (
                <div className="flex shrink-0 gap-1">
                  <button type="button" onClick={() => step(-1)} aria-label="Previous" className="grid h-9 w-9 place-items-center rounded-full text-xl hover:bg-fg/10">
                    <PrevIcon />
                  </button>
                  <button type="button" onClick={() => step(1)} aria-label="Next" className="grid h-9 w-9 place-items-center rounded-full text-xl hover:bg-fg/10">
                    <NextIcon />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </>
  )
}