import { Link } from 'react-router-dom'
import Button from '../../../shared/components/Button'
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
      {/* Background video (your GIF converted to MP4/WebM: ~40x smaller).
          muted + playsInline are required for autoplay on phones.
          Hidden for people who prefer reduced motion: the poster image shows instead. */}
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

      {/* Dark overlay: text stays readable in both light and dark mode */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-ink/60 to-ink/40" />

      <div className="container-x py-24 text-center sm:py-32">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-400">Live music</p>
        <h1 className="mt-4 text-4xl font-extrabold tracking-tight drop-shadow sm:text-6xl lg:text-7xl">{SITE.name}</h1>
        <p className="mx-auto mt-5 max-w-xl text-base text-stone-200 sm:text-xl">{SITE.tagline}</p>
        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button as={Link} to="/book" size="lg" className="w-full sm:w-auto">
            Book now
          </Button>
          <Button as={Link} to="/music" variant="light" size="lg" className="w-full sm:w-auto">
            Listen to our music
          </Button>
        </div>
      </div>
    </section>
  )
}
