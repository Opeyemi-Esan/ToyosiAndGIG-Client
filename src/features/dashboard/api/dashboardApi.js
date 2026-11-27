import apiClient, { unwrap } from '../../../services/apiClient'
import { ENDPOINTS } from '../../../services/endpoints'

export const getSummary = async (signal) =>
  unwrap(await apiClient.get(ENDPOINTS.dashboard.summary, { signal, silent: true }))

export const getBookings = async ({ page, pageSize, status }, signal) =>
  unwrap(await apiClient.get(ENDPOINTS.dashboard.bookings, { params: { page, pageSize, status: status || undefined }, signal, silent: true }))

export async function uploadPicture(file) {
  const body = new FormData()
  body.append('file', file)
  return unwrap(await apiClient.post(ENDPOINTS.profilePicture, body))
}