import { useRef, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useAuth } from '../../auth/hooks/useAuth'
import { useAuthStore } from '../../auth/store/authStore'
import { uploadPicture } from '../api/dashboardApi'
import Avatar from '../components/Avatar'
import Button from '../../../shared/components/Button'
import FormError from '../../../shared/components/FormError'

const TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX = 5 * 1024 * 1024

export default function ProfilePage() {
  const { user } = useAuth()
  const setUser = useAuthStore((s) => s.setUser)
  const input = useRef(null)
  const [clientError, setClientError] = useState('')

  const upload = useMutation({
    mutationFn: uploadPicture,
    onSuccess: (profile) => setUser({ ...user, profilePictureUrl: profile.profilePictureUrl }), // updates the sidebar too
  })

  function onPick(e) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    if (!TYPES.includes(file.type)) return setClientError('Choose a JPG, PNG or WebP image.')
    if (file.size > MAX) return setClientError('Image must be under 5MB.')
    setClientError('')
    upload.mutate(file)
  }

  return (
    <div className="max-w-xl space-y-6">
      <h1 className="text-2xl font-bold">Profile</h1>

      <div className="flex flex-wrap items-center gap-5 rounded-2xl border border-line bg-surface p-5">
        <Avatar user={user} size="h-20 w-20" text="text-2xl" />
        <div>
          <input ref={input} type="file" accept={TYPES.join(',')} className="hidden" onChange={onPick} />
          <Button type="button" variant="outline" loading={upload.isPending} onClick={() => input.current?.click()}>
            {user?.profilePictureUrl ? 'Change picture' : 'Upload picture'}
          </Button>
          <p className="mt-2 text-xs text-muted">JPG, PNG or WebP, up to 5MB.</p>
        </div>
      </div>

      <FormError message={clientError || upload.error?.message} />

      <dl className="divide-y divide-line rounded-2xl border border-line bg-surface px-5 text-sm">
        {[
          ['Name', user?.fullName],
          ['Email', user?.email],
          ['Phone', user?.phoneNumber],
        ].map(([label, value]) => (
          <div key={label} className="flex justify-between gap-4 py-3">
            <dt className="text-muted">{label}</dt>
            <dd className="min-w-0 break-all text-right font-medium">{value || '-'}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}