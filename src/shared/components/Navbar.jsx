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
  `block rounded-lg px-3 py-3 text-base font-medium transition-[opacity,transform,background-color] duration-300 motion-reduce:transition-none ${
    isActive ? 'bg-brand-500/10 text-accent' : 'hover:bg-fg/5'
  }`

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

  //const accountLink = isAuthenticated ? { to: '/profile', label: 'Profile' } : { to: '/login', label: 'Login' }
  const accountLink = isAuthenticated ? { to: '/dashboard', label: 'Dashboard' } : { to: '/login', label: 'Login' }

  // Each item fades and slides in one after another when the menu opens
  const items = [...NAV_LINKS, accountLink]
  const itemMotion = (i) => ({
    className: open ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0',
    style: { transitionDelay: open ? `${80 + i * 35}ms` : '0ms' },
  })

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

          {/* Hamburger turns into an X: the two icons are stacked and rotate/fade into each other */}
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="grid h-10 w-10 place-items-center rounded-full border border-line text-xl lg:hidden cursor-pointer"
          >
            <MenuIcon
              className={`col-start-1 row-start-1 transition duration-300 motion-reduce:transition-none ${open ? 'rotate-90 opacity-0' : 'rotate-0 opacity-100'}`}
            />
            <CloseIcon
              className={`col-start-1 row-start-1 transition duration-300 motion-reduce:transition-none ${open ? 'rotate-0 opacity-100' : '-rotate-90 opacity-0'}`}
            />
          </button>
        </div>
      </nav>

      {/* Slide-down panel. It stays mounted so it can animate both ways; `inert` keeps the
          hidden links out of tab order and away from screen readers while it is closed.
          It floats over the page (absolute), so the content below does not jump. */}
      <div
        id="mobile-menu"
        inert={!open}
        className={`absolute inset-x-0 top-full grid bg-bg shadow-lg transition-[grid-template-rows,opacity] duration-300 ease-out motion-reduce:transition-none lg:hidden ${
          open ? 'grid-rows-[1fr] border-b border-line opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <div className="container-x max-h-[calc(100svh-4rem)] space-y-1 overflow-y-auto py-4">
            {NAV_LINKS.map((l, i) => {
              const m = itemMotion(i)
              return (
                <NavLink
                  key={l.to}
                  to={l.to}
                  end={l.end}
                  onClick={close}
                  className={(s) => `${mobileLink(s)} ${m.className}`}
                  style={m.style}
                >
                  {l.label}
                </NavLink>
              )
            })}
            <NavLink
              to={accountLink.to}
              onClick={close}
              className={(s) => `${mobileLink(s)} ${itemMotion(NAV_LINKS.length).className}`}
              style={itemMotion(NAV_LINKS.length).style}
            >
              {accountLink.label}
            </NavLink>
            <div
              className={`pt-2 transition-[opacity,transform] duration-300 motion-reduce:transition-none ${itemMotion(items.length).className}`}
              style={itemMotion(items.length).style}
            >
              <Button as={Link} to="/book" onClick={close} className="w-full">
                Book now
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}