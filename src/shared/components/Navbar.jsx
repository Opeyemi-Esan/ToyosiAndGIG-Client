import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import ThemeToggle from './ThemeToggle'
import Button from './Button'
import { CloseIcon, MenuIcon } from './Icons'
import { NAV_LINKS, SITE } from '../constants/site'
import { useAuth } from '../../features/auth/hooks/useAuth'
import logo from '../../assets/images/logo.png'

const desktopLink = ({ isActive }) =>
  `rounded-lg px-3 py-2 text-sm font-medium transition ${isActive ? 'text-accent' : 'text-fg/80 hover:text-fg hover:bg-fg/5'}`

const mobileLink = ({ isActive }) =>
  `block rounded-lg px-3 py-3 text-base font-medium ${isActive ? 'bg-brand-500/10 text-accent' : 'hover:bg-fg/5'}`

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { isAuthenticated } = useAuth()
  const close = () => setOpen(false)

  // Escape closes the mobile menu
  useEffect(() => {
    if (!open) return undefined
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const accountLink = isAuthenticated ? { to: '/profile', label: 'Profile' } : { to: '/login', label: 'Login' }

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-bg/85 backdrop-blur">
      <nav aria-label="Main" className="container-x flex h-16 items-center justify-between gap-3">
        <Link to="/" onClick={close} className="flex items-center gap-2.5" aria-label={`${SITE.name} home`}>
          <img src={logo} alt="" width="40" height="40" className="h-10 w-10 rounded-full" />
          <span className="hidden text-lg font-bold tracking-tight min-[400px]:inline">{SITE.name}</span>
        </Link>

        <div className="hidden items-center gap-0.5 lg:flex">
          {NAV_LINKS.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end} className={desktopLink}>
              {l.label}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link to={accountLink.to} className="hidden rounded-lg px-3 py-2 text-sm font-medium hover:bg-fg/5 sm:block">
            {accountLink.label}
          </Link>
          <Button as={Link} to="/book" size="sm" className="hidden sm:inline-flex">
            Book now
          </Button>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="grid h-10 w-10 place-items-center rounded-full border border-line text-xl lg:hidden"
          >
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </nav>

      {open && (
        <div id="mobile-menu" className="max-h-[calc(100svh-4rem)] overflow-y-auto border-t border-line bg-bg lg:hidden">
          <div className="container-x space-y-1 py-4">
            {NAV_LINKS.map((l) => (
              <NavLink key={l.to} to={l.to} end={l.end} onClick={close} className={mobileLink}>
                {l.label}
              </NavLink>
            ))}
            <NavLink to={accountLink.to} onClick={close} className={mobileLink}>
              {accountLink.label}
            </NavLink>
            <Button as={Link} to="/book" onClick={close} className="mt-3 w-full">
              Book now
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}
