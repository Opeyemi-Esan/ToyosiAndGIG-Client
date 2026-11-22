import apiClient, { unwrap } from '../../../services/apiClient'
import { ENDPOINTS } from '../../../services/endpoints'

export async function getProfile() {
  return unwrap(await apiClient.get(ENDPOINTS.profile))
}

// Only send the fields the user may change (email changes should go through a verified flow on the backend)
export async function updateProfile({ fullName, phoneNumber }) {
  return unwrap(await apiClient.put(ENDPOINTS.profile, { fullName, phoneNumber }))
}
