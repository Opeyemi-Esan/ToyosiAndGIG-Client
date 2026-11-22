// Small inline SVG icon set (no external requests, inherits text colour)
const base = {
  width: '1em',
  height: '1em',
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
}

const filled = { ...base, fill: 'currentColor', stroke: 'none' }

export const SunIcon = (p) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </svg>
)
export const MoonIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
  </svg>
)
export const MenuIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M4 6h16M4 12h16M4 18h16" />
  </svg>
)
export const CloseIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
)
export const PlayIcon = (p) => (
  <svg {...filled} {...p}>
    <path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z" />
  </svg>
)
export const PauseIcon = (p) => (
  <svg {...filled} {...p}>
    <rect x="6" y="5" width="4" height="14" rx="1" />
    <rect x="14" y="5" width="4" height="14" rx="1" />
  </svg>
)
export const NextIcon = (p) => (
  <svg {...filled} {...p}>
    <path d="M6 5.5v13a1 1 0 0 0 1.5.86l8-6.5a1 1 0 0 0 0-1.72l-8-6.5A1 1 0 0 0 6 5.5zM17 5h2v14h-2z" />
  </svg>
)
export const PrevIcon = (p) => (
  <svg {...filled} {...p}>
    <path d="M18 5.5v13a1 1 0 0 1-1.5.86l-8-6.5a1 1 0 0 1 0-1.72l8-6.5A1 1 0 0 1 18 5.5zM5 5h2v14H5z" />
  </svg>
)
export const VolumeIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M11 5L6 9H3v6h3l5 4z" />
    <path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13" />
  </svg>
)
export const MuteIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M11 5L6 9H3v6h3l5 4z" />
    <path d="M22 9l-6 6M16 9l6 6" />
  </svg>
)
export const QuoteIcon = (p) => (
  <svg {...filled} {...p}>
    <path d="M7.2 6C4.9 7.2 3.5 9.4 3.5 12.2V18h6v-6H6.3c.1-1.5.8-2.5 2.100-3.200zM17.7 6c-2.300 1.200-3.700 3.400-3.700 6.200V18h6v-6h-3.200c.1-1.500.8-2.500 2.100-3.200z" />
  </svg>
)
export const CheckIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M5 12.5l4.500 4.500L19 7.500" />
  </svg>
)
export const ExternalIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
  </svg>
)
export const MusicIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M9 18V5l12-2v13" />
    <circle cx="6" cy="18" r="3" />
    <circle cx="18" cy="16" r="3" />
  </svg>
)
