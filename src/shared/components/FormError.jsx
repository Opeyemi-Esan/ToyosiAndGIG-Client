// Shows an error message from the backend. Several messages (one per line) are kept on separate lines.
export default function FormError({ message }) {
  if (!message) return null
  return (
    <p role="alert" className="whitespace-pre-line rounded-lg bg-red-500/10 p-3 text-sm text-red-700 dark:text-red-300">
      {message}
    </p>
  )
}
