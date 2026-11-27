import { useId } from 'react'

const fieldClass =
  'w-full rounded-lg border border-line bg-surface px-3 py-2.5 text-fg placeholder:text-muted/70 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30 disabled:opacity-60 aria-[invalid=true]:border-red-500 aria-[invalid=true]:ring-red-500/20'

// Label + input/textarea + error message. Pass `multiline` for a textarea.
// Pass `required` to show a red star after the label (the browser's own validation stays off: forms use noValidate).
export default function Input({ label, error, hint, multiline = false, required = false, className = '', id: givenId, ...props }) {
  const autoId = useId()
  const id = givenId ?? autoId // a custom id lets the page focus this field (for example the first error)
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined
  const Tag = multiline ? 'textarea' : 'input'

  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} className="mb-1 block text-sm font-medium">
          {label}
          {required && (
            <span aria-hidden="true" className="ml-0.5 text-red-500">
              *
            </span>
          )}
        </label>
      )}
      <Tag id={id} aria-required={required || undefined} aria-invalid={error ? true : undefined} aria-describedby={describedBy} className={fieldClass} {...props} />
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