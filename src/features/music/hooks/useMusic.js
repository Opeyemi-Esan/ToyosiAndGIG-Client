import { useQuery } from '@tanstack/react-query'
import * as musicApi from '../api/musicApi'

const byNewest = (a, b) => new Date(b.releaseDate ?? 0) - new Date(a.releaseDate ?? 0)

// Shared query key: every section on the home page reuses ONE request

export function useSongs() {
  return useQuery({
    queryKey: ['songs'],
    queryFn: ({ signal }) => musicApi.getSongs(signal),
    select: (songs) => [...songs].sort(byNewest),
    staleTime: 5 * 60 * 1000,
  })
}

export function useFeaturedSongs() {
  return useQuery({
    queryKey: ['featuredsongs'],
    queryFn: ({ signal }) => musicApi.getFeaturedSongs(signal),
    select: (songs) => [...songs].sort(byNewest),
    staleTime: 5 * 60 * 1000,
  })
}

export function useAlbums() {
  return useQuery({
    queryKey: ['albums'],
    queryFn: ({ signal }) => musicApi.getAlbums(signal),
    staleTime: 5 * 60 * 1000,
  })
}

export function useAlbum(id) {
  return useQuery({
    queryKey: ['albums', id],
    queryFn: ({ signal }) => musicApi.getAlbum(id, signal),
    enabled: Boolean(id),
  })
}
