// All backend paths in one place. Align these with your controllers.
const id = (value) => encodeURIComponent(value)

export const ENDPOINTS = {
  auth: {
    login: '/api/auth/login',
    register: '/api/auth/register',
    logout: '/api/auth/logout',
    refresh: '/api/auth/refresh-token',
  },
  profile: '/api/profile',
  bookings: {
    create: '/api/booking/create-booking',
    mine: '/api/booking/mine',
  },
  payments: {
    bookingFee: '/api/Payment/booking-fee', // GET: the fee comes from the backend
    initialize: '/api/Payment/initialize', // POST { BookingReference, AcceptedNonRefundable }
    verify: '/api/Payment/verify', // GET ?reference=...
  },
  songs: {
    list: '/api/songs',
    detail: (songId) => `/api/songs/${id(songId)}`,
  },
  albums: {
    list: '/api/albums',
    detail: (albumId) => `/api/albums/${id(albumId)}`,
  },
  testimonies: '/api/testimonies',
  contact: '/api/contact',
}
