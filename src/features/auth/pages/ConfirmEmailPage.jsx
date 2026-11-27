import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import * as authApi from '../api/authApi'
import FormError from '../../../shared/components/FormError'
import Input from '../../../shared/components/Input'
import Button from '../../../shared/components/Button'

export default function ConfirmEmailPage() {
  const [email, setEmail] = useState(useLocation().state?.email ?? '')
  const [otp, setOtp] = useState('')
  const [resent, setResent] = useState(false)
  const confirm = useMutation({ mutationFn: authApi.confirmEmail })
  const resend = useMutation({ mutationFn: authApi.resendConfirmation, onSuccess: () => setResent(true) })

  if (confirm.isSuccess) {
    return (
      <div role="status" className="py-4 text-center">
        <h1 className="text-2xl font-bold">Email confirmed</h1>
        <p className="mt-2 text-muted">You can now sign in.</p>
        <Button as={Link} to="/login" className="mt-6 w-full">Sign in</Button>
      </div>
    )
  }

  return (
    <>
      <h1 className="text-2xl font-bold">Confirm your email</h1>
      <p className="mt-1 text-sm text-muted">Enter the code we sent to your email address.</p>

      <form
        noValidate
        className="mt-6 space-y-4"
        onSubmit={(e) => {
          e.preventDefault()
          setResent(false)
          confirm.mutate({ email: email.trim(), otp: otp.trim() })
        }}
      >
        <Input label="Email" type="email" autoComplete="email" maxLength={254} value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input label="Confirmation code" inputMode="numeric" autoComplete="one-time-code" maxLength={10} value={otp} onChange={(e) => setOtp(e.target.value)} />
        <FormError message={confirm.error?.message || resend.error?.message} />
        {resent && <p role="status" className="text-sm text-muted">A new code is on its way.</p>}
        <Button type="submit" className="w-full" loading={confirm.isPending}>Confirm email</Button>
        <Button type="button" variant="ghost" className="w-full" loading={resend.isPending} disabled={!email.trim()} onClick={() => resend.mutate(email.trim())}>
          Resend code
        </Button>
      </form>
    </>
  )
}