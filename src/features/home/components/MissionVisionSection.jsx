import SectionHeading from '../../../shared/components/SectionHeading'

// Edit the wording to match the group's real mission and vision.
const ITEMS = [
  {
    title: 'Our Mission',
    text: 'To deliver live music experiences that make every event feel personal, joyful and unforgettable, with excellence in every note and warmth in every performance.',
  },
  {
    title: 'Our Vision',
    text: 'To be the first name people think of when they want great live music, from intimate celebrations to the biggest stages.',
  },
]

export default function MissionVisionSection() {
  return (
    <section className="py-16 sm:py-20">
      <div className="container-x">
        <SectionHeading eyebrow="Who we are" title="Mission & Vision" />
        <div className="grid gap-6 md:grid-cols-2">
          {ITEMS.map((item, i) => (
            <article key={item.title} className="relative overflow-hidden rounded-2xl border border-line bg-surface p-7 sm:p-9">
              <span aria-hidden="true" className="absolute -right-3 -top-6 select-none text-9xl font-black text-brand-500/10">
                {i + 1}
              </span>
              <h3 className="text-xl font-bold text-accent">{item.title}</h3>
              <p className="mt-3 leading-relaxed text-muted">{item.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
