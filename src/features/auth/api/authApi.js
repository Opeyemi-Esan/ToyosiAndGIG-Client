import apiClient, { unwrap } from '../../../services/apiClient'
import { ENDPOINTS } from '../../../services/endpoints'

// Expected response for login/register/refresh: { accessToken, user: { id, fullName, email, ... } }
export async function login(values) {
  return unwrap(await apiClient.post(ENDPOINTS.auth.login, values))
}

export async function register(values) {
  return unwrap(await apiClient.post(ENDPOINTS.auth.register, values))
}

export async function logout() {
  await apiClient.post(ENDPOINTS.auth.logout, null, { silent: true })
}

// Silent: runs in the background on page load, so no loader overlay
export async function refresh() {
  return unwrap(await apiClient.post(ENDPOINTS.auth.refresh, null, { silent: true }))
}
