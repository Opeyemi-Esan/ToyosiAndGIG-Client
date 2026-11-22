import { useId } from 'react'

const fieldClass =
  'w-full rounded-lg border border-line bg-surface px-3 py-2.5 text-fg placeholder:text-muted/70 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30 disabled:opacity-60'

// Label + input/textarea + error message. Pass `multiline` for a textarea.
export default function Input({ label, error, hint, multiline = false, className = '', ...props }) {
  const id = useId()
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined
  const Tag = multiline ? 'textarea' : 'input'

  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} className="mb-1 block text-sm font-medium">
          {label}
        </label>
      )}
      <Tag id={id} aria-invalid={error ? true : undefined} aria-describedby={describedBy} className={fieldClass} {...props} />
      {error ? (
        <p id={`${id}-error`} role="alert" className="mt-1 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="mt-1 text-xs text-muted">
          {hint}
        </p>
      ) : null}
    </div>
  )
}
