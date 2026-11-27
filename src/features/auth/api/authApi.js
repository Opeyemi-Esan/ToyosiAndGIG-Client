import apiClient, { unwrap } from '../../../services/apiClient'
import { ENDPOINTS } from '../../../services/endpoints'
import { toSession } from './session'

export async function login(values) {
  return toSession(unwrap(await apiClient.post(ENDPOINTS.auth.login, values)))
}

// No session is returned: the email must be confirmed first
export async function register(values) {
  await apiClient.post(ENDPOINTS.auth.register, values)
  return null
}

export async function logout() {
  await apiClient.post(ENDPOINTS.auth.logout, null, { silent: true })
}

export async function confirmEmail({ email, otp }) {
  await apiClient.post(ENDPOINTS.account.confirmEmail, { email, otp })
}

export async function resendConfirmation(email) {
  await apiClient.post(ENDPOINTS.account.sendConfirmation, { email })
}