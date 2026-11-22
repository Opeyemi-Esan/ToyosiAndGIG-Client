// Only allow plain https links from API data (streaming links, media, covers).
// Blocks javascript:, data:, http: and malformed URLs.
export function safeUrl(value) {
  if (typeof value !== 'string') return null
  try {
    const url = new URL(value)
    return url.protocol === 'https:' ? url.href : null
  } catch {
    return null
  }
}

// Only the Paystack hosted checkout is accepted as a payment redirect target.
const ALLOWED_PAYMENT_HOSTS = new Set(['checkout.paystack.com'])
export function safePaymentUrl(value) {
  const href = safeUrl(value)
  if (!href) return null
  return ALLOWED_PAYMENT_HOSTS.has(new URL(href).hostname) ? href : null
}

// Unique key so a double-click or retry cannot create two bookings/payments.
export const newIdempotencyKey = () => crypto.randomUUID()

// YouTube ids are exactly 11 chars: anything else is rejected
export const isYoutubeId = (value) => typeof value === 'string' && /^[\w-]{11}$/.test(value)

export const FLYER_RULES = {
  maxBytes: 5 * 1024 * 1024,
  types: ['image/jpeg', 'image/png', 'image/webp'],
}

// Paystack reference format guard (untrusted query-string value)
export const isValidReference = (value) => typeof value === 'string' && /^[A-Za-z0-9._=-]{6,100}$/.test(value)
