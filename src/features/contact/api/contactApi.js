import apiClient, { unwrap } from '../../../services/apiClient'
import { ENDPOINTS } from '../../../services/endpoints'

export async function sendMessage(payload) {
  return unwrap(await apiClient.post(ENDPOINTS.contact, payload))
}