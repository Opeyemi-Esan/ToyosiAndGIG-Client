import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../auth/hooks/useAuth'
import { useCreateBooking } from '../hooks/useBooking'
import Input from '../../../shared/components/Input'
import Button from '../../../shared/components/Button'
import SectionHeading from '../../../shared/components/SectionHeading'
import FormError from '../../../shared/components/FormError'
import { FLYER_RULES, newIdempotencyKey } from '../../../shared/utils/security'
import { formatDate } from '../../../shared/utils/format'

// Step 1 of 3: details. Continue only shows a REVIEW screen: nothing is saved yet.
// Step 2 of 3: review. "Confirm" saves the booking (unpaid) and moves on to the payment page.
// "Back" returns to the form with everything still filled in.
// Required fields are checked here first (an error shows under each empty field and nothing moves on);
// everything else is validated by the backend DTO and its messages are shown as returned.
const REQUIRED = {
  customerName: 'Full name',
  customerPhone: 'Phone number',
  customerEmail: 'Email',
  eventType: 'Event type',
  eventDate: 'Event date',
  eventCountry: 'Country',
  eventState: 'State',
  eventTownOrCity: 'Town / City',
}

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
  const [errors, setErrors] = useState({}) // { fieldName: 'message' }
  const [step, setStep] = useState('form') // 'form' | 'review'

  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [step])

  // Same key for retries of this form: a timeout + retry can't create a second booking
  const bookingKey = useRef(newIdempotencyKey())

  const busy = createBooking.isPending
  const set = (name) => (e) => {
    setValues((p) => ({ ...p, [name]: e.target.value }))
    if (errors[name]) setErrors((p) => ({ ...p, [name]: '' })) // clear the error as soon as they type
  }

  // Form -> review (nothing is sent to the backend yet)
  function onContinue(e) {
    e.preventDefault()
    setFormError('')

    // Block the step if any required field is empty
    const found = {}
    for (const [name, label] of Object.entries(REQUIRED)) {
      if (!String(values[name] ?? '').trim()) found[name] = `${label} is required`
    }
    setErrors(found)

    const firstInvalid = Object.keys(found)[0]
    if (firstInvalid) {
      // Take the person to the first problem
      document.getElementById(`field-${firstInvalid}`)?.focus()
      return
    }

    setStep('review')
  }

  // Review -> back to the form to edit. A new key, because the details may change.
  function onBack() {
    if (busy) return
    setFormError('')
    bookingKey.current = newIdempotencyKey()
    setStep('form')
  }

  // Review -> save the booking, then payment
  async function onConfirm() {
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
          // summary: { name: values.customerName, eventType: values.eventType, eventDate: values.eventDate },
          summary: {
            name: values.customerName,
            phone: values.customerPhone,
            email: values.customerEmail,
            eventType: values.eventType,
            eventDate: values.eventDate,
            country: values.eventCountry,
            state: values.eventState,
            town: values.eventTownOrCity,
            venue: values.venue,
            notes: values.notes,
          },
        },
      })
    } catch (err) {
      setFormError(err.message) // the backend's message, as is
    }
  }

  return (
    <section className="container-x py-12 sm:py-16">
      <SectionHeading
        eyebrow={step === 'form' ? 'Book us · Step 1 of 3' : 'Book us · Step 2 of 3'}
        title={step === 'form' ? 'Tell us about your event' : 'Check your details'}
        subtitle={
          step === 'form'
            ? 'Fill in the details. You can review everything before it is saved.'
            : 'Make sure everything is correct. Nothing is saved until you confirm.'
        }
      />

      <div className="mx-auto max-w-2xl">
        {step === 'form' && !isAuthenticated && (
          <p className="mb-6 rounded-lg border border-line bg-surface p-3 text-sm text-muted">
            Booking as a guest. Have an account?{' '}
            <Link to="/login" state={{ from: '/book' }} className="font-semibold text-accent hover:underline">
              Sign in
            </Link>{' '}
            to keep track of your bookings.
          </p>
        )}

        {step === 'review' && (
          <div className="space-y-5 rounded-2xl border border-line bg-surface p-5 sm:p-8">
            <button
              type="button"
              onClick={onBack}
              disabled={busy}
              className="inline-flex items-center gap-2 text-sm font-semibold text-accent hover:underline disabled:opacity-50"
            >
              <span aria-hidden="true">←</span> Back to edit
            </button>

            <ReviewGroup title="Your details">
              <Row label="Full name" value={values.customerName} />
              <Row label="Phone" value={values.customerPhone} />
              <Row label="Email" value={values.customerEmail} />
            </ReviewGroup>

            <ReviewGroup title="Event details">
              <Row label="Event type" value={values.eventType} />
              <Row label="Event date" value={values.eventDate ? formatDate(values.eventDate) : ''} />
              <Row label="Country" value={values.eventCountry} />
              <Row label="State" value={values.eventState} />
              <Row label="Town / City" value={values.eventTownOrCity} />
              <Row label="Venue" value={values.venue} />
              <Row label="Notes" value={values.notes} />
              <Row label="Event flyer" value={flyer?.name} />
            </ReviewGroup>

            <FormError message={formError} />

            <div className="flex flex-col-reverse gap-3 sm:flex-row">
              <Button type="button" variant="outline" size="lg" className="sm:flex-1" onClick={onBack} disabled={busy}>
                Edit details
              </Button>
              <Button type="button" size="lg" className="sm:flex-1" loading={busy} onClick={onConfirm}>
                Confirm &amp; continue to payment
              </Button>
            </div>
          </div>
        )}

        <form hidden={step !== 'form'} onSubmit={onContinue} noValidate className="space-y-4 rounded-2xl border border-line bg-surface p-5 sm:p-8">
          <h2 className="text-lg font-bold">Your details</h2>
          <Input required label="Full name" id="field-customerName" error={errors.customerName} autoComplete="name" value={values.customerName} onChange={set('customerName')} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input required label="Phone number" id="field-customerPhone" error={errors.customerPhone} type="tel" autoComplete="tel" value={values.customerPhone} onChange={set('customerPhone')} />
            <Input required label="Email" id="field-customerEmail" error={errors.customerEmail} type="email" autoComplete="email" value={values.customerEmail} onChange={set('customerEmail')} />
          </div>

          <h2 className="pt-2 text-lg font-bold">Event details</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input required label="Event type" id="field-eventType" error={errors.eventType} placeholder="Wedding, concert…" value={values.eventType} onChange={set('eventType')} />
            <Input required label="Event date" id="field-eventDate" error={errors.eventDate} type="date" min={today()} value={values.eventDate} onChange={set('eventDate')} />
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <Input required label="Country" id="field-eventCountry" error={errors.eventCountry} autoComplete="country-name" value={values.eventCountry} onChange={set('eventCountry')} />
            <Input required label="State" id="field-eventState" error={errors.eventState} value={values.eventState} onChange={set('eventState')} />
            <Input required label="Town / City" id="field-eventTownOrCity" error={errors.eventTownOrCity} value={values.eventTownOrCity} onChange={set('eventTownOrCity')} />
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

          <Button type="submit" size="lg" className="w-full">
            Review my booking
          </Button>
        </form>
      </div>
    </section>
  )
}

function ReviewGroup({ title, children }) {
  return (
    <div>
      <h2 className="text-lg font-bold">{title}</h2>
      <dl className="mt-2 divide-y divide-line text-sm">{children}</dl>
    </div>
  )
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between gap-4 py-2">
      <dt className="text-muted">{label}</dt>
      <dd className="min-w-0 break-words text-right font-medium">{value || <span className="text-muted">—</span>}</dd>
    </div>
  )
}