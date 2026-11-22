import apiClient, { unwrap } from '../../../services/apiClient'
import { ENDPOINTS } from '../../../services/endpoints'

// The booking fee in naira (from the backend, so the amount never lives in the frontend)
export async function getBookingFee() {
  return Number(unwrap(await apiClient.get(ENDPOINTS.payments.bookingFee)))
}

// Asks the backend for a Paystack checkout link.
export async function initializePayment({ bookingReference, acceptedNonRefundable }, idempotencyKey) {
  const res = await apiClient.post(
    ENDPOINTS.payments.initialize,
    { BookingReference: bookingReference, AcceptedNonRefundable: acceptedNonRefundable },
    { headers: { 'Idempotency-Key': idempotencyKey } },
  )
  return unwrap(res)
}

// Finds the checkout link in the response (your API returns authorizationUrl)
export function extractCheckoutUrl(data) {
  if (typeof data === 'string') return data
  return (
    data?.authorizationUrl ??
    data?.authorization_url ??
    data?.checkoutUrl ??
    data?.paymentUrl ??
    data?.paymentLink ??
    data?.url ??
    data?.link ??
    null
  )
}

// Status check. GET /api/Payment/verify?reference=...
export async function verifyPayment(reference) {
  return unwrap(await apiClient.get(ENDPOINTS.payments.verify, { params: { reference }, silent: true }))
}

const status = (data) => String(data?.status ?? data?.paymentStatus ?? '').toLowerCase()

export const isPaidResult = (data) =>
  Boolean(data?.isPaid ?? data?.paid) || ['success', 'successful', 'paid'].includes(status(data))

export const isFailedResult = (data) => ['failed', 'abandoned', 'cancelled', 'reversed'].includes(status(data))