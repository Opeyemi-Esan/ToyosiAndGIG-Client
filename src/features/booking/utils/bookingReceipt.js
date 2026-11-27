// Remembers the booking details across the trip to Paystack and back, so the success page can show them.
// Kept in sessionStorage (this tab only, gone when the tab is closed) and keyed by the PAYMENT reference.
// Nothing here is trusted for payment: the payment status always comes from the backend.
const key = (paymentReference) => `booking-receipt-${paymentReference}`

export function saveReceipt(paymentReference, receipt) {
  if (!paymentReference) return
  try {
    sessionStorage.setItem(key(paymentReference), JSON.stringify(receipt))
  } catch {
    /* storage blocked: the success page simply shows less */
  }
}

export function loadReceipt(paymentReference) {
  if (!paymentReference) return null
  try {
    const raw = sessionStorage.getItem(key(paymentReference))
    const data = raw ? JSON.parse(raw) : null
    return data && typeof data === 'object' ? data : null
  } catch {
    return null
  }
}