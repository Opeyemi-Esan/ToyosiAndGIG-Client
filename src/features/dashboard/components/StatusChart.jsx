// StatusChart.jsx: dependency-free SVG donut
import { STATUS_COLORS } from './StatusBadge'

export default function StatusChart({ counts = {} }) {
  const entries = Object.entries(counts).filter(([, n]) => n > 0)
  const total = entries.reduce((sum, [, n]) => sum + n, 0)
  if (!total) return <p className="py-8 text-center text-sm text-muted">No bookings yet.</p>

  const R = 40
  const C = 2 * Math.PI * R
  let offset = 0

  return (
    <div className="flex flex-col items-center gap-6 sm:flex-row">
      <div className="relative h-40 w-40 shrink-0">
        <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90" role="img" aria-label="Bookings by status">
          <circle cx="50" cy="50" r={R} fill="none" stroke="currentColor" strokeOpacity="0.08" strokeWidth="14" />
          {entries.map(([status, n]) => {
            const len = (n / total) * C
            const el = (
              <circle key={status} cx="50" cy="50" r={R} fill="none" stroke={STATUS_COLORS[status] ?? '#9ca3af'}
                strokeWidth="14" strokeDasharray={`${len} ${C - len}`} strokeDashoffset={-offset} />
            )
            offset += len
            return el
          })}
        </svg>
        <div className="absolute inset-0 grid place-items-center text-center">
          <div><p className="text-2xl font-bold">{total}</p><p className="text-xs text-muted">bookings</p></div>
        </div>
      </div>
      <ul className="space-y-2 text-sm">
        {entries.map(([status, n]) => (
          <li key={status} className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full" style={{ background: STATUS_COLORS[status] ?? '#9ca3af' }} />
            {status}: <strong>{n}</strong>
          </li>
        ))}
      </ul>
    </div>
  )
}