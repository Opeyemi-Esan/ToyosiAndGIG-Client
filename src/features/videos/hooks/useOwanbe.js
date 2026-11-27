import { useQuery } from '@tanstack/react-query'
import { getOwanbe } from '../api/OwanbeApi'

const byNewest = (a, b) => new Date(b.eventDate ?? 0) - new Date(a.eventDate ?? 0)

// `silent` keeps the full-screen logo loader away (used for the home page section, which loads in the background)
export function useOwanbe({ category, take, silent = false } = {}) {
  return useQuery({
    queryKey: ['owanbe', category ?? 'all', take ?? 'all'],
    queryFn: ({ signal }) => getOwanbe({ category, take }, { signal, silent }),
    select: (items) => [...items].sort(byNewest),
    staleTime: 5 * 60 * 1000,
  })
}