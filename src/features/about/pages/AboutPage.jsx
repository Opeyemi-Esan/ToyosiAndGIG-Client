import { Link } from 'react-router-dom'
import MissionVisionSection from '../../home/components/MissionVisionSection'
import SectionHeading from '../../../shared/components/SectionHeading'
import Button from '../../../shared/components/Button'
import logo from '../../../assets/images/logo.png'

export default function AboutPage() {
  return (
    <>
      <section className="container-x py-12 sm:py-16">
        <div className="grid items-center gap-10 md:grid-cols-5">
          <img src={logo} alt="Toyosi & GIG logo" className="mx-auto w-48 md:col-span-2 md:w-72" />
          <div className="md:col-span-3">
            <SectionHeading align="left" eyebrow="About us" title="Music made for your moments" className="mb-6" />
            <div className="space-y-4 leading-relaxed text-muted">
              <p>
                Toyosi &amp; GIG is a live music act that brings energy, skill and heart to weddings, concerts and private events.
              </p>
              <p>
                Every performance is shaped around the people in the room, so the music feels like it was made for the occasion, because it was.
              </p>
              <p>Listen to our songs, watch us live, then tell us about your event.</p>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button as={Link} to="/book">
                Book now
              </Button>
              <Button as={Link} to="/music" variant="outline">
                Listen to our music
              </Button>
            </div>
          </div>
        </div>
      </section>
      <MissionVisionSection />
    </>
  )
}
