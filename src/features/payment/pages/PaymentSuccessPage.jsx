import { useEffect, useState } from 'react'
import { Link, Navigate, useSearchParams } from 'react-router-dom'
import { useVerifyPayment } from '../hooks/usePayment'
import { isFailedResult, isPaidResult } from '../api/paymentApi'
import { PageLoader } from '../../../shared/components/Loader'
import Button from '../../../shared/components/Button'
import { isValidReference } from '../../../shared/utils/security'

const GIVE_UP_AFTER_MS = 35000

// Paystack sends the customer back here (?reference=...). Set this URL as the callback URL on the backend.
// The booking is confirmed by the webhook on your server, not by this page.
export default function PaymentSuccessPage() {
  const [params] = useSearchParams()
  const reference = params.get('reference') || params.get('trxref') || ''
  const { data, error } = useVerifyPayment(reference)

  const [gaveUp, setGaveUp] = useState(false)
  useEffect(() => {
    const timer = setTimeout(() => setGaveUp(true), GIVE_UP_AFTER_MS)
    return () => clearTimeout(timer)
  }, [])

  if (!isValidReference(reference)) return <Navigate to="/payment/failed" replace />
  if (data && isPaidResult(data)) return <Navigate to="/booking/success" replace state={{ paid: true, reference }} />
  if (data && isFailedResult(data)) return <Navigate to="/payment/failed" replace state={{ reference }} />

  // Not confirmed yet (the webhook can take a moment) or the status check itself failed
  if (!gaveUp && !error) return <PageLoader label="Confirming your payment" />

  return (
    <section className="container-x py-20 text-center">
      <div className="mx-auto max-w-md">
        <h1 className="text-3xl font-bold">We are still confirming your payment</h1>
        <p className="mt-3 text-muted">
          {error?.message ? `${error.message} ` : ''}
          If you were charged, your booking is confirmed automatically and a confirmation email will arrive shortly. You do not need to pay again.
        </p>
        <p className="mt-3 break-all text-xs text-muted">Reference: {reference}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button as={Link} to="/">
            Back to home
          </Button>
          <Button as={Link} to="/contact" variant="outline">
            Contact us
          </Button>
        </div>
      </div>
    </section>
  )
}