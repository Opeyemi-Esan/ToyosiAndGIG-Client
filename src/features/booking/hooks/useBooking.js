import { useMutation, useQuery } from '@tanstack/react-query'
import { useAuthStore } from '../../auth/store/authStore'
import * as bookingApi from '../api/bookingApi'

export function useCreateBooking() {
  return useMutation({
    mutationFn: ({ values, flyer, idempotencyKey }) => bookingApi.createBooking(values, flyer, idempotencyKey),
  })
}

export function useMyBookings() {
  const isAuthenticated = useAuthStore((s) => Boolean(s.user))
  return useQuery({
    queryKey: ['bookings', 'mine'],
    queryFn: bookingApi.getMyBookings,
    enabled: isAuthenticated,
  })
}
