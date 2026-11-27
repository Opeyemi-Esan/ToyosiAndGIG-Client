import apiClient from '../../../services/apiClient'
import { ENDPOINTS } from '../../../services/endpoints'
import { safeUrl } from '../../../shared/utils/security'

export const PAGE_SIZE = 12

// The two kinds of gallery media. `value` is what the backend's GalleryMediaType enum is called.
export const MEDIA_TYPES = {
  image: { value: 'Image', label: 'Photos' },
  video: { value: 'Videos', label: 'Videos' },
}

const toNumber = (v) => (Number.isFinite(Number(v)) && v !== null && v !== '' ? Number(v) : null)

// `mediaKey` is the tab the person is on, so each item is labelled from what WE asked for
// (no guessing from the API's enum). Links that are not https are dropped.
function normalizeItem(raw, mediaKey) {
  return {
    id: String(raw.id),
    title: raw.title ?? '',
    description: raw.description ?? '',
    mediaKey,
    fileUrl: safeUrl(raw.fileUrl),
    capturedDate: raw.capturedDate ?? null,
  }
}

// Accepts either a plain list or a paged object, with the paging info inside `data` or next to it.
// Whatever is missing is worked out, so the page keeps working if the backend response is adjusted.
function readPage(body, mediaKey, pageNumber) {
  const payload = body?.data ?? body
  const list = Array.isArray(payload) ? payload : (payload?.items ?? payload?.results ?? payload?.records ?? payload?.data ?? [])
  const meta = { ...(body && typeof body === 'object' ? body : {}), ...(payload && !Array.isArray(payload) ? payload : {}) }

  const totalCount = toNumber(meta.totalCount ?? meta.totalItems ?? meta.totalRecords ?? meta.total)
  let totalPages = toNumber(meta.totalPages ?? meta.pageCount)
  if (!totalPages && totalCount !== null) totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE))

  const hasNext = typeof meta.hasNextPage === 'boolean' ? meta.hasNextPage : totalPages ? pageNumber < totalPages : list.length >= PAGE_SIZE

  return {
    items: list.map((raw) => normalizeItem(raw, mediaKey)).filter((item) => item.fileUrl),
    pageNumber,
    totalPages, // null when the backend does not say
    totalCount,
    hasNext,
    hasPrevious: pageNumber > 1,
  }
}

// Read-only: the client only fetches.
export async function getGallery({ mediaKey, pageNumber }, signal) {
  const res = await apiClient.get(ENDPOINTS.gallery.list, {
    params: { mediaType: MEDIA_TYPES[mediaKey].value, pageNumber, pageSize: PAGE_SIZE },
    signal,
  })
  return readPage(res.data, mediaKey, pageNumber)
}