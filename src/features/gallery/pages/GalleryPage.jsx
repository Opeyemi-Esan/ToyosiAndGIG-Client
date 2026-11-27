import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import GalleryGrid, { GallerySkeleton } from '../components/GalleryGrid'
import { MEDIA_TYPES } from '../api/galleryApi'
import { useGallery } from '../hooks/useGallery'
import Pagination from '../../../shared/components/Pagination'
import Input from '../../../shared/components/Input'
import SectionHeading from '../../../shared/components/SectionHeading'
import FormError from '../../../shared/components/FormError'

const chip = (active) =>
  `rounded-full cursor-pointer border px-5 py-1.5 text-sm font-medium transition ${active ? 'border-brand-500 bg-brand-500 text-ink' : 'border-line hover:bg-fg/5'}`

export default function GalleryPage() {
  // The tab and page live in the address (?type=video&page=2): the back button and shared links work
  const [params, setParams] = useSearchParams()
  const mediaKey = params.get('type') === 'video' ? 'video' : 'image'
  const page = Math.max(1, Math.min(10000, parseInt(params.get('page') ?? '1', 10) || 1))

  const [query, setQuery] = useState('')
  const { data, isPending, isError, error, isPlaceholderData } = useGallery({ mediaKey, pageNumber: page })

  const go = (next) => setParams(next, { replace: false })
  const changeType = (key) => {
    setQuery('')
    go(key === 'video' ? { type: 'video' } : {})
  }
  const changePage = (p) => {
    go({ ...(mediaKey === 'video' ? { type: 'video' } : {}), page: String(p) })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // The backend has no search option, so the search looks through the page on screen
  const term = query.trim().toLowerCase()
  const items = (data?.items ?? []).filter((i) => !term || `${i.title} ${i.description}`.toLowerCase().includes(term))

  return (
    <section className="container-x py-12 sm:py-16">
      <SectionHeading eyebrow="Gallery" title="Moments on stage" subtitle="A look at our performances and events." />

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2" role="group" aria-label="Choose photos or videos">
          {Object.entries(MEDIA_TYPES).map(([key, t]) => (
            <button key={key} type="button" onClick={() => changeType(key)} aria-pressed={mediaKey === key} className={chip(mediaKey === key)}>
              {t.label}
            </button>
          ))}
        </div>
        <Input
          type="search"
          placeholder={`Search ${MEDIA_TYPES[mediaKey].label.toLowerCase()}…`}
          aria-label={`Search ${MEDIA_TYPES[mediaKey].label.toLowerCase()}`}
          maxLength={80}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full sm:w-72"
        />
      </div>

      {isPending && <GallerySkeleton />}
      {isError && <FormError message={error.message} />}

      {data && (
        <div className={isPlaceholderData ? 'opacity-60 transition-opacity' : 'transition-opacity'} aria-busy={isPlaceholderData}>
          {items.length > 0 ? (
            <GalleryGrid items={items} />
          ) : (
            <p className="py-16 text-center text-muted">
              {term ? `Nothing on this page matches “${query.trim()}”.` : `No ${MEDIA_TYPES[mediaKey].label.toLowerCase()} yet. Please check back soon.`}
            </p>
          )}

          <Pagination
            page={data.pageNumber}
            totalPages={data.totalPages}
            hasNext={data.hasNext}
            hasPrevious={data.hasPrevious}
            onChange={changePage}
            disabled={isPlaceholderData}
          />
        </div>
      )}
    </section>
  )
}