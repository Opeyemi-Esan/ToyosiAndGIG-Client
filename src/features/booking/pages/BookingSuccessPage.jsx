import { useCallback, useState } from 'react'
import { Link, Navigate, useLocation } from 'react-router-dom'
import Button from '../../../shared/components/Button'
import Modal from '../../../shared/components/Modal'
import { CheckIcon } from '../../../shared/components/Icons'
import CelebrationSplash from '../../../shared/components/CelebrationSplash' // adjust to where you saved it
import { useAuth } from '../../auth/hooks/useAuth'
import { formatDate, formatNaira } from '../../../shared/utils/format'
import { loadReceipt } from '../utils/bookingReceipt'

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false)
  async function copy() {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      /* clipboard blocked: the reference can still be selected by hand */
    }
  }
  return (
    <button type="button" onClick={copy} className="shrink-0 rounded-md border border-line px-2 py-0.5 text-xs font-medium hover:bg-fg/5">
      {copied ? 'Copied' : 'Copy'}
    </button>
  )
}

function Row({ label, value, copy = false, mono = false }) {
  if (!value) return null
  return (
    <div className="flex items-start justify-between gap-4 py-2">
      <dt className="shrink-0 text-muted">{label}</dt>
      <dd className="flex min-w-0 items-center gap-2 text-right font-medium">
        <span className={`min-w-0 break-all ${mono ? 'font-mono text-xs' : ''}`}>{value}</span>
        {copy && <CopyButton text={value} />}
      </dd>
    </div>
  )
}

// Only reachable after PaymentSuccessPage has verified the payment with the backend
export default function BookingSuccessPage() {
  const state = useLocation().state
  const { isAuthenticated } = useAuth()
  const reference = state?.reference // payment reference
  const [detailsOpen, setDetailsOpen] = useState(false)

  // Hooks must run before the early return below
  const storageKey = `booking-celebrated-${reference ?? 'unknown'}`
  const [showSplash, setShowSplash] = useState(() => {
    try {
      return !sessionStorage.getItem(storageKey)
    } catch {
      return true
    }
  })

  const closeSplash = useCallback(() => {
    setShowSplash(false)
    try {
      sessionStorage.setItem(storageKey, '1')
    } catch {
      /* ignore */
    }
  }, [storageKey])

  if (!state?.paid) return <Navigate to="/" replace />

  const receipt = loadReceipt(reference) // booking details saved before the trip to Paystack (may be missing)
  const summary = receipt?.summary
  const location = [summary?.town, summary?.state, summary?.country].filter(Boolean).join(', ')

  return (
    <section className="container-x py-20 text-center">
      {showSplash && <CelebrationSplash reference={reference} onClose={closeSplash} />}

      <div className="mx-auto max-w-md">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-brand-500/15 text-3xl text-accent">
          <CheckIcon />
        </span>
        <h1 className="mt-6 text-3xl font-bold">Booking fee received</h1>
        <p className="mt-3 text-muted">
          Thank you! A confirmation email is on its way. Your booking stays <strong>Pending</strong> until we agree the final details with you.
        </p>
        {reference && <p className="mt-3 break-all text-xs text-muted">Reference: {reference}</p>}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button as={Link} to="/">
            Back to home
          </Button>
          <Button type="button" variant="outline" onClick={() => setDetailsOpen(true)}>
            View booking details
          </Button>
        </div>
      </div>

      <Modal open={detailsOpen} onClose={() => setDetailsOpen(false)} title="Booking details" className="w-[min(94vw,32rem)]">
        <div className="p-6 text-left sm:p-8">
          <h2 className="pr-10 text-xl font-bold">Booking details</h2>

          <dl className="mt-4 divide-y divide-line text-sm">
            <Row label="Booking reference" value={receipt?.bookingReference} copy mono />
            <Row label="Payment reference" value={reference} copy mono />
            <Row label="Amount paid" value={state.amount != null ? formatNaira(state.amount) : ''} />
            <Row label="Payment status" value="Paid" />
            <Row label="Booking status" value="Pending" />
          </dl>

          {summary && (
            <>
              <h3 className="mt-6 font-semibold">Event</h3>
              <dl className="mt-1 divide-y divide-line text-sm">
                <Row label="Name" value={summary.name} />
                <Row label="Email" value={summary.email} />
                <Row label="Phone" value={summary.phone} />
                <Row label="Event type" value={summary.eventType} />
                <Row label="Event date" value={summary.eventDate ? formatDate(summary.eventDate) : ''} />
                <Row label="Location" value={location} />
                <Row label="Venue" value={summary.venue} />
                <Row label="Notes" value={summary.notes} />
              </dl>
            </>
          )}

          {!receipt && (
            <p className="mt-4 rounded-lg bg-fg/5 p-3 text-sm text-muted">
              The full booking details, including your booking reference, are in the confirmation email we are sending you.
            </p>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            <Button type="button" onClick={() => setDetailsOpen(false)}>
              Close
            </Button>
            {isAuthenticated && (
              <Button as={Link} to="/dashboard/bookings" variant="outline">
                My bookings
              </Button>
            )}
          </div>
        </div>
      </Modal>
    </section>
  )
}