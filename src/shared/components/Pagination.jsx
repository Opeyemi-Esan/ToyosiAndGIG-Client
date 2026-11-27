// Previous / page numbers / Next.
// `totalPages` may be null (the backend did not say): then only Previous and Next are shown.
function pageList(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const pages = new Set([1, total, current, current - 1, current + 1])
  if (current <= 3) [2, 3, 4].forEach((p) => pages.add(p))
  if (current >= total - 2) [total - 1, total - 2, total - 3].forEach((p) => pages.add(p))
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b)
  const out = []
  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1] > 1) out.push('…')
    out.push(p)
  })
  return out
}

const base = 'grid h-10 min-w-10 place-items-center rounded-lg border px-3 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-40'

export default function Pagination({ page, totalPages, hasNext, hasPrevious, onChange, disabled = false }) {
  if (!hasPrevious && !hasNext) return null

  return (
    <nav aria-label="Pagination" className="mt-10 flex flex-wrap items-center justify-center gap-2">
      <button type="button" onClick={() => onChange(page - 1)} disabled={disabled || !hasPrevious} className={`${base} border-line hover:bg-fg/5`}>
        ← Previous
      </button>

      {totalPages ? (
        pageList(page, totalPages).map((p, i) =>
          p === '…' ? (
            <span key={`gap-${i}`} aria-hidden="true" className="px-1 text-muted">
              …
            </span>
          ) : (
            <button
              key={p}
              type="button"
              onClick={() => onChange(p)}
              disabled={disabled}
              aria-label={`Page ${p}`}
              aria-current={p === page ? 'page' : undefined}
              className={`${base} ${p === page ? 'border-brand-500 bg-brand-500 text-ink' : 'border-line hover:bg-fg/5'}`}
            >
              {p}
            </button>
          )
        )
      ) : (
        <span className="px-2 text-sm text-muted">Page {page}</span>
      )}

      <button type="button" onClick={() => onChange(page + 1)} disabled={disabled || !hasNext} className={`${base} border-line hover:bg-fg/5`}>
        Next →
      </button>
    </nav>
  )
}