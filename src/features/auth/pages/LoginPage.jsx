import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import FormError from '../../../shared/components/FormError'
import { safeRedirect } from '../../../shared/utils/validation'
import Input from '../../../shared/components/Input'
import Button from '../../../shared/components/Button'

export default function LoginPage() {
  const { isAuthenticated, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const redirectTo = safeRedirect(location.state?.from)

  const [values, setValues] = useState({ email: '', password: '' })

  if (isAuthenticated) return <Navigate to={redirectTo} replace />

  const set = (name) => (e) => setValues((p) => ({ ...p, [name]: e.target.value }))

  function onSubmit(e) {
    e.preventDefault()
    login.mutate(values, { onSuccess: () => navigate(redirectTo, { replace: true }) })
  }

  return (
    <>
      <h1 className="text-2xl font-bold">Welcome back</h1>
      <p className="mt-1 text-sm text-muted">Sign in to see your bookings and manage your profile.</p>

      <form onSubmit={onSubmit} noValidate className="mt-6 space-y-4">
        <Input label="Email" type="email" autoComplete="email" maxLength={254} value={values.email} onChange={set('email')} />
        <Input label="Password" type="password" autoComplete="current-password" maxLength={128} value={values.password} onChange={set('password')} />
        <FormError message={login.error?.message} />
        <Button type="submit" className="w-full" loading={login.isPending}>
          Sign in
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        New here?{' '}
        <Link to="/register" className="font-semibold text-accent hover:underline">
          Create an account
        </Link>
      </p>
    </>
  )
}
