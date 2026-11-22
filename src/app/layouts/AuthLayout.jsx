import { Link, Outlet } from 'react-router-dom'
import ThemeToggle from '../../shared/components/ThemeToggle'
import { SITE } from '../../shared/constants/site'
import logo from '../../assets/images/logo.png'

// Centered card layout for Login / Register
const AuthLayout = () => (
  <div className="flex min-h-svh flex-col">
    <header className="container-x flex h-16 items-center justify-between">
      <Link to="/" className="flex items-center gap-2.5 font-bold">
        <img src={logo} alt="" width="40" height="40" className="h-10 w-10 rounded-full" />
        {SITE.name}
      </Link>
      <ThemeToggle />
    </header>
    <main className="grid flex-1 place-items-center px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-line bg-surface p-6 shadow-sm sm:p-8">
        <Outlet />
      </div>
    </main>
  </div>
)

export default AuthLayout
