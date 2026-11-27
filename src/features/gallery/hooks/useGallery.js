import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getGallery } from '../api/galleryApi'

// keepPreviousData: the current page stays on screen while the next one loads (no flash of an empty grid)
export function useGallery({ mediaKey, pageNumber }) {
  return useQuery({
    queryKey: ['gallery', mediaKey, pageNumber],
    queryFn: ({ signal }) => getGallery({ mediaKey, pageNumber }, signal),
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000,
  })
}