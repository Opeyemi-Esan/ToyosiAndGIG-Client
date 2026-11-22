import { Component } from 'react'

export default class ErrorBoundary extends Component {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error) {
    // Hook up an error reporter (e.g. Sentry) here. Never show details to users.
    if (import.meta.env.DEV) console.error(error)
  }

  render() {
    if (!this.state.hasError) return this.props.children
    return (
      <div className="grid min-h-screen place-items-center bg-bg p-6 text-center text-fg">
        <div>
          <h1 className="text-2xl font-semibold">Something went wrong</h1>
          <p className="mt-2 text-muted">Please refresh the page or go back home.</p>
          <a href="/" className="mt-5 inline-block rounded-lg bg-brand-500 px-5 py-2.5 font-semibold text-ink">
            Back to home
          </a>
        </div>
      </div>
    )
  }
}
