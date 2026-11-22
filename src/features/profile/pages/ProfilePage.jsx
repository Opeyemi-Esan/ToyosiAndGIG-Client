import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../auth/hooks/useAuth'
import { useMyBookings } from '../../booking/hooks/useBooking'
import { useUpdateProfile } from '../hooks/useProfile'
import Input from '../../../shared/components/Input'
import Button from '../../../shared/components/Button'
import SectionHeading from '../../../shared/components/SectionHeading'
import FormError from '../../../shared/components/FormError'
import { formatDate } from '../../../shared/utils/format'

const STATUS_STYLES = {
  pending: 'bg-amber-500/15 text-amber-700 dark:text-amber-300',
  confirmed: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300',
  cancelled: 'bg-red-500/15 text-red-700 dark:text-red-300',
}

export default function ProfilePage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const update = useUpdateProfile()
  const bookings = useMyBookings()

  const [values, setValues] = useState({ fullName: user?.fullName ?? '', phoneNumber: user?.phoneNumber ?? '' })
  const [saved, setSaved] = useState(false)

  const set = (name) => (e) => {
    setSaved(false)
    setValues((p) => ({ ...p, [name]: e.target.value }))
  }

  function onSubmit(e) {
    e.preventDefault()
    update.mutate(values, { onSuccess: () => setSaved(true) })
  }

  const onLogout = () => logout.mutate(undefined, { onSettled: () => navigate('/', { replace: true }) })

  return (
    <section className="container-x py-12 sm:py-16">
      <SectionHeading eyebrow="Account" title="Your profile" align="left" />

      <div className="grid gap-8 lg:grid-cols-5">
        <form onSubmit={onSubmit} noValidate className="space-y-4 rounded-2xl border border-line bg-surface p-5 sm:p-6 lg:col-span-2">
          <h2 className="text-lg font-bold">Personal details</h2>
          <Input label="Full name" autoComplete="name" maxLength={100} value={values.fullName} onChange={set('fullName')} />
          <Input label="Email" value={user?.email ?? ''} disabled readOnly hint="Contact us to change your email" />
          <Input label="Phone" type="tel" autoComplete="tel" maxLength={20} value={values.phoneNumber} onChange={set('phoneNumber')} />
          <FormError message={update.error?.message} />
          {saved && <p role="status" className="rounded-lg bg-emerald-500/10 p-3 text-sm text-emerald-700 dark:text-emerald-300">Profile updated.</p>}
          <div className="flex flex-wrap gap-3">
            <Button type="submit" loading={update.isPending}>
              Save changes
            </Button>
            <Button variant="outline" onClick={onLogout} loading={logout.isPending}>
              Sign out
            </Button>
          </div>
        </form>

        <div className="lg:col-span-3">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold">My bookings</h2>
            <Button as={Link} to="/book" size="sm">
              New booking
            </Button>
          </div>

          {bookings.isError && <FormError message={bookings.error.message} />}
          {bookings.data?.length === 0 && (
            <p className="rounded-2xl border border-dashed border-line p-8 text-center text-muted">You have no bookings yet.</p>
          )}
          <ul className="space-y-3">
            {bookings.data?.map((b) => {
              const status = String(b.status ?? 'Pending')
              return (
                <li key={b.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-surface p-4">
                  <div className="min-w-0">
                    <p className="truncate font-semibold">{b.eventType}</p>
                    <p className="truncate text-sm text-muted">
                      {formatDate(b.eventDate)} · {b.eventLocation}
                    </p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLES[status.toLowerCase()] ?? 'bg-fg/10'}`}>{status}</span>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </section>
  )
}
