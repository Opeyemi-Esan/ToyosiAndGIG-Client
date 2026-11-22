import { Link } from 'react-router-dom'
import VideoGrid from '../../videos/components/VideoGrid'
import { VIDEOS } from '../../videos/data'
import SectionHeading from '../../../shared/components/SectionHeading'
import Button from '../../../shared/components/Button'

const FEATURED = VIDEOS.filter((v) => v.featured).slice(0, 4)

export default function OwanbeSection() {
  return (
    <section className="bg-fg/[0.03] py-16 sm:py-20">
      <div className="container-x">
        <SectionHeading eyebrow="Owanbe" title="Celebrations we have lit up" subtitle="See the energy we bring to weddings and parties." />
        <VideoGrid videos={FEATURED} columns="sm:grid-cols-2 lg:grid-cols-4" />
        <div className="mt-10 text-center">
          <Button as={Link} to="/videos" variant="outline">
            See all videos
          </Button>
        </div>
      </div>
    </section>
  )
}
