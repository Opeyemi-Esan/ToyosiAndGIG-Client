import { Link, Outlet } from 'react-router-dom'
import ThemeToggle from '../../shared/components/ThemeToggle'
import { SITE } from '../../shared/constants/site'
import logo from '../../assets/images/logo.png'

const AuthLayout = () => (
  <div className="flex min-h-svh flex-col">
    <header className="container-x flex h-16 items-center justify-between">
      <Link to="/" className="flex items-center gap-2.5 font-bold">
        <img src={logo} alt="" width="40" height="40" className="h-10 w-10 rounded-full" />
        {SITE.name}
      </Link>
      <ThemeToggle />
    </header>
    <main className="grid flex-1 place-items-center px-4 py-8 sm:py-10">
      <div className="grid w-full max-w-4xl overflow-hidden rounded-2xl border border-line bg-surface shadow-sm lg:grid-cols-2">
        {/* order-first = on top on mobile; lg:order-last = on the right on desktop */}
        <aside className="order-first flex min-h-40 flex-col justify-end gap-2 bg-linear-to-br from-brand-500/30 via-brand-500/10 to-transparent p-6 sm:p-8 lg:order-last lg:min-h-[32rem]">
          <p className="text-xs font-semibold uppercase tracking-widest text-accent">{SITE.heroname}</p>
          <h2 className="text-xl font-bold sm:text-2xl lg:text-3xl">{SITE.tagline}</h2>
        </aside>
        <div className="p-6 sm:p-8 lg:p-10">
          <Outlet />
        </div>
      </div>
    </main>
  </div>
)

export default AuthLayout