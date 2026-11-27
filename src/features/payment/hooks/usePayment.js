import { useMutation, useQuery } from '@tanstack/react-query'
import * as paymentApi from '../api/paymentApi'
import { isValidReference, safePaymentUrl } from '../../../shared/utils/security'
import { saveReceipt } from '../../booking/utils/bookingReceipt'

// The fee to display, read from the backend (cached, so every page shares one request)
export function useBookingFee() {
  return useQuery({
    queryKey: ['payment', 'booking-fee'],
    queryFn: paymentApi.getBookingFee,
    staleTime: 10 * 60 * 1000,
  })
}

// Gets the Paystack checkout link and sends the browser there
export function useInitializePayment() {
  return useMutation({
    mutationFn: async ({ bookingReference, acceptedNonRefundable, idempotencyKey, summary }) => {
      const data = await paymentApi.initializePayment({ bookingReference, acceptedNonRefundable }, idempotencyKey)
      const url = safePaymentUrl(paymentApi.extractCheckoutUrl(data)) // only checkout.paystack.com is allowed
      if (!url) throw new Error('Could not start payment. Please try again.')

      // Remember the booking details so the success page can show them when Paystack sends the customer back
      saveReceipt(data?.reference ?? data?.Reference, { bookingReference, summary })
      return url
    },
    onSuccess: (url) => window.location.assign(url),
  })
}

// Checks the payment status, and keeps checking every few seconds (about 30s) because the
// Paystack webhook can arrive a moment after the customer is sent back to the site.
export function useVerifyPayment(reference) {
  return useQuery({
    queryKey: ['payment', 'verify', reference],
    queryFn: () => paymentApi.verifyPayment(reference),
    enabled: isValidReference(reference),
    retry: false,
    refetchInterval: (query) => {
      const { data, status, dataUpdateCount } = query.state
      if (status === 'error') return false
      if (data && (paymentApi.isPaidResult(data) || paymentApi.isFailedResult(data))) return false
      return dataUpdateCount < 8 ? 4000 : false
    },
  })
}