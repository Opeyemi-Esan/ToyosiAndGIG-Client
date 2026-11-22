import { useMutation, useQuery } from '@tanstack/react-query'
import * as paymentApi from '../api/paymentApi'
import { isValidReference, safePaymentUrl } from '../../../shared/utils/security'

// The fee to display, read from the backend
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
    mutationFn: async ({ bookingReference, acceptedNonRefundable, idempotencyKey }) => {
      const data = await paymentApi.initializePayment({ bookingReference, acceptedNonRefundable }, idempotencyKey)
      const url = safePaymentUrl(paymentApi.extractCheckoutUrl(data)) // only checkout.paystack.com is allowed
      if (!url) throw new Error('Could not start payment. Please try again.')
      return url
    },
    onSuccess: (url) => window.location.assign(url),
  })
}

// Keeps checking for about 30s in case the webhook arrives a moment after the customer returns
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