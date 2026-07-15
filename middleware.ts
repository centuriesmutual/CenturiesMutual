import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

const PROTECTED_PREFIXES = ['/wallet', '/dashboard', '/admin', '/insurance-application']
const AUTH_PAGES = ['/login', '/createaccount', '/create-account', '/signup']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
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
