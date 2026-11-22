import apiClient, { unwrap } from '../../../services/apiClient'
import { ENDPOINTS } from '../../../services/endpoints'

// NOTE: field names are assumptions: align them with your contact DTO.
export async function sendMessage({ name, email, subject, message }) {
  return unwrap(await apiClient.post(ENDPOINTS.contact, { name, email, subject, message }))
}
