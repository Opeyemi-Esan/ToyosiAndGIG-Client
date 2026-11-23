import { useEffect, useRef, useState } from 'react'

// Where the element starts from before it flies in
const START = {
  up: 'translate-y-10',
  down: '-translate-y-10',
  left: '-translate-x-16',
  right: 'translate-x-16',
}

// Skip the animation (show immediately) for people who prefer reduced motion, or very old browsers
const skipAnimation = () =>
  typeof IntersectionObserver === 'undefined' || window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Flies in the FIRST time it scrolls into view, then stays put (it does not replay).
//   from:  'up' | 'down' | 'left' | 'right'
//   delay: milliseconds, to stagger several items
export default function Reveal({ as: Tag = 'div', from = 'up', delay = 0, className = '', style, children, ...props }) {
  const ref = useRef(null)
  const [shown, setShown] = useState(skipAnimation)

  useEffect(() => {
    const el = ref.current
    if (shown || !el) return undefined

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true)
          observer.disconnect() // once only
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [shown])

  return (
    <Tag
      ref={ref}
      style={{ transitionDelay: shown ? `${delay}ms` : '0ms', ...style }}
      className={`transition duration-700 ease-out motion-reduce:transition-none ${
        shown ? 'translate-x-0 translate-y-0 opacity-100' : `opacity-0 ${START[from]}`
      } ${className}`}
      {...props}
    >
      {children}
    </Tag>
  )
}