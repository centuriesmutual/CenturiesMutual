/**
 * Cross-subdomain destinations for Centuries Mutual.
 *
 * In production the member Wallet lives on its own subdomain
 * (wallet.centuriesmutual.com) and the admin portal on admin.centuriesmutual.com.
 * Set NEXT_PUBLIC_WALLET_URL / NEXT_PUBLIC_ADMIN_URL in production. When unset
 * (local dev), callers fall back to same-origin paths (/wallet, /admin).
 */

/** Absolute Wallet URL in production, else a same-origin path. */
export function walletUrl(path = ''): string {
  const base = process.env.NEXT_PUBLIC_WALLET_URL?.replace(/\/$/, '')
  const suffix = path && !path.startsWith('/') ? `/${path}` : path
  return base ? `${base}${suffix}` : `/wallet${suffix}`
}

/** Absolute admin portal URL in production, else a same-origin path. */
export function adminUrl(path = ''): string {
  const base = process.env.NEXT_PUBLIC_ADMIN_URL?.replace(/\/$/, '')
  const suffix = path && !path.startsWith('/') ? `/${path}` : path
  return base ? `${base}${suffix}` : `/admin${suffix}`
}

/** Absolute Careers URL in production, else a same-origin path. */
export function careersUrl(path = ''): string {
  const base = process.env.NEXT_PUBLIC_CAREERS_URL?.replace(/\/$/, '')
  const suffix = path && !path.startsWith('/') ? `/${path}` : path
  return base ? `${base}${suffix}` : `/careers${suffix}`
}
