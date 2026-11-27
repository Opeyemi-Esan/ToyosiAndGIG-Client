const SAMPLE = [
  { title: 'Earn points', text: 'Get points every time you book and pay.' },
  { title: 'Unlock perks', text: 'Redeem points for discounts on future bookings.' },
  { title: 'Priority dates', text: 'Loyal customers get first pick of popular dates.' },
]

export default function RewardsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Rewards</h1>

      <div className="rounded-2xl border border-line bg-surface p-8 text-center">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-brand-500/15 text-3xl" aria-hidden="true">🎁</span>
        <h2 className="mt-4 text-xl font-bold">Rewards are coming soon</h2>
        <p className="mt-2 text-muted">Lorem ipsum dolor sit amet, consectetur adipiscing elit. We are working on something special for you.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {SAMPLE.map((s) => (
          <div key={s.title} className="rounded-2xl border border-line bg-surface p-5 opacity-70">
            <p className="font-semibold">{s.title}</p>
            <p className="mt-1 text-sm text-muted">{s.text}</p>
          </div>
        ))}
      </div>
    </div>
  )
}