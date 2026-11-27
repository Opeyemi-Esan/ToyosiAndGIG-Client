export default function Avatar({ user, size = 'h-12 w-12', text = 'text-base' }) {
  const initials = `${user?.firstName?.[0] ?? ''}${user?.lastName?.[0] ?? ''}`.toUpperCase() || '?'
  return user?.profilePictureUrl ? (
    <img src={user.profilePictureUrl} alt="" className={`${size} shrink-0 rounded-full object-cover`} />
  ) : (
    <span className={`${size} ${text} grid shrink-0 place-items-center rounded-full bg-brand-500/20 font-bold text-accent`}>{initials}</span>
  )
}