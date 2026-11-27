import { useTestimonies } from '../hooks/useTestimonies'
import SectionHeading from '../../../shared/components/SectionHeading'
import Reveal from '../../../shared/components/Reveal'
import { QuoteIcon } from '../../../shared/components/Icons'

// Shown ONLY while developing (npm run dev) so you can see the layout.
// They never appear in a production build: real testimonies must come from your API.
const DEV_SAMPLES = [
  {
  id: 's1',
  name: 'Sarah & Michael',
  role: 'Wedding client',
  message: 'Honestly, we couldn’t have asked for a better experience. Everything was beautifully captured, and the videos brought back so many emotions. We are grateful to have these memories to look back on for years to come.'
},
{
  id: 's2',
  name: 'Grace & Daniel',
  role: 'Wedding client',
  message: 'From the very first conversation, we knew we were in good hands. The team was professional, friendly, and paid attention to every little detail. Looking through our pictures and videos feels like reliving our wedding day all over again.'
},
{
  id: 's3',
  name: 'Chisom & David',
  role: 'Wedding client',
  message: 'They did an amazing job capturing our special day. We barely noticed the cameras, but somehow they captured every important moment, from the laughter to the emotional moments. We absolutely love the final result and would recommend them to anyone.'
}
]

export default function TestimonySection() {
  const { data, isPending } = useTestimonies()
  if (isPending) return null

  const usingSamples = !data?.length && import.meta.env.DEV
  const items = data?.length ? data.slice(0, 6) : usingSamples ? DEV_SAMPLES : []
  if (items.length === 0) return null

  return (
    <section className="py-16 sm:py-20">
      <div className="container-x">
        <SectionHeading animate eyebrow="Testimonies" title="Kind words from our clients" />
        {usingSamples && <p className="-mt-6 mb-8 text-center text-xs text-muted">Development preview: sample content, hidden in production.</p>}
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {items.map((t, i) => (
            <Reveal key={t.id} from={['left', 'up', 'right'][i % 3]} delay={(i % 3) * 120} className="h-full">
              <figure className="flex h-full flex-col rounded-2xl border border-line bg-surface p-6">
                <QuoteIcon className="text-3xl text-brand-500/60" />
                {/* React escapes this text: never use dangerouslySetInnerHTML for API content */}
                <blockquote className="mt-3 flex-1 leading-relaxed text-muted">{t.message}</blockquote>
                <figcaption className="mt-5">
                  <p className="font-semibold">{t.name}</p>
                  {t.role && <p className="text-sm text-muted">{t.role}</p>}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}