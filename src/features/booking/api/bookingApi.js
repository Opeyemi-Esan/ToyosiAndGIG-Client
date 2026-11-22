import apiClient, { unwrap } from '../../../services/apiClient'
import { ENDPOINTS } from '../../../services/endpoints'

// Saves the booking as UNPAID and returns it, including its BookingReference.
export async function createBooking(values, flyerFile, idempotencyKey) {
  const form = new FormData()
  form.append('CustomerName', values.customerName)
  form.append('CustomerPhone', values.customerPhone)
  form.append('CustomerEmail', values.customerEmail)
  form.append('EventCountry', values.eventCountry)
  form.append('EventState', values.eventState)
  form.append('EventTownOrCity', values.eventTownOrCity)
  form.append('EventType', values.eventType)
  form.append('EventDate', values.eventDate)
  form.append('Venue', values.venue)
  form.append('Notes', values.notes)
  if (flyerFile) form.append('EventFlyer', flyerFile)

  const res = await apiClient.post(ENDPOINTS.bookings.create, form, {
    headers: { 'Idempotency-Key': idempotencyKey },
  })
  return unwrap(res) // expected to include bookingReference
}

export async function getMyBookings() {
  return (await unwrap(await apiClient.get(ENDPOINTS.bookings.mine))) ?? []
}