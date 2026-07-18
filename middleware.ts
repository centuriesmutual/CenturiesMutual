import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

// Sub-apps that carry their OWN auth and map ALL paths to /<app>/**.
// e.g. office.centuriesmutual.com/<path> -> /office/<path>
const SELF_AUTH_APPS = ['office', 'editor', 'newspaper', 'campaign'] as const

// Sub-apps that SHARE the main Supabase session (cookie domain .centuriesmutual.com).
// Only the bare root is remapped to the route tree; every other path (/login,
// /api/*, /auth/*) is served as-is from this same app so client navigation works.
const SESSION_APPS = ['wallet', 'admin'] as const

// Public marketing surfaces hosted on their own subdomain. Root remaps to the
// matching route tree; /api/* stays shared with the main app.
const PUBLIC_APPS = ['careers'] as const

// Note: /admin is intentionally not a PROTECTED_PREFIX — the admin portal renders
// its own login and its data is served only by admin-gated API routes.
const PROTECTED_PREFIXES = ['/wallet', '/dashboard', '/insurance-application']
const AUTH_PAGES = ['/login', '/createaccount', '/create-account', '/signup']

const APEX = 'centuriesmutual.com'

function firstLabel(host: string | null): string | null {
  if (!host) return null
  return host.split(':')[0].toLowerCase().split('.')[0]
}

/** Copy Set-Cookie entries from a session response onto a redirect/rewrite. */
function withCookies(from: NextResponse, to: NextResponse): NextResponse {
  from.cookies.getAll().forEach((cookie) => to.cookies.set(cookie))
  return to
}

export async function middleware(request: NextRequest) {
  const host = request.headers.get('host')
  const label = firstLabel(host)
  const { pathname } = request.nextUrl

  // 1) Self-auth sub-apps: full path rewrite, bypass Supabase session logic.
  if (label && (SELF_AUTH_APPS as readonly string[]).includes(label)) {
    const isStaticOrInternal =
      pathname.startsWith('/_next') || /\.[^/]+$/.test(pathname)
    const alreadyScoped =
      pathname === `/${label}` || pathname.startsWith(`/${label}/`)
    if (isStaticOrInternal || alreadyScoped) return NextResponse.next()

    const url = request.nextUrl.clone()
    url.pathname = `/${label}${pathname === '/' ? '' : pathname}`
    return NextResponse.rewrite(url)
  }

  // 2) Session-sharing + public sub-apps: only the bare root is remapped.
  const sessionApp =
    label && (SESSION_APPS as readonly string[]).includes(label) ? label : null
  const publicApp =
    label && (PUBLIC_APPS as readonly string[]).includes(label) ? label : null
  const rootApp = sessionApp || publicApp

  // The wallet subdomain root behaves like /wallet for protection checks.
  const effectivePath =
    sessionApp && pathname === '/' ? `/${sessionApp}` : pathname

  // 3) On production hosts, these paths live ONLY on their subdomains.
  if (!rootApp && host?.endsWith(APEX)) {
    if (pathname === '/newspaper' || pathname.startsWith('/newspaper/')) {
      const rest = pathname.slice('/newspaper'.length)
      return NextResponse.redirect(
        `https://newspaper.${APEX}${rest}${request.nextUrl.search}`,
      )
    }
    if (pathname === '/careers' || pathname.startsWith('/careers/')) {
      const rest = pathname.slice('/careers'.length)
      return NextResponse.redirect(
        `https://careers.${APEX}${rest}${request.nextUrl.search}`,
      )
    }
    // Main-site /wallet → wallet subdomain (post-login should already land there).
    if (pathname === '/wallet' || pathname.startsWith('/wallet/')) {
      const walletBase =
        process.env.NEXT_PUBLIC_WALLET_URL?.replace(/\/$/, '') ||
        `https://wallet.${APEX}`
      const rest = pathname.slice('/wallet'.length)
      return NextResponse.redirect(`${walletBase}${rest}${request.nextUrl.search}`)
    }
  }

  const { response, user, configured } = await updateSession(request)

  const isProtected = PROTECTED_PREFIXES.some(
    (p) => effectivePath === p || effectivePath.startsWith(`${p}/`),
  )
  const isAuthPage = AUTH_PAGES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  )

  // Fail closed: protected routes always require a live Supabase session.
  if (isProtected && (!configured || !user)) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('next', effectivePath)
    if (!configured) url.searchParams.set('error', 'auth_unavailable')
    return withCookies(response, NextResponse.redirect(url))
  }

  // Logged-in users on an auth page go to the Wallet (its own subdomain in prod).
  if (configured && isAuthPage && user) {
    const walletTarget = process.env.NEXT_PUBLIC_WALLET_URL?.replace(/\/$/, '')
    const nextParam = request.nextUrl.searchParams.get('next')
    if (walletTarget) {
      return withCookies(response, NextResponse.redirect(walletTarget))
    }
    const url = request.nextUrl.clone()
    url.pathname = nextParam && nextParam.startsWith('/') ? nextParam : '/wallet'
    url.search = ''
    return withCookies(response, NextResponse.redirect(url))
  }

  // 4) Remap the session/public-app root to its route tree, preserving cookies.
  if (rootApp && pathname === '/') {
    const url = request.nextUrl.clone()
    url.pathname = `/${rootApp}`
    return withCookies(response, NextResponse.rewrite(url))
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
