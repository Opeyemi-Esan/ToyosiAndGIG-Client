import HeroSection from '../components/HeroSection'
import LatestSongSection from '../components/LatestSongSection'
import OwanbeSection from '../components/OwanbeSection'
import MissionVisionSection from '../components/MissionVisionSection'
import ServicesSection from '../components/ServicesSection'
import FeaturedSongsSection from '../components/FeaturedSongsSection'
import TestimonySection from '../components/TestimonySection'

// The home page is just the sections in order. Add, remove or reorder them here.
export default function HomePage() {
  return (
    <>
      <HeroSection />
      <LatestSongSection />
      <OwanbeSection />
      <MissionVisionSection />
      <ServicesSection />
      <FeaturedSongsSection />
      <TestimonySection />
    </>
  )
}
