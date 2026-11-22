import { useState } from 'react'
import VideoGrid from '../components/VideoGrid'
import { VIDEOS } from '../data'
import SectionHeading from '../../../shared/components/SectionHeading'

const CATEGORIES = ['All', ...new Set(VIDEOS.map((v) => v.category))]

export default function VideosPage() {
  const [category, setCategory] = useState('All')
  const videos = category === 'All' ? VIDEOS : VIDEOS.filter((v) => v.category === category)

  return (
    <section className="container-x py-12 sm:py-16">
      <SectionHeading eyebrow="Videos" title="Watch us live" subtitle="Highlights from events and live sessions." />

      <div className="mb-8 flex flex-wrap justify-center gap-2" role="group" aria-label="Filter videos">
        {CATEGORIES.map((c) => (
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

      <VideoGrid videos={videos} />
    </section>
  )
}
