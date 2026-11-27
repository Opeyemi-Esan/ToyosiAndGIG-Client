import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import FormError from '../../../shared/components/FormError'
import Input from '../../../shared/components/Input'
import Button from '../../../shared/components/Button'

export default function RegisterPage() {
  const { isAuthenticated, register } = useAuth()
  const navigate = useNavigate()
  const [values, setValues] = useState({ firstName: '', lastName: '', email: '', phoneNumber: '', password: '', confirmPassword: '' })
  const [errors, setErrors] = useState({})

  if (isAuthenticated) return <Navigate to="/dashboard" replace />

  const set = (name) => (e) => setValues((p) => ({ ...p, [name]: e.target.value }))

  function onSubmit(e) {
    e.preventDefault()
    if (values.confirmPassword !== values.password) {
      setErrors({ confirmPassword: 'Passwords do not match' })
      return
    }
    setErrors({})
    const { confirmPassword: _confirm, ...payload } = values
    register.mutate(payload, {
      onSuccess: () => navigate('/confirm-email', { replace: true, state: { email: values.email.trim() } }),
    })
  }

  return (
    <>
      <h1 className="text-2xl font-bold">Create your account</h1>
      <p className="mt-1 text-sm text-muted">Track your bookings, payments and rewards.</p>

      <form onSubmit={onSubmit} noValidate className="mt-6 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="First name" autoComplete="given-name" maxLength={100} value={values.firstName} onChange={set('firstName')} />
          <Input label="Last name" autoComplete="family-name" maxLength={100} value={values.lastName} onChange={set('lastName')} />
        </div>
        <Input label="Email" type="email" autoComplete="email" maxLength={254} value={values.email} onChange={set('email')} />
        <Input label="Phone number" type="tel" inputMode="numeric" autoComplete="tel" maxLength={11} value={values.phoneNumber} onChange={set('phoneNumber')} />
        <Input label="Password" type="password" autoComplete="new-password" maxLength={128} value={values.password} onChange={set('password')} hint="At least 8 characters" />
        <Input label="Confirm password" type="password" autoComplete="new-password" maxLength={128} value={values.confirmPassword} onChange={set('confirmPassword')} error={errors.confirmPassword} />
        <FormError message={register.error?.message} />
        <Button type="submit" className="w-full" loading={register.isPending}>Create account</Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-accent hover:underline">Sign in</Link>
      </p>
    </>
  )
}