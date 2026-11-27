import { useEffect, useMemo } from 'react'
import Button from './Button'// adjust path to match your project

const COLORS = ['#e0a93b', '#b8862d', '#f5e6c8', '#ffffff', '#d97706']
const PIECES = 48
const AUTO_CLOSE_MS = 7000

export default function CelebrationSplash({ reference, onClose }) {
  // Random confetti, generated once per mount
  const pieces = useMemo(
    () =>
      Array.from({ length: PIECES }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: 6 + Math.random() * 8,
        delay: Math.random() * 1.2,
        duration: 3 + Math.random() * 3,
        drift: (Math.random() - 0.5) * 200,
        color: COLORS[i % COLORS.length],
        round: Math.random() > 0.6,
      })),
    []
  )

  useEffect(() => {
    const timer = setTimeout(onClose, AUTO_CLOSE_MS)
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => {
      clearTimeout(timer)
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="celebrate-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={onClose}
    >
      {/* Confetti */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        {pieces.map((p) => (
          <span
            key={p.id}
            className="confetti-piece"
            style={{
              left: `${p.left}%`,
              width: p.size,
              height: p.round ? p.size : p.size * 0.5,
              background: p.color,
              borderRadius: p.round ? '50%' : '2px',
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
              '--drift': `${p.drift}px`,
            }}
          />
        ))}
      </div>

      {/* Card */}
      <div
        className="splash-card relative w-full max-w-sm rounded-2xl border border-line bg-surface p-8 text-center shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent/15 text-3xl">
          🎉
        </div>
        <h2 id="celebrate-title" className="mt-4 text-2xl font-bold">
          Congratulations!
        </h2>
        <p className="mt-2 text-muted">
          Your booking fee has been received. We can't wait to make your event unforgettable.
        </p>
        {reference && <p className="mt-3 text-xs text-muted">Reference: {reference}</p>}
        <Button className="mt-6 w-full" onClick={onClose}>
          Continue
        </Button>
      </div>
    </div>
  )
}