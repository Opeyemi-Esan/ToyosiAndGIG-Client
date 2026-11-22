import logo from '../../assets/images/logo.png'

// The GG logo with a ring and a dot rolling around it.
// Used for every "busy" state: the global API overlay, route loading and inline loading.
export default function Loader({ size = 96, label = 'Loading' }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="relative inline-grid place-items-center"
      style={{ width: size, height: size }}
    >
      {/* rolling ring */}
      <span
        aria-hidden="true"
        className="absolute inset-0 animate-spin rounded-full border-[3px] border-brand-500/20 border-t-brand-500 motion-reduce:animate-none"
      />
      {/* dot orbiting the logo */}
      <span aria-hidden="true" className="absolute inset-0 animate-spin motion-reduce:animate-none [animation-duration:1.6s]">
        <span className="absolute left-1/2 top-0 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/4 rounded-full bg-brand-400 shadow-[0_0_10px] shadow-brand-400" />
      </span>
      <img
        src={logo}
        alt=""
        width={size}
        height={size}
        className="h-[70%] w-[70%] animate-pulse rounded-full object-contain motion-reduce:animate-none"
      />
      <span className="sr-only">{label}</span>
    </div>
  )
}

// Centered loader that fills its container: for pages/sections while data loads
export function PageLoader({ label = 'Loading', className = '' }) {
  return (
    <div className={`grid min-h-[40vh] place-items-center ${className}`}>
      <Loader label={label} />
    </div>
  )
}
