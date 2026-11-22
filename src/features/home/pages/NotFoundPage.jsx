import { Link } from 'react-router-dom'
import Button from '../../../shared/components/Button'

export default function NotFoundPage() {
  return (
    <section className="container-x py-24 text-center">
      <p className="text-6xl font-extrabold text-accent">404</p>
      <h1 className="mt-4 text-2xl font-bold">Page not found</h1>
      <p className="mt-2 text-muted">The page you are looking for does not exist or has moved.</p>
      <Button as={Link} to="/" className="mt-8">
        Back to home
      </Button>
    </section>
  )
}
