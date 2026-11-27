import { Link, useSearchParams } from 'react-router-dom'
import { useDashboardBookings } from '../hooks/useDashboard'
import StatusBadge from '../components/StatusBadge'
import Button from '../../../shared/components/Button'
import { formatDate } from '../../../shared/utils/format'

const FILTERS = ['', 'Pending', 'Approved', 'Rejected', 'Completed']
const PAGE_SIZE = 10

export default function BookingsPage() {
  const [params, setParams] = useSearchParams()
  const raw = params.get('status') ?? ''
  const status = FILTERS.includes(raw) ? raw : ''
  const page = Math.max(1, Number(params.get('page')) || 1)

  const { data, isPending, isError, isPlaceholderData } = useDashboardBookings({ page, pageSize: PAGE_SIZE, status })
  const totalPages = data ? Math.max(1, Math.ceil(data.total / PAGE_SIZE)) : 1

  const update = (next) => setParams(next, { replace: true })

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Bookings</h1>

      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by status">
        {FILTERS.map((f) => (
          <button
            key={f || 'all'}
            type="button"
            aria-pressed={status === f}
            onClick={() => update(f ? { status: f } : {})}
            className={`cursor-pointer rounded-full border px-4 py-1.5 text-sm font-medium transition ${
              status === f ? 'border-brand-500 bg-brand-500/15 text-accent' : 'border-line text-muted hover:bg-fg/5'
            }`}
          >
            {f || 'All'}
          </button>
        ))}
      </div>

      {isPending ? (
        <div className="h-48 animate-pulse rounded-2xl bg-fg/10" />
      ) : isError ? (
        <p role="alert" className="text-red-600 dark:text-red-400">We couldn't load your bookings. Please refresh.</p>
      ) : data.items.length === 0 ? (
        <div className="rounded-2xl border border-line bg-surface p-8 text-center">
          <p className="text-muted">{status ? `No ${status.toLowerCase()} bookings.` : 'You have no bookings yet.'}</p>
          <Button as={Link} to="/book" className="mt-4">Book now</Button>
        </div>
      ) : (
        <>
          <ul className={`space-y-3 ${isPlaceholderData ? 'opacity-60' : ''}`}>
            {data.items.map((b) => (
              <li key={b.id} className="rounded-2xl border border-line bg-surface p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-semibold">{b.eventType}</p>
                    <p className="break-all font-mono text-xs text-muted">{b.bookingReference}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusBadge status={b.status} />
                    <span className="rounded-full bg-fg/5 px-2.5 py-1 text-xs">{b.isPaid ? 'Fee paid' : 'Fee unpaid'}</span>
                  </div>
                </div>
                <dl className="mt-3 grid gap-1 text-sm text-muted sm:grid-cols-2">
                  <div>Event date: <span className="text-fg">{b.eventDate ? formatDate(b.eventDate) : '-'}</span></div>
                  <div>Location: <span className="text-fg">{b.location || '-'}</span></div>
                  {b.venue && <div>Venue: <span className="text-fg">{b.venue}</span></div>}
                  <div>Booked on: <span className="text-fg">{formatDate(b.createdAt)}</span></div>
                </dl>
                {b.status === 'Rejected' && b.rejectionReason && (
                  <p className="mt-3 rounded-lg bg-red-500/10 p-3 text-sm text-red-700 dark:text-red-300">Reason: {b.rejectionReason}</p>
                )}
              </li>
            ))}
          </ul>

          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => update({ ...(status && { status }), page: String(page - 1) })}>Previous</Button>
              <span className="text-sm text-muted">Page {page} of {totalPages}</span>
              <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => update({ ...(status && { status }), page: String(page + 1) })}>Next</Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}