import { NextRequest, NextResponse } from 'next/server'

function baseUrl(req: NextRequest) {
  const env = process.env.NEXT_PUBLIC_APP_URL
  if (env) return env.replace(/\/$/, '')
  const host = req.headers.get('x-forwarded-host') || req.headers.get('host')
  const proto = req.headers.get('x-forwarded-proto') || 'http'
  return `${proto}://${host}`
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const code = url.searchParams.get('code')
  const state = url.searchParams.get('state')
  const stored = req.cookies.get('cm_oauth_coinbase_state')?.value
  const wallet = `${baseUrl(req)}/wallet`

  if (!code || !state || !stored || state !== stored) {
    return NextResponse.redirect(`${wallet}?oauth=coinbase&status=error`)
  }

  const clientId = process.env.COINBASE_CLIENT_ID
  const clientSecret = process.env.COINBASE_CLIENT_SECRET
  const redirectUri = `${baseUrl(req)}/api/oauth/coinbase/callback`

  if (!clientId || !clientSecret || code === 'cm_dev_link') {
    const res = NextResponse.redirect(`${wallet}?oauth=coinbase&status=linked&mode=setup`)
    res.cookies.set('cm_coinbase_linked', '1', {
      httpOnly: false,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
    })
    res.cookies.delete('cm_oauth_coinbase_state')
    return res
  }

  try {
    const tokenRes = await fetch('https://api.coinbase.com/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        grant_type: 'authorization_code',
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
      }),
    })
    if (!tokenRes.ok) {
      return NextResponse.redirect(`${wallet}?oauth=coinbase&status=error`)
    }
    const tokens = (await tokenRes.json()) as {
      access_token: string
      refresh_token?: string
      expires_in?: number
    }

    const res = NextResponse.redirect(`${wallet}?oauth=coinbase&status=linked`)
    res.cookies.set('cm_coinbase_access', tokens.access_token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: tokens.expires_in ?? 3600,
    })
    if (tokens.refresh_token) {
      res.cookies.set('cm_coinbase_refresh', tokens.refresh_token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 60 * 60 * 24 * 30,
      })
    }
    res.cookies.set('cm_coinbase_linked', '1', {
      httpOnly: false,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
    })
    res.cookies.delete('cm_oauth_coinbase_state')
    return res
  } catch {
    return NextResponse.redirect(`${wallet}?oauth=coinbase&status=error`)
  }
}
