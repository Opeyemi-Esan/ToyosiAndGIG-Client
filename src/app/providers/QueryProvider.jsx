import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      refetchOnWindowFocus: false,
      // Retry network/5xx once; never retry client errors (4xx) or cancelled calls
      retry: (failureCount, error) => failureCount < 1 && !(error?.status >= 400 && error?.status < 500),
    },
    mutations: { retry: false },
  },
})

export default function QueryProvider({ children }) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
