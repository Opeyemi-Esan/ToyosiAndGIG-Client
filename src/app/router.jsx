import { createBrowserRouter } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import AuthLayout from './layouts/AuthLayout'
import ProtectedRoute from '../features/auth/components/ProtectedRoute'
import { PageLoader } from '../shared/components/Loader'
import { Navigate } from 'react-router-dom'

// Every page is loaded on demand (code splitting), so the first visit downloads only what it needs.
const page = (importer) => ({
  lazy: async () => ({ Component: (await importer()).default }),
})

export const router = createBrowserRouter([
  {
    HydrateFallback: () => <PageLoader className="min-h-screen" />,
    children: [
      {
        element: <MainLayout />,
        children: [
          { index: true, ...page(() => import('../features/home/pages/HomePage')) },
          { path: 'about', ...page(() => import('../features/about/pages/AboutPage')) },
          { path: 'services', ...page(() => import('../features/services/pages/ServicePage')) },
          { path: 'music', ...page(() => import('../features/music/pages/MusicPage')) },
          { path: 'music/albums/:id', ...page(() => import('../features/music/pages/AlbumPage')) },
          { path: 'videos', ...page(() => import('../features/videos/pages/VideosPage')) },
          { path: 'gallery', ...page(() => import('../features/gallery/pages/GalleryPage')) },
          { path: 'contact', ...page(() => import('../features/contact/pages/ContactPage')) },

          { path: 'book', ...page(() => import('../features/booking/pages/BookingPage')) },
          { path: 'book/payment', ...page(() => import('../features/payment/pages/PaymentPage')) },
          { path: 'booking/success', ...page(() => import('../features/booking/pages/BookingSuccessPage')) },
          // Set the backend's Paystack callback URL to https://YOUR-SITE/payment/success
          { path: 'payment/callback', ...page(() => import('../features/payment/pages/PaymentSuccessPage')) },
          { path: 'payment/success', ...page(() => import('../features/payment/pages/PaymentSuccessPage')) },
          { path: 'payment/failed', ...page(() => import('../features/payment/pages/PaymentFailedPage')) },

          {
            element: <ProtectedRoute />,
            children: [{ path: 'profile', element: <Navigate to="/dashboard/profile" replace /> }],
            //children: [{ path: 'profile', ...page(() => import('../features/profile/pages/ProfilePage')) }],
          },

          { path: '*', ...page(() => import('../features/home/pages/NotFoundPage')) },
        ],
      },
      {
        element: <AuthLayout />,
        children: [
          { path: 'login', ...page(() => import('../features/auth/pages/LoginPage')) },
          { path: 'register', ...page(() => import('../features/auth/pages/RegisterPage')) },
          { path: 'confirm-email', ...page(() => import('../features/auth/pages/ConfirmEmailPage')) },
        ],
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: 'dashboard',
            ...page(() => import('../features/dashboard/layout/DashboardLayout')),
            children: [
              { index: true, ...page(() => import('../features/dashboard/pages/DashboardHome')) },
              { path: 'bookings', ...page(() => import('../features/dashboard/pages/BookingsPage')) },
              { path: 'status', ...page(() => import('../features/dashboard/pages/BookingStatusPage')) },
              { path: 'profile', ...page(() => import('../features/dashboard/pages/ProfilePage')) },
              { path: 'rewards', ...page(() => import('../features/dashboard/pages/RewardsPage')) },
            ],
          },
        ],
      },
    ],
  },
])
