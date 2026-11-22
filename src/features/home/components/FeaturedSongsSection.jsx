import { Link } from 'react-router-dom'
import { useSongs } from '../../music/hooks/useMusic'
import SongGrid, { SongGridSkeleton } from '../../music/components/SongGrid'
import SectionHeading from '../../../shared/components/SectionHeading'
import Button from '../../../shared/components/Button'

export default function FeaturedSongsSection() {
  const { data: songs, isPending } = useSongs()

  // Songs flagged as featured by the API; otherwise the newest few
  const featured = songs?.filter((s) => s.isFeatured) ?? []
  const list = (featured.length ? featured : (songs ?? [])).slice(0, 4)

  if (!isPending && list.length === 0) return null

  return (
    <section className="bg-fg/[0.03] py-16 sm:py-20">
      <div className="container-x">
        <SectionHeading eyebrow="Featured" title="Featured songs" subtitle="Fan favourites you can play right here." />
        {isPending ? <SongGridSkeleton /> : <SongGrid songs={list} />}
        <div className="mt-10 text-center">
          <Button as={Link} to="/music" variant="outline">
            View all music
          </Button>
        </div>
      </div>
    </section>
  )
}
