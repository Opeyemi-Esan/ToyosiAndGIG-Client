const VARIANTS = {
  primary: 'bg-brand-500 text-ink hover:bg-brand-400 focus-visible:outline-brand-500',
  outline: 'border border-line text-fg hover:bg-fg/5',
  light: 'border border-white/40 text-white hover:bg-white/10 backdrop-blur',
  ghost: 'text-fg hover:bg-fg/5',
}

const SIZES = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-sm sm:text-base',
  lg: 'px-7 py-3.5 text-base',
}

// Works as a <button> by default, or pass `as={Link}` / `as="a"` for navigation.
export default function Button({
  as: Tag = 'button',
  variant = 'primary',
  size = 'md',
  loading = false,
  className = '',
  children,
  disabled,
  ...props
}) {
  const isButton = Tag === 'button'
  return (
    <Tag
      {...(isButton ? { type: props.type ?? 'button', disabled: disabled || loading } : {})}
      className={`inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...props}
    >
      {loading && (
        <span aria-hidden="true" className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      {children}
    </Tag>
  )
}
