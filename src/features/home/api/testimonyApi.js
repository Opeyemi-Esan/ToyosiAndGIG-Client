import apiClient, { unwrap } from '../../../services/apiClient'
import { ENDPOINTS } from '../../../services/endpoints'

// NOTE: field names are assumptions: align them with your testimony DTO.
export async function getTestimonies(signal) {
  const data = (await unwrap(await apiClient.get(ENDPOINTS.testimonies, { signal, silent: true }))) ?? []
  return data.map((t) => ({
    id: String(t.id),
    name: t.name ?? t.fullName ?? 'Anonymous',
    role: t.role ?? t.eventType ?? '',
    message: String(t.message ?? t.content ?? '').slice(0, 600),
  }))
}
