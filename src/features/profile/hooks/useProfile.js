import { useMutation } from '@tanstack/react-query'
import { useAuthStore } from '../../auth/store/authStore'
import * as profileApi from '../api/profileApi'

export function useUpdateProfile() {
  const setUser = useAuthStore((s) => s.setUser)
  const user = useAuthStore((s) => s.user)

  return useMutation({
    mutationFn: profileApi.updateProfile,
    // Keep the signed-in user in sync so the navbar/forms show the new details
    onSuccess: (updated, variables) => setUser({ ...user, ...variables, ...(updated && typeof updated === 'object' ? updated : {}) }),
  })
}
