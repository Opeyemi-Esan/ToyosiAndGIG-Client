import { useEffect, useRef } from 'react'
import { CloseIcon } from './Icons'

// Built on the native <dialog>: focus trap, Escape to close and inert background come for free.
// Children are only rendered while open, so videos/iframes stop when it closes.
export default function Modal({ open, onClose, title, children, className = '' }) {
  const ref = useRef(null)

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog
      ref={ref}
      aria-label={title}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === ref.current) onClose() // click on the backdrop
      }}
      className={`m-auto max-h-[92vh] w-[min(94vw,60rem)] overflow-hidden rounded-2xl bg-surface p-0 text-fg shadow-2xl backdrop:bg-black/80 backdrop:backdrop-blur-sm ${className}`}
    >
      {open && (
        <div className="relative">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full bg-black/60 text-white hover:bg-black/80"
          >
            <CloseIcon />
          </button>
          {children}
        </div>
      )}
    </dialog>
  )
}
