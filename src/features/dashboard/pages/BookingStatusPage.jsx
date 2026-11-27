import { Link } from 'react-router-dom'
import { useDashboardSummary } from '../hooks/useDashboard'
import StatusChart from '../components/StatusChart'
import { STATUS_COLORS } from '../components/StatusBadge'

const DESCRIPTIONS = {
  Pending: 'Waiting for us to agree the final details with you.',
  Approved: 'Confirmed. We will see you at the event.',
  Rejected: 'We could not take this booking.',
  Completed: 'The event is done. Thank you!',
}

export default function BookingStatusPage() {
  const { data, isPending, isError } = useDashboardSummary()

  if (isPending) return <div className="h-64 animate-pulse rounded-2xl bg-fg/10" />
  if (isError) return <p role="alert" className="text-red-600 dark:text-red-400">We couldn't load your booking status. Please refresh.</p>

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Booking status</h1>

      <section className="rounded-2xl border border-line bg-surface p-5">
        <StatusChart counts={data.statusCounts} />
      </section>

      <div className="grid gap-4 sm:grid-cols-2">
        {Object.entries(data.statusCounts).map(([status, count]) => (
          <Link
            key={status}
            to={`/dashboard/bookings?status=${status}`}
            className="rounded-2xl border border-line bg-surface p-5 transition hover:border-brand-500"
          >
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 font-semibold">
                <span className="h-3 w-3 rounded-full" style={{ background: STATUS_COLORS[status] }} />
                {status}
              </span>
              <span className="text-2xl font-bold">{count}</span>
            </div>
            <p className="mt-2 text-sm text-muted">{DESCRIPTIONS[status]}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}