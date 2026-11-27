import apiClient, { unwrap } from '../../../services/apiClient'
import { ENDPOINTS } from '../../../services/endpoints'
import { isYoutubeId, safeUrl } from '../../../shared/utils/security'

// Pulls the 11-character video id out of any normal YouTube link (watch, youtu.be, live, embed, shorts)
export function youtubeIdFromUrl(link) {
  const href = safeUrl(link)
  if (!href) return null
  const url = new URL(href)
  const host = url.hostname.replace(/^www\.|^m\./, '')
  let id = null
  if (host === 'youtu.be') id = url.pathname.slice(1).split('/')[0]
  else if (host === 'youtube.com' || host === 'youtube-nocookie.com') {
    id = url.searchParams.get('v') ?? url.pathname.match(/^\/(?:live|embed|shorts)\/([^/?]+)/)?.[1]
  }
  return isYoutubeId(id) ? id : null
}

// The API may send the category as text ("Highlights") or as a number. A number cannot be read
// reliably, so it is worked out from the fields the backend already requires:
// Live needs a live link, Highlights needs a video.
function categoryName(raw) {
  if (typeof raw.owanbeCategory === 'string' && Number.isNaN(Number(raw.owanbeCategory))) return raw.owanbeCategory
  const hasLink = Boolean(raw.liveLink)
  const hasVideo = Boolean(raw.videoUrl)
  if (hasLink && !hasVideo) return 'Live'
  if (hasVideo && !hasLink) return 'Highlights'
  if (hasLink && hasVideo) return raw.isLive ? 'Live' : 'Highlights'
  return 'Other'
}

// Turns an OwanbeDto into the shape the UI uses. Any link that is not https is dropped.
export function normalizeOwanbe(raw) {
  const liveLink = safeUrl(raw.liveLink)
  return {
    id: String(raw.id),
    title: raw.title ?? 'Untitled',
    description: raw.description ?? '',
    category: categoryName(raw),
    videoUrl: safeUrl(raw.videoUrl), // uploaded file: plays in the site's own video player
    thumbnailUrl: safeUrl(raw.thumbnailUrl),
    liveLink, // external link (YouTube links play inside the site, others open in a new tab)
    youtubeId: youtubeIdFromUrl(liveLink),
    isLive: Boolean(raw.isLive),
    eventDate: raw.eventDate ?? null,
  }
}

// Read-only: the client only fetches. `category` and `take` are both optional.
export async function getOwanbe({ category, take } = {}, { signal, silent = false } = {}) {
  const params = {}
  if (category) params.category = category
  if (take) params.take = take
  const data = (await unwrap(await apiClient.get(ENDPOINTS.owanbe.list, { params, signal, silent }))) ?? []
  return data.map(normalizeOwanbe)
}