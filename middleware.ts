import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

const PROTECTED_PREFIXES = ['/wallet', '/dashboard', '/admin', '/insurance-application']
const AUTH_PAGES = ['/login', '/create-account', '/signup']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const { response, user, configured } = await updateSession(request)

  if (!configured) {
    return response
  }

  const isProtected = PROTECTED_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  )
  const isAuthPage = AUTH_PAGES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  )

  if (isProtected && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('next', pathname)
    return NextResponse.redirect(url)
  }

  if (isAuthPage && user) {
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
