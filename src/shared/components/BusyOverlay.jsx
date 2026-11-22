import { useEffect, useState } from 'react'
import { useBusyStore } from '../../services/busyStore'
import Loader from './Loader'

const SHOW_AFTER_MS = 250 // quick calls never flash the overlay

// Full-screen logo loader shown while ANY API call is in flight
export default function BusyOverlay() {
  const busy = useBusyStore((s) => s.count > 0)
  const [delayed, setDelayed] = useState(false)

  useEffect(() => {
    if (!busy) return undefined
    const timer = setTimeout(() => setDelayed(true), SHOW_AFTER_MS)
    return () => {
      clearTimeout(timer)
      setDelayed(false)
    }
  }, [busy])

  if (!busy || !delayed) return null

  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-bg/75 backdrop-blur-sm" aria-busy="true">
      <Loader size={112} label="Please wait" />
    </div>
  )
}
