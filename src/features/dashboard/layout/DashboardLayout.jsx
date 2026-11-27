import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../auth/hooks/useAuth'
import { CloseIcon, MenuIcon } from '../../../shared/components/Icons'
import { SITE } from '../../../shared/constants/site'
import Avatar from '../components/Avatar'
import logo from '../../../assets/images/logo.png'

const PATHS = {
  home: 'M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z',
  calendar: 'M8 2v4M16 2v4M3 8h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z',
  chart: 'M4 20V10M10 20V4M16 20v-7M22 20H2',
  user: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
  gift: 'M20 12v10H4V12M2 7h20v5H2zM12 22V7M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z',
  help: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3M12 17h.01',
  star: 'M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z',
  plus: 'M12 5v14M5 12h14',
  logout: 'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9',
}

const Icon = ({ name }) => (
  <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={PATHS[name]} />
  </svg>
)

const NAV = [
  { to: '/dashboard', label: 'Overview', icon: 'home', end: true },
  { to: '/dashboard/bookings', label: 'Bookings', icon: 'calendar' },
  { to: '/dashboard/status', label: 'Booking status', icon: 'chart' },
  { to: '/dashboard/profile', label: 'Profile', icon: 'user' },
  { to: '/dashboard/rewards', label: 'Rewards', icon: 'gift' },
  { to: '/contact', label: 'Help', icon: 'help' },
]

const linkBase = 'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium'
const linkClass = ({ isActive }) =>
  `${linkBase} ${isActive ? 'bg-brand-500/15 text-accent' : 'text-muted hover:bg-fg/5 hover:text-fg'}`

function useIsDesktop() {
  const query = '(min-width: 1024px)'
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches)
  useEffect(() => {
    const mq = window.matchMedia(query)
    const onChange = () => setMatches(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])
  return matches
}

export default function DashboardLayout() {
  const [open, setOpen] = useState(false)
  const isDesktop = useIsDesktop()
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  useEffect(() => setOpen(false), [pathname])
  useEffect(() => {
    if (isDesktop) setOpen(false)
  }, [isDesktop])

  useEffect(() => {
    if (!open) return undefined
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open])

  // Items fade/slide in one after another when the drawer opens (always visible on desktop)
  const motion = (i) => ({
    className: `transition-[opacity,transform,background-color,color] duration-300 motion-reduce:transition-none ${
      open ? 'translate-x-0 opacity-100' : '-translate-x-3 opacity-0'
    } lg:translate-x-0 lg:opacity-100`,
    style: { transitionDelay: open ? `${120 + i * 40}ms` : '0ms' },
  })

  const onLogout = () => logout.mutate(undefined, { onSettled: () => navigate('/', { replace: true }) })

  return (
    <div className="min-h-svh lg:grid lg:grid-cols-[18rem_1fr]">
      {/* Mobile top bar */}
      <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-line bg-bg/85 px-4 backdrop-blur lg:hidden">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls="dash-sidebar"
          aria-label={open ? 'Close menu' : 'Open menu'}
          className="grid h-10 w-10 cursor-pointer place-items-center rounded-full border border-line text-xl"
        >
          <MenuIcon className={`col-start-1 row-start-1 transition duration-300 motion-reduce:transition-none ${open ? 'rotate-90 opacity-0' : 'rotate-0 opacity-100'}`} />
          <CloseIcon className={`col-start-1 row-start-1 transition duration-300 motion-reduce:transition-none ${open ? 'rotate-0 opacity-100' : '-rotate-90 opacity-0'}`} />
        </button>
        {/* <span className="font-semibold">Dashboard</span>
        <Link to="/" className="ml-auto" aria-label={`${SITE.name} home`}>
          <img src={logo} alt="" width="36" height="36" className="h-9 w-9 rounded-full" />
        </Link> */}
        <Link to="/" className="flex min-w-0 items-center gap-2.5 font-bold" aria-label={`${SITE.name} home`}>
            <img src={logo} alt="" width="36" height="36" className="h-9 w-9 shrink-0 rounded-full" />
            <span className="truncate">{SITE.name}</span>
        </Link>
      </header>

      {/* Backdrop */}
      <div
        onClick={() => setOpen(false)}
        aria-hidden="true"
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 motion-reduce:transition-none lg:hidden ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />

      {/* Sidebar */}
      <aside
        id="dash-sidebar"
        inert={!isDesktop && !open}
        className={`fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85vw] flex-col border-r border-line bg-surface p-5 transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0.24,1)] motion-reduce:transition-none lg:sticky lg:top-0 lg:z-auto lg:h-svh lg:max-w-none lg:translate-x-0 ${
          open ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        <Link to="/" className="mb-5 flex items-center gap-3 rounded-xl" aria-label={`${SITE.name} home`}>
            <img src={logo} alt="" width="40" height="40" className="h-10 w-10 shrink-0 rounded-full" />
            <span className="min-w-0">
                <span className="block truncate font-bold">{SITE.name}</span>
                <span className="block text-xs text-muted">Back to website</span>
            </span>
        </Link>
       

        <nav aria-label="Dashboard" className="mt-5 flex-1 space-y-1 overflow-y-auto">
          {NAV.map((n, i) => {
            const m = motion(i)
            return (
              <NavLink key={n.to} to={n.to} end={n.end} className={(s) => `${linkClass(s)} ${m.className}`} style={m.style}>
                <Icon name={n.icon} /> {n.label}
              </NavLink>
            )
          })}
          {SITE.reviewUrl && (
            <a
              href={SITE.reviewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`${linkBase} text-muted hover:bg-fg/5 hover:text-fg ${motion(NAV.length).className}`}
              style={motion(NAV.length).style}
            >
              <Icon name="star" /> Rate us
            </a>
          )}
        </nav>

        <div className="space-y-2 border-t border-line pt-5">
          <div className="flex items-center gap-3 border-b border-line pb-5">
            <Avatar user={user} />
            <div className="min-w-0">
              <p className="truncate font-semibold">{user?.fullName}</p>
              <p className="truncate text-xs text-muted">{user?.email}</p>
            </div>
          </div>
          <Link to="/book" className="flex items-center justify-center gap-2 rounded-xl bg-brand-500 px-4 py-3 text-sm font-semibold text-ink hover:bg-brand-400">
            <Icon name="plus" /> Book now
          </Link>
          <button
            type="button"
            onClick={onLogout}
            disabled={logout.isPending}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-line px-4 py-3 text-sm font-medium hover:bg-fg/5 disabled:opacity-60"
          >
            <Icon name="logout" /> Log out
          </button>
        </div>
      </aside>

      <main className="min-w-0 p-4 sm:p-8">
        <Outlet />
      </main>
    </div>
  )
}