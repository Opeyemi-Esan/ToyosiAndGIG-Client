import { Link, Navigate, useLocation } from 'react-router-dom'
import Button from '../../../shared/components/Button'
import { CheckIcon } from '../../../shared/components/Icons'

// Only reachable after PaymentSuccessPage has verified the payment with the backend
export default function BookingSuccessPage() {
  const state = useLocation().state
  if (!state?.paid) return <Navigate to="/" replace />

  return (
    <section className="container-x py-20 text-center">
      <div className="mx-auto max-w-md">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-brand-500/15 text-3xl text-accent">
          <CheckIcon />
        </span>
        <h1 className="mt-6 text-3xl font-bold">Booking fee received</h1>
        <p className="mt-3 text-muted">
          Thank you! A confirmation email is on its way. Your booking stays <strong>Pending</strong> until we agree the final details with you.
        </p>
        {state.reference && <p className="mt-3 break-all text-xs text-muted">Reference: {state.reference}</p>}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button as={Link} to="/">
            Back to home
          </Button>
          <Button as={Link} to="/profile" variant="outline">
            My bookings
          </Button>
        </div>
      </div>
    </section>
  )
}
