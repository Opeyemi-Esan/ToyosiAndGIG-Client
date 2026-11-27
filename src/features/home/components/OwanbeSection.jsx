import { Link } from 'react-router-dom'
import VideoGrid, { VideoGridSkeleton } from '../../videos/components/VideoGrid'
import { useOwanbe } from '../../videos/hooks/useOwanbe'
import SectionHeading from '../../../shared/components/SectionHeading'
import Reveal from '../../../shared/components/Reveal'
import Button from '../../../shared/components/Button'

const COLUMNS = 'sm:grid-cols-2 lg:grid-cols-4'

const isLiveCategory = (v) => String(v.category).toLowerCase() === 'live'

// Home page rule:
//   Live       -> shown only while IsLive is true (hidden again as soon as it is false)
//   Highlights (anything that is not Live) -> always shown, latest 4
// Uses the same request as the Videos page, so nothing extra is downloaded.
// Hidden if there is nothing to show (or the API is unreachable).
export default function OwanbeSection() {
  const { data, isPending } = useOwanbe({ silent: true })

  const liveNow = (data ?? []).filter((v) => isLiveCategory(v) && v.isLive)
  const highlights = (data ?? []).filter((v) => !isLiveCategory(v)).slice(0, 4)
  const videos = [...liveNow, ...highlights]

  if (!isPending && videos.length === 0) return null

  return (
    <section className="bg-fg/3 py-16 sm:py-20">
      <div className="container-x">
        <SectionHeading animate eyebrow="Owanbe" title="Celebrations we have lit up" subtitle="See the energy we bring to weddings and parties." />
        {isPending ? (
          <VideoGridSkeleton count={4} columns={COLUMNS} />
        ) : (
          <Reveal>
            <VideoGrid videos={videos} columns={COLUMNS} />
          </Reveal>
        )}
        <div className="mt-10 text-center">
          <Button as={Link} to="/videos" variant="outline">
            See more videos
          </Button>
        </div>
      </div>
    </section>
  )
}