import { useQuery } from '@tanstack/react-query'
import { getTestimonies } from '../api/testimonyApi'

export function useTestimonies() {
  return useQuery({
    queryKey: ['testimonies'],
    queryFn: ({ signal }) => getTestimonies(signal),
    staleTime: 10 * 60 * 1000,
  })
}
