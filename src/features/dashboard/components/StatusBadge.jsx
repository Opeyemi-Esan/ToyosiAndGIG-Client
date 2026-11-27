// StatusBadge.jsx
export const STATUS_COLORS = { Pending: '#e0a93b', Approved: '#22c55e', Rejected: '#ef4444', Completed: '#3b82f6' }

export default function StatusBadge({ status }) {
  const color = STATUS_COLORS[status] ?? '#9ca3af'
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-fg/5 px-2.5 py-1 text-xs font-medium">
      <span className="h-2 w-2 rounded-full" style={{ background: color }} />
      {status}
    </span>
  )
}