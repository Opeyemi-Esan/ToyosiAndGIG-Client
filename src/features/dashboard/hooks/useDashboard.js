import { keepPreviousData, useQuery } from '@tanstack/react-query'
import * as api from '../api/dashboardApi'

export const useDashboardSummary = () =>
  useQuery({ queryKey: ['dashboard', 'summary'], queryFn: ({ signal }) => api.getSummary(signal), staleTime: 60_000 })

export const useDashboardBookings = (params) =>
  useQuery({
    queryKey: ['dashboard', 'bookings', params],
    queryFn: ({ signal }) => api.getBookings(params, signal),
    placeholderData: keepPreviousData,
    staleTime: 60_000,
  })