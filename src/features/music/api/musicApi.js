import apiClient, { unwrap } from '../../../services/apiClient'
import { ENDPOINTS } from '../../../services/endpoints'
import { safeUrl } from '../../../shared/utils/security'

// Turns a raw API song into the shape the UI uses, and drops any unsafe (non-https) links.
// NOTE: field names are assumptions: align them with your Song DTO.
export function normalizeSong(raw) {
  const mediaType = String(raw.mediaType ?? '').toLowerCase()
  return {
    id: String(raw.id),
    title: raw.title ?? 'Untitled',
    artist: raw.artist ?? raw.artistName ?? 'Toyosi & GIG',
    isVideo: mediaType === 'video' || mediaType === '1',
    songType: raw.songType != null ? String(raw.songType) : '',
    description: raw.description ?? '',
    releaseDate: raw.releaseDate ?? raw.createdAt ?? null,
    isFeatured: Boolean(raw.isFeatured),
    albumId: raw.albumId ?? null,
    coverUrl: safeUrl(raw.coverUrl ?? raw.coverImageUrl),
    mediaUrl: safeUrl(raw.mediaUrl ?? raw.fileUrl), // direct file: playable in the in-site player
    streamingLink: safeUrl(raw.streamingLink), // external platform link
  }
}

export function normalizeAlbum(raw) {
  return {
    id: String(raw.id),
    title: raw.title ?? 'Untitled album',
    artist: raw.artist ?? raw.artistName ?? 'Toyosi & GIG',
    description: raw.description ?? '',
    releaseDate: raw.releaseDate ?? null,
    coverUrl: safeUrl(raw.coverUrl ?? raw.coverImageUrl),
    songs: Array.isArray(raw.songs) ? raw.songs.map(normalizeSong) : [],
  }
}

export async function getSongs(signal) {
  const data = (await unwrap(await apiClient.get(ENDPOINTS.songs.list, { signal }))) ?? []
  return data.map(normalizeSong)
}

export async function getFeaturedSongs(signal) {
  const data = (await unwrap(await apiClient.get(ENDPOINTS.featuredsongs.list, { signal }))) ?? []
  return data.map(normalizeSong)
}

export async function getSong(id, signal) {
  return normalizeSong(await unwrap(await apiClient.get(ENDPOINTS.songs.detail(id), { signal })))
}

export async function getAlbums(signal) {
  const data = (await unwrap(await apiClient.get(ENDPOINTS.albums.list, { signal, silent: true }))) ?? []
  return data.map(normalizeAlbum)
}

export async function getAlbum(id, signal) {
  return normalizeAlbum(await unwrap(await apiClient.get(ENDPOINTS.albums.detail(id), { signal })))
}
