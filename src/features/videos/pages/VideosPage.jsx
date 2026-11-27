import { useState } from 'react'
import VideoGrid, { VideoGridSkeleton } from '../components/VideoGrid'
import { useOwanbe } from '../hooks/useOwanbe'
import SectionHeading from '../../../shared/components/SectionHeading'
import FormError from '../../../shared/components/FormError'

export default function VideosPage() {
  const { data, isPending, isError, error } = useOwanbe()
  const [category, setCategory] = useState('All')

  const all = data ?? []
  // Filter buttons come from the categories that really exist in the data
  const categories = ['All', ...new Set(all.map((v) => v.category))]
  const videos = category === 'All' ? all : all.filter((v) => v.category === category)

  return (
    <section className="container-x py-12 sm:py-16">
      <SectionHeading eyebrow="Videos" title="Watch us live" subtitle="Highlights from events and live sessions." />

      {isPending && <VideoGridSkeleton />}

      {isError && <FormError message={error.message} />}

      {!isPending && !isError && all.length === 0 && <p className="text-center text-muted">No videos yet. Please check back soon.</p>}

      {all.length > 0 && (
        <>
          {categories.length > 2 && (
            <div className="mb-8 flex flex-wrap justify-center gap-2" role="group" aria-label="Filter videos">
              {categories.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCategory(c)}
                  aria-pressed={category === c}
                  className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
                    category === c ? 'border-brand-500 bg-brand-500 text-ink' : 'border-line hover:bg-fg/5'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          )}
          <VideoGrid videos={videos} />
        </>
      )}
    </section>
  )
}