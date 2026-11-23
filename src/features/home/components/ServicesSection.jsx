import { Link } from 'react-router-dom'
import SectionHeading from '../../../shared/components/SectionHeading'
import Reveal from '../../../shared/components/Reveal'
import Button from '../../../shared/components/Button'
import { SERVICES } from '../../../shared/constants/services'
import { MusicIcon } from '../../../shared/components/Icons'

export default function ServicesSection() {
  return (
    <section className="py-16 sm:py-20">
      <div className="container-x">
        <SectionHeading animate eyebrow="Services" title="How we can play for you" subtitle="From intimate gatherings to big stages." />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map((s, i) => (
            <Reveal key={s.id} delay={i * 120} className="h-full">
              <article className="h-full rounded-2xl border border-line bg-surface p-6 transition hover:-translate-y-1 hover:border-brand-500 hover:shadow-lg">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-500/15 text-xl text-accent">
                  <MusicIcon />
                </span>
                <h3 className="mt-4 text-lg font-bold">{s.title}</h3>
                <p className="mt-2 text-sm text-muted">{s.summary}</p>
              </article>
            </Reveal>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Button as={Link} to="/services" variant="outline">
            View all services
          </Button>
        </div>
      </div>
    </section>
  )
}