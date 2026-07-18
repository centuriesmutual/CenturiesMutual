import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { walletUrl } from '@/lib/site-urls'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next')

  if (code) {
    const supabase = createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      // Honor an explicit same-origin `next`; otherwise send to the Wallet,
      // which is its own subdomain in production.
      if (next && next.startsWith('/')) {
        return NextResponse.redirect(`${origin}${next}`)
      }
      const wallet = walletUrl()
      return NextResponse.redirect(
        /^https?:\/\//i.test(wallet) ? wallet : `${origin}${wallet}`,
      )
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_callback`)
}
