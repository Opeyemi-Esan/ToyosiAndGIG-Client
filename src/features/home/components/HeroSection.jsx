import { Link } from 'react-router-dom'
import Button from '../../../shared/components/Button'
import Reveal from '../../../shared/components/Reveal'
import { SITE } from '../../../shared/constants/site'
import heroMp4 from '../../../assets/video/hero.mp4'
import heroWebm from '../../../assets/video/hero.webm'
import heroPoster from '../../../assets/images/hero-poster.jpg'

export default function HeroSection() {
  return (
    <section
      className="relative isolate flex min-h-[80svh] items-center overflow-hidden bg-ink bg-cover bg-center text-white"
      style={{ backgroundImage: `url(${heroPoster})` }}
    >
      <video
        className="absolute inset-0 -z-20 h-full w-full object-cover motion-reduce:hidden"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster={heroPoster}
        aria-hidden="true"
        tabIndex={-1}
      >
        <source src={heroWebm} type="video/webm" />
        <source src={heroMp4} type="video/mp4" />
      </video>

      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-linear-to-t from-ink via-ink/60 to-ink/40" />

      <div className="container-x py-24 text-center sm:py-32">
        <Reveal as="p" from="down" className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-400">
          Live music
        </Reveal>
        <Reveal as="h1" from="left" delay={150} className="mt-4 text-4xl font-extrabold tracking-tight drop-shadow sm:text-6xl lg:text-7xl">
          {SITE.heroname}
        </Reveal>
        <Reveal as="p" from="right" delay={300} className="mx-auto mt-5 max-w-xl text-base text-stone-200 sm:text-xl">
          {SITE.tagline}
        </Reveal>
        <Reveal from="up" delay={450} className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button as={Link} to="/book" size="lg" className="w-full sm:w-auto">
            Book now
          </Button>
          <Button as={Link} to="/music" variant="light" size="lg" className="w-full sm:w-auto">
            Listen to our music
          </Button>
        </Reveal>
      </div>
    </section>
  )
}