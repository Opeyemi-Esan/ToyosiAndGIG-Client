// Only allow redirects to internal paths (prevents open-redirect via router state)
export const safeRedirect = (path, fallback = '/profile') =>
  typeof path === 'string' && path.startsWith('/') && !path.startsWith('//') ? path : fallback
