import Reveal from './Reveal'

// Pass `animate` to make the heading fly in the first time it scrolls into view
export default function SectionHeading({ eyebrow, title, subtitle, align = 'center', className = '', animate = false }) {
  const alignment = align === 'center' ? 'mx-auto text-center' : 'text-left'
  const Wrapper = animate ? Reveal : 'div'
  return (
    <Wrapper className={`mb-10 max-w-2xl ${alignment} ${className}`}>
      {eyebrow && <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">{eyebrow}</p>}
      <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
      {subtitle && <p className="mt-3 text-muted">{subtitle}</p>}
    </Wrapper>
  )
}