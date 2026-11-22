import { Link, useLocation } from 'react-router-dom'
import Button from '../../../shared/components/Button'

export default function PaymentFailedPage() {
  const reference = useLocation().state?.reference

  return (
    <section className="container-x py-20 text-center">
      <div className="mx-auto max-w-md">
        <h1 className="text-3xl font-bold">Payment not completed</h1>
        <p className="mt-3 text-muted">
          We could not confirm a payment, so you have not been charged for this attempt. You can try again, or get in touch if money left your account.
        </p>
        {reference && <p className="mt-3 break-all text-xs text-muted">Reference: {reference}</p>}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button as={Link} to="/book">
            Try again
          </Button>
          <Button as={Link} to="/contact" variant="outline">
            Contact us
          </Button>
        </div>
      </div>
    </section>
  )
}
