import { Link } from 'react-router-dom'
import { useDashboardSummary } from '../hooks/useDashboard'
import StatusChart from '../components/StatusChart'
import StatusBadge from '../components/StatusBadge'
import { formatDate, formatNaira } from '../../../shared/utils/format'

function Stat({ label, value, hint }) {
  return (
    <div className="rounded-2xl border border-line bg-surface p-5">
      <p className="text-xs font-semibold uppercase tracking-widest text-accent">{label}</p>
      <p className="mt-2 text-2xl font-bold">{value}</p>
      {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
    </div>
  )
}

export default function DashboardHome() {
  const { data, isPending, isError } = useDashboardSummary()

  if (isPending) return <div className="h-64 animate-pulse rounded-2xl bg-fg/10" />
  if (isError) return <p role="alert" className="text-red-600 dark:text-red-400">We couldn't load your dashboard. Please refresh.</p>

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Overview</h1>

      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="Bookings" value={data.totalBookings} />
        <Stat label="Total paid" value={formatNaira(data.totalPaid)} />
        <Stat label="Rewards" value="Coming soon" hint="Earn points on every booking" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-line bg-surface p-5">
          <h2 className="mb-4 font-semibold">Booking status</h2>
          <StatusChart counts={data.statusCounts} />
        </section>

        <section className="rounded-2xl border border-line bg-surface p-5">
          <h2 className="mb-4 font-semibold">Recent transactions</h2>
          {data.recentTransactions.length === 0 ? (
            <p className="text-sm text-muted">No transactions yet.</p>
          ) : (
            <ul className="divide-y divide-line">
              {data.recentTransactions.map((t) => (
                <li key={t.reference} className="flex items-center justify-between gap-3 py-3 text-sm">
                  <span className="min-w-0">
                    <span className="block font-medium">{formatNaira(t.amount)}</span>
                    <span className="block truncate text-xs text-muted">{t.bookingReference} · {formatDate(t.date)}</span>
                  </span>
                  <span className="rounded-full bg-green-500/10 px-2.5 py-1 text-xs text-green-700 dark:text-green-300">Paid</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <section className="rounded-2xl border border-line bg-surface p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-semibold">Recent bookings</h2>
          <Link to="/dashboard/bookings" className="text-sm font-semibold text-accent hover:underline">View all</Link>
        </div>
        {data.recentBookings.length === 0 ? (
          <p className="text-sm text-muted">
            You have no bookings yet. <Link to="/book" className="font-semibold text-accent hover:underline">Book us</Link>
          </p>
        ) : (
          <ul className="divide-y divide-line">
            {data.recentBookings.map((b) => (
              <li key={b.id} className="flex items-center justify-between gap-3 py-3 text-sm">
                <span className="min-w-0">
                  <span className="block truncate font-medium">{b.eventType} · {b.bookingReference}</span>
                  <span className="block text-xs text-muted">{b.eventDate ? formatDate(b.eventDate) : 'Date not set'}</span>
                </span>
                <StatusBadge status={b.status} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}