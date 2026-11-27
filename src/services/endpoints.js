// All backend paths in one place. Align these with your controllers.
const id = (value) => encodeURIComponent(value)

export const ENDPOINTS = {
  auth: {
    login: '/api/auth/login',
    register: '/api/auth/register',
    logout: '/api/auth/logout',
    refresh: '/api/auth/refresh-token',
  },
  account: { 
    confirmEmail: '/api/account/confirm-email', 
    sendConfirmation: '/api/account/send-confirmation' 
  },
  dashboard: { 
    summary: '/api/dashboard/summary', 
    bookings: '/api/dashboard/bookings' 
  },
  profilePicture: '/api/profile/picture',
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
    list: '/api/Song/songs',
    detail: (songId) => `/api/songs/${id(songId)}`,
  },
  featuredsongs: {
    list: '/api/Song/featured-songs',
    detail: (songId) => `/api/songs/${id(songId)}`,
  },
  albums: {
    list: '/api/albums',
    detail: (albumId) => `/api/albums/${id(albumId)}`,
  },
   owanbe: {
    list: '/api/Owanbe/get-owanbe', // GET ?category=Highlights&take=4 (both optional)
  },
   gallery: {
    list: '/api/Gallery/get-gallery', // GET ?mediaType=Image|Video&pageNumber=1&pageSize=12
  },
  testimonies: '/api/testimonies',
  contact: '/api/contact',
}
