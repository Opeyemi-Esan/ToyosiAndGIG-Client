import { useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useBookingFee, useInitializePayment } from '../hooks/usePayment'
import Button from '../../../shared/components/Button'
import SectionHeading from '../../../shared/components/SectionHeading'
import FormError from '../../../shared/components/FormError'
import { formatDate, formatNaira } from '../../../shared/utils/format'
import { newIdempotencyKey } from '../../../shared/utils/security'

// Step 3 of 3. The booking reference arrives from the booking page through router state:
// the customer never types it. The fee is read from the backend.
export default function PaymentPage() {
  const state = useLocation().state
  const pay = useInitializePayment()
  const { data: fee, isError: feeError, error: feeErr } = useBookingFee()
  const [accepted, setAccepted] = useState(false)

  if (!state?.bookingReference) return <Navigate to="/book" replace />
  const { bookingReference, summary } = state

  const feeText = fee != null && !Number.isNaN(fee) ? formatNaira(fee) : '…'
  const busy = pay.isPending || pay.isSuccess // isSuccess = redirecting to Paystack

  function onPay(e) {
    e.preventDefault()
    if (busy) return
    // Not blocked on the client: if the box is unticked, the backend's own message is shown
    pay.mutate({ bookingReference, acceptedNonRefundable: accepted, idempotencyKey: newIdempotencyKey() })
  }

  return (
    <section className="container-x py-12 sm:py-16">
      <SectionHeading eyebrow="Book us · Step 3 of 3" title="Pay your booking fee" subtitle="Your booking only counts once this fee is confirmed." />

      <form onSubmit={onPay} className="mx-auto max-w-lg space-y-5 rounded-2xl border border-line bg-surface p-5 sm:p-8">
        {summary && (
          <dl className="space-y-1 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Name</dt>
              <dd className="truncate font-medium">{summary.name}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Event</dt>
              <dd className="truncate font-medium">{summary.eventType}</dd>
            </div>
            {summary.eventDate && (
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Date</dt>
                <dd className="font-medium">{formatDate(summary.eventDate)}</dd>
              </div>
            )}
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Reference</dt>
              <dd className="break-all font-mono text-xs">{bookingReference}</dd>
            </div>
          </dl>
        )}

        <div className="rounded-xl bg-brand-500/10 p-5 text-center">
          <p className="text-sm text-muted">Booking fee</p>
          <p className="mt-1 text-4xl font-extrabold">{feeText}</p>
          <p className="mt-2 text-xs text-muted">A fixed, non-refundable fee. It is not the final payment.</p>
        </div>
        {feeError && <FormError message={feeErr.message} />}

        <label className="flex items-start gap-3 text-sm">
          <input
            type="checkbox"
            checked={accepted}
            onChange={(e) => setAccepted(e.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 accent-brand-500"
          />
          <span>
            I understand and agree that the booking fee of <strong>{feeText}</strong> is non-refundable.
          </span>
        </label>

        <FormError message={pay.error?.message} />

        <Button type="submit" size="lg" className="w-full" loading={busy}>
          Pay {feeText}
        </Button>
        <p className="text-center text-xs text-muted">
          You will choose card, bank transfer or USSD on Paystack&apos;s secure page. We never see your card details.
        </p>
      </form>
    </section>
  )
}