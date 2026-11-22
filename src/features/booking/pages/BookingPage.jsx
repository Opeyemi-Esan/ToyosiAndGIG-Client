import { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../auth/hooks/useAuth'
import { useCreateBooking } from '../hooks/useBooking'
import Input from '../../../shared/components/Input'
import Button from '../../../shared/components/Button'
import SectionHeading from '../../../shared/components/SectionHeading'
import FormError from '../../../shared/components/FormError'
import { FLYER_RULES, newIdempotencyKey } from '../../../shared/utils/security'

const today = () => new Date().toISOString().slice(0, 10)

export default function BookingPage() {
  const { user, isAuthenticated } = useAuth()
  const createBooking = useCreateBooking()
  const navigate = useNavigate()

  const [values, setValues] = useState({
    customerName: user?.fullName ?? '',
    customerPhone: user?.phoneNumber ?? '',
    customerEmail: user?.email ?? '',
    eventCountry: '',
    eventState: '',
    eventTownOrCity: '',
    eventType: '',
    eventDate: '',
    venue: '',
    notes: '',
  })
  const [flyer, setFlyer] = useState(null)
  const [formError, setFormError] = useState('')

  const bookingKey = useRef(newIdempotencyKey())

  const busy = createBooking.isPending
  const set = (name) => (e) => setValues((p) => ({ ...p, [name]: e.target.value }))

  async function onSubmit(e) {
    e.preventDefault()
    if (busy) return

    setFormError('')
    try {
      const booking = await createBooking.mutateAsync({ values, flyer, idempotencyKey: bookingKey.current })
      const bookingReference = booking?.bookingReference ?? booking?.reference
      if (!bookingReference) throw new Error('Booking was saved but no booking reference was returned.')

      // The customer never types the reference: it travels with the navigation
      navigate('/book/payment', {
        state: {
          bookingReference,
          summary: { name: values.customerName, eventType: values.eventType, eventDate: values.eventDate },
        },
      })
    } catch (err) {
      setFormError(err.message) // the backend's message, as is
    }
  }

  return (
    <section className="container-x py-12 sm:py-16">
      <SectionHeading
        eyebrow="Book us · Step 1 of 2"
        title="Tell us about your event"
        subtitle="Fill in the details. On the next step you will pay a non-refundable booking fee to confirm your request."
      />

      <div className="mx-auto max-w-2xl">
        {!isAuthenticated && (
          <p className="mb-6 rounded-lg border border-line bg-surface p-3 text-sm text-muted">
            Booking as a guest. Have an account?{' '}
            <Link to="/login" state={{ from: '/book' }} className="font-semibold text-accent hover:underline">
              Sign in
            </Link>{' '}
            to keep track of your bookings.
          </p>
        )}

        <form onSubmit={onSubmit} noValidate className="space-y-4 rounded-2xl border border-line bg-surface p-5 sm:p-8">
          <h2 className="text-lg font-bold">Your details</h2>
          <Input label="Full name" autoComplete="name" value={values.customerName} onChange={set('customerName')} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Phone number" type="tel" autoComplete="tel" value={values.customerPhone} onChange={set('customerPhone')} />
            <Input label="Email" type="email" autoComplete="email" value={values.customerEmail} onChange={set('customerEmail')} />
          </div>

          <h2 className="pt-2 text-lg font-bold">Event details</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Event type" placeholder="Wedding, concert…" value={values.eventType} onChange={set('eventType')} />
            <Input label="Event date" type="date" min={today()} value={values.eventDate} onChange={set('eventDate')} />
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <Input label="Country" autoComplete="country-name" value={values.eventCountry} onChange={set('eventCountry')} />
            <Input label="State" value={values.eventState} onChange={set('eventState')} />
            <Input label="Town / City" value={values.eventTownOrCity} onChange={set('eventTownOrCity')} />
          </div>
          <Input label="Venue (optional)" value={values.venue} onChange={set('venue')} />
          <Input label="Notes (optional)" multiline rows={3} value={values.notes} onChange={set('notes')} />
          <Input
            label="Event flyer (optional)"
            type="file"
            accept={FLYER_RULES.types.join(',')}
            onChange={(e) => setFlyer(e.target.files[0] ?? null)}
            hint="JPG, PNG or WebP"
          />

          <FormError message={formError} />

          <Button type="submit" size="lg" className="w-full" loading={busy}>
            Continue
          </Button>
        </form>
      </div>
    </section>
  )
}