import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { sendMessage } from '../api/contactApi'
import Input from '../../../shared/components/Input'
import Button from '../../../shared/components/Button'
import FormError from '../../../shared/components/FormError'
import { SITE } from '../../../shared/constants/site'
import bannerImage from '../../../assets/images/hero-poster.jpg'
import logo from '../../../assets/images/logo.png'

const EMPTY = { name: '', email: '', subject: '', message: '', website: '' } // `website` = honeypot
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MIN_MESSAGE_LENGTH = 10

// Turns an API failure into something a customer can understand
function friendlyError(error) {
  if (!error) return ''
  const status = error.response?.status ?? error.status
  if (status === 429) return "You've sent several messages recently. Please try again in a few minutes."
  if (status === 400) return 'Please check your details and try again.'
  return error.message || "We couldn't send your message. Please try again."
}

export default function ContactPage() {
  const [values, setValues] = useState(EMPTY)
  const [sent, setSent] = useState(false)
  const [clientError, setClientError] = useState('')
  const send = useMutation({ mutationFn: sendMessage })

  const set = (name) => (e) => {
    setValues((p) => ({ ...p, [name]: e.target.value }))
    if (clientError) setClientError('')
  }

  function onSubmit(e) {
    e.preventDefault()

    // Bots fill the hidden field; pretend success without calling the API
    if (values.website) {
      setSent(true)
      return
    }

    const payload = {
      name: values.name.trim(),
      email: values.email.trim(),
      subject: values.subject.trim(),
      message: values.message.trim(),
    }

    if (!payload.name || !payload.subject) {
      setClientError('Please enter your name and a subject.')
      return
    }
    if (!EMAIL_RE.test(payload.email)) {
      setClientError('Please enter a valid email address.')
      return
    }
    if (payload.message.length < MIN_MESSAGE_LENGTH) {
      setClientError(`Your message must be at least ${MIN_MESSAGE_LENGTH} characters.`)
      return
    }

    setClientError('')
    send.mutate(payload, {
      onSuccess: () => {
        setSent(true)
        setValues(EMPTY)
      },
    })
  }

  const details = [
    SITE.email && { label: 'Email', value: SITE.email, href: `mailto:${SITE.email}` },
    SITE.phone && { label: 'Phone', value: SITE.phone, href: `tel:${SITE.phone.replace(/[^+\d]/g, '')}` },
    SITE.whatsapp && { label: 'WhatsApp', value: `+${SITE.whatsapp}`, href: `https://wa.me/${SITE.whatsapp.replace(/\D/g, '')}` },
  ].filter(Boolean)

  return (
    <section className="container-x py-10 sm:py-14">
      <div className="mx-auto grid max-w-6xl overflow-hidden rounded-3xl border border-line bg-surface shadow-xl lg:grid-cols-2">
        {/* LEFT: banner */}
        <div
          className="relative isolate flex flex-col justify-between gap-10 bg-ink bg-cover bg-center p-8 text-white sm:p-10 lg:min-h-[640px]"
          style={{ backgroundImage: `url(${bannerImage})` }}
        >
          <div aria-hidden="true" className="absolute inset-0 -z-10 bg-linear-to-t from-ink via-ink/75 to-ink/50" />

          <img src={logo} alt="" className="h-14 w-14 rounded-full" />

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-400">Contact</p>
            <h1 className="mt-3 text-4xl font-extrabold tracking-tight sm:text-5xl">Let&apos;s talk</h1>
            <p className="mt-4 max-w-md text-stone-200">Questions about an event, a collaboration or a booking? Send us a message.</p>

            {(details.length > 0 || SITE.socials.length > 0) && (
              <ul className="mt-8 space-y-3">
                {details.map((d) => (
                  <li key={d.label}>
                    <a href={d.href} className="block rounded-xl border border-white/15 bg-white/5 p-4 backdrop-blur transition hover:border-brand-400 hover:bg-white/10">
                      <span className="block text-xs font-semibold uppercase tracking-widest text-brand-400">{d.label}</span>
                      <span className="mt-1 block break-all font-medium">{d.value}</span>
                    </a>
                  </li>
                ))}
                {SITE.socials.length > 0 && (
                  <li className="flex flex-wrap gap-x-5 gap-y-2 pt-2 text-sm">
                    {SITE.socials.map((s) => (
                      <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="font-medium text-brand-400 hover:underline">
                        {s.label}
                      </a>
                    ))}
                  </li>
                )}
              </ul>
            )}
          </div>
        </div>

        {/* RIGHT: form */}
        <form onSubmit={onSubmit} noValidate className="relative space-y-4 p-6 sm:p-10">
          {sent ? (
            <div role="status" className="grid min-h-[320px] place-content-center text-center">
              <h2 className="text-2xl font-bold">Message sent</h2>
              <p className="mt-2 text-muted">Thank you! We will get back to you soon.</p>
              <div>
                <Button
                  type="button"
                  variant="outline"
                  className="mt-6 cursor-pointer"
                  onClick={() => {
                    setSent(false)
                    send.reset()
                  }}
                >
                  Send another
                </Button>
              </div>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-bold">Send us a message</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <Input required label="Name" autoComplete="name" maxLength={100} value={values.name} onChange={set('name')} />
                <Input required label="Email" type="email" autoComplete="email" maxLength={254} value={values.email} onChange={set('email')} />
              </div>
              <Input required label="Subject" maxLength={150} value={values.subject} onChange={set('subject')} />
              <Input
                required
                label="Message"
                multiline
                rows={6}
                minLength={MIN_MESSAGE_LENGTH}
                maxLength={2000}
                value={values.message}
                onChange={set('message')}
              />

              {/* Honeypot: hidden from people and screen readers */}
              <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
                <label>
                  Website
                  <input tabIndex={-1} autoComplete="off" value={values.website} onChange={set('website')} />
                </label>
              </div>

              <FormError message={clientError || friendlyError(send.error)} />
              <Button type="submit" size="lg" className="w-full cursor-pointer" loading={send.isPending}>
                Send message
              </Button>
            </>
          )}
        </form>
      </div>
    </section>
  )
}