import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { PageLoader } from '../../../shared/components/Loader'

// UX guard only. The backend must still authorise every protected API call.
export default function ProtectedRoute() {
  const { ready, isAuthenticated } = useAuth()
  const location = useLocation()

  if (!ready) return <PageLoader />
  if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: location.pathname }} />
  return <Outlet />
}
