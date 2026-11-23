import { useState } from 'react'
import Modal from '../../../shared/components/Modal'
import SectionHeading from '../../../shared/components/SectionHeading'

// Every image dropped into src/assets/images/gallery/ shows up here automatically.
const modules = import.meta.glob('../../../assets/images/gallery/*.{jpg,jpeg,png,webp}', {
  eager: true,
  query: '?url',
  import: 'default',
})

const PHOTOS = Object.entries(modules)
  .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }))
  .map(([path, url], i) => ({ id: path, url, alt: `Gallery photo ${i + 1}` }))

export default function GalleryPage() {
  const [selected, setSelected] = useState(null)

  return (
    <section className="container-x py-12 sm:py-16">
      <SectionHeading eyebrow="Gallery" title="Moments on stage" subtitle="A look at our performances and events." />

      {PHOTOS.length === 0 ? (
        <p className="py-16 text-center text-muted">Photos are coming soon.</p>
      ) : (
        <div className="columns-2 gap-4 md:columns-3">
          {PHOTOS.map((photo) => (
            <button
              key={photo.id}
              type="button"
              onClick={() => setSelected(photo)}
              aria-label={`Open ${photo.alt}`}
              className="mb-4 block w-full break-inside-avoid overflow-hidden rounded-xl border border-line"
            >
              <img src={photo.url} alt={photo.alt} loading="lazy" className="w-full transition cursor-pointer duration-300 hover:scale-105" />
            </button>
          ))}
        </div>
      )}

      <Modal open={Boolean(selected)} onClose={() => setSelected(null)} title={selected?.alt ?? 'Photo'} className="bg-black">
        {selected && <img src={selected.url} alt={selected.alt} className="max-h-[88vh] w-full object-contain" />}
      </Modal>
    </section>
  )
}
