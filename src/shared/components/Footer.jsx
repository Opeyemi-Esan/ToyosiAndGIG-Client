import { Link } from 'react-router-dom'
import { NAV_LINKS, SITE } from '../constants/site'
import { safeUrl } from '../utils/security'
import logo from '../../assets/images/logo.png'

const YEAR = new Date().getFullYear()

export default function Footer() {
  const socials = SITE.socials.map((s) => ({ ...s, href: safeUrl(s.href) })).filter((s) => s.href)

  return (
    <footer className="border-t border-line bg-surface">
      <div className="container-x grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <Link to="/" className="inline-flex items-center gap-3">
            <img src={logo} alt="" width="48" height="48" loading="lazy" className="h-12 w-12 rounded-full" />
            <span className="text-xl font-bold">{SITE.name}</span>
          </Link>
          <p className="mt-4 max-w-sm text-sm text-muted">{SITE.tagline}.</p>
        </div>

        <nav aria-label="Footer">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-accent">Explore</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {NAV_LINKS.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="text-muted hover:text-fg">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-widest text-accent">Get in touch</h2>
          <ul className="mt-4 space-y-2 text-sm text-muted">
            {SITE.email && (
              <li>
                <a href={`mailto:${SITE.email}`} className="hover:text-fg">
                  {SITE.email}
                </a>
              </li>
            )}
            {SITE.phone && <li>{SITE.phone}</li>}
            {socials.map((s) => (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noopener noreferrer" className="hover:text-fg">
                  {s.label}
                </a>
              </li>
            ))}
            <li>
              <Link to="/book" className="font-semibold text-accent hover:underline">
                Book us for your event →
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line py-5 text-center text-xs text-muted">
        © {YEAR} {SITE.name}. All rights reserved.
      </div>
    </footer>
  )
}
