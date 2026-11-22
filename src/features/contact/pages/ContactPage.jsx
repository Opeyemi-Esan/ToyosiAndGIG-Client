import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { sendMessage } from '../api/contactApi'
import Input from '../../../shared/components/Input'
import Button from '../../../shared/components/Button'
import SectionHeading from '../../../shared/components/SectionHeading'
import FormError from '../../../shared/components/FormError'
import { SITE } from '../../../shared/constants/site'

const EMPTY = { name: '', email: '', subject: '', message: '', website: '' } // `website` = honeypot

export default function ContactPage() {
  const [values, setValues] = useState(EMPTY)
  const [sent, setSent] = useState(false)
  const send = useMutation({ mutationFn: sendMessage })

  const set = (name) => (e) => setValues((p) => ({ ...p, [name]: e.target.value }))

  function onSubmit(e) {
    e.preventDefault()
    // Bots fill the hidden field; pretend success without calling the API
    if (values.website) {
      setSent(true)
      return
    }
    const { website: _honeypot, ...payload } = values
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
    <section className="container-x py-12 sm:py-16">
      <SectionHeading eyebrow="Contact" title="Let's talk" subtitle="Questions about an event, a collaboration or a booking? Send us a message." />

      <div className="mx-auto grid max-w-4xl gap-8 lg:grid-cols-5">
        {details.length > 0 && (
          <div className="space-y-4 lg:col-span-2">
            {details.map((d) => (
              <a key={d.label} href={d.href} className="block rounded-2xl border border-line bg-surface p-4 transition hover:border-brand-500">
                <p className="text-xs font-semibold uppercase tracking-widest text-accent">{d.label}</p>
                <p className="mt-1 break-all font-medium">{d.value}</p>
              </a>
            ))}
          </div>
        )}

        <form
          onSubmit={onSubmit}
          noValidate
          className={`space-y-4 rounded-2xl border border-line bg-surface p-5 sm:p-8 ${details.length ? 'lg:col-span-3' : 'lg:col-span-5'}`}
        >
          {sent ? (
            <div role="status" className="py-8 text-center">
              <h2 className="text-xl font-bold">Message sent</h2>
              <p className="mt-2 text-muted">Thank you! We will get back to you soon.</p>
              <Button variant="outline" className="mt-6" onClick={() => setSent(false)}>
                Send another
              </Button>
            </div>
          ) : (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <Input label="Name" autoComplete="name" maxLength={100} value={values.name} onChange={set('name')} />
                <Input label="Email" type="email" autoComplete="email" maxLength={254} value={values.email} onChange={set('email')} />
              </div>
              <Input label="Subject" maxLength={150} value={values.subject} onChange={set('subject')} />
              <Input label="Message" multiline rows={5} maxLength={2000} value={values.message} onChange={set('message')} />

              {/* Honeypot: hidden from people and screen readers */}
              <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
                <label>
                  Website
                  <input tabIndex={-1} autoComplete="off" value={values.website} onChange={set('website')} />
                </label>
              </div>

              <FormError message={send.error?.message} />
              <Button type="submit" size="lg" className="w-full" loading={send.isPending}>
                Send message
              </Button>
            </>
          )}
        </form>
      </div>
    </section>
  )
}
