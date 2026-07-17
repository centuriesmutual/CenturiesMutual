import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

const PROTECTED_PREFIXES = ['/wallet', '/dashboard', '/admin', '/insurance-application']
const AUTH_PAGES = ['/login', '/createaccount', '/create-account', '/signup']

// Subdomains that map to their own route tree in this single app.
// e.g. office.centuriesmutual.com/<path>  ->  /office/<path>
const SUBDOMAIN_APPS = ['office', 'editor', 'newspaper', 'campaign'] as const

function subdomainApp(host: string | null): string | null {
  if (!host) return null
  const sub = host.split(':')[0].toLowerCase().split('.')[0]
  return (SUBDOMAIN_APPS as readonly string[]).includes(sub) ? sub : null
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Route subdomains to their app's route tree. These apps carry their own
  // auth, so they bypass the Supabase session/protection logic below.
  const app = subdomainApp(request.headers.get('host'))
  if (app) {
    // Static files and Next internals are served from the shared root as-is.
    const isStaticOrInternal =
      pathname.startsWith('/_next') || /\.[^/]+$/.test(pathname)
    const alreadyScoped =
      pathname === `/${app}` || pathname.startsWith(`/${app}/`)

    if (isStaticOrInternal || alreadyScoped) {
      return NextResponse.next()
    }

    const url = request.nextUrl.clone()
    url.pathname = `/${app}${pathname === '/' ? '' : pathname}`
    return NextResponse.rewrite(url)
  }

  const { response, user, configured } = await updateSession(request)

  const isProtected = PROTECTED_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  )
  const isAuthPage = AUTH_PAGES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  )

  // Fail closed: protected routes always require a live Supabase session.
  if (isProtected && (!configured || !user)) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('next', pathname)
    if (!configured) {
      url.searchParams.set('error', 'auth_unavailable')
    }
    return NextResponse.redirect(url)
  }

  if (configured && isAuthPage && user) {
    const next = request.nextUrl.searchParams.get('next') || '/wallet'
    const url = request.nextUrl.clone()
    url.pathname = next.startsWith('/') ? next : '/wallet'
    url.search = ''
    return NextResponse.redirect(url)
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
