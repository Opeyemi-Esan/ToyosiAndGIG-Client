import ErrorBoundary from '../../shared/components/ErrorBoundary'
import BusyOverlay from '../../shared/components/BusyOverlay'
import QueryProvider from './QueryProvider'
import { useSessionBootstrap } from '../../features/auth/hooks/useAuth'

function SessionBootstrap() {
  useSessionBootstrap()
  return null
}

// Everything the app needs around the router: errors, data cache, session, and the logo loader
export default function AppProviders({ children }) {
  return (
    <ErrorBoundary>
      <QueryProvider>
        <SessionBootstrap />
        {children}
        <BusyOverlay />
      </QueryProvider>
    </ErrorBoundary>
  )
}
