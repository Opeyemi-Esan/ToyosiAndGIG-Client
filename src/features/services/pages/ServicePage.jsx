import { Link } from 'react-router-dom'
import SectionHeading from '../../../shared/components/SectionHeading'
import Button from '../../../shared/components/Button'
import { SERVICES } from '../../../shared/constants/services'
import { BOOKING_FEE_NGN } from '../../../shared/constants/site'
import { formatNaira } from '../../../shared/utils/format'

export default function ServicePage() {
  return (
    <section className="container-x py-12 sm:py-16">
      <SectionHeading eyebrow="Services" title="What we offer" subtitle="Whatever the occasion, we will shape the music around it." />

      <div className="mx-auto grid max-w-4xl gap-5 sm:grid-cols-2">
        {SERVICES.map((s) => (
          <article key={s.id} className="rounded-2xl border border-line bg-surface p-6">
            <h2 className="text-xl font-bold">{s.title}</h2>
            <p className="mt-2 font-medium text-accent">{s.summary}</p>
            <p className="mt-2 text-muted">{s.details}</p>
          </article>
        ))}
      </div>

      <div className="mx-auto mt-12 max-w-2xl rounded-2xl bg-brand-500/10 p-6 text-center sm:p-8">
        <h2 className="text-xl font-bold">How booking works</h2>
        <p className="mt-2 text-muted">
          Send your event details and pay a non-refundable booking fee of {formatNaira(BOOKING_FEE_NGN)} to secure your request. We then agree the final details with you before the booking is confirmed.
        </p>
        <Button as={Link} to="/book" size="lg" className="mt-6">
          Book now
        </Button>
      </div>
    </section>
  )
}
