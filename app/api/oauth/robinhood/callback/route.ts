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
  const stored = req.cookies.get('cm_oauth_robinhood_state')?.value
  const verifier = req.cookies.get('cm_oauth_robinhood_verifier')?.value
  const wallet = `${baseUrl(req)}/wallet`

  if (!code || !state || !stored || state !== stored) {
    return NextResponse.redirect(`${wallet}?oauth=robinhood&status=error`)
  }

  const clientId = process.env.ROBINHOOD_CLIENT_ID
  const clientSecret = process.env.ROBINHOOD_CLIENT_SECRET
  const tokenUrl = process.env.ROBINHOOD_TOKEN_URL

  if (clientId && clientSecret && tokenUrl && code !== 'cm_dev_link') {
    try {
      const tokenRes = await fetch(tokenUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code,
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uri: `${baseUrl(req)}/api/oauth/robinhood/callback`,
          code_verifier: verifier || '',
        }),
      })
      if (!tokenRes.ok) {
        return NextResponse.redirect(`${wallet}?oauth=robinhood&status=error`)
      }
      const tokens = (await tokenRes.json()) as {
        access_token: string
        refresh_token?: string
        expires_in?: number
      }
      const res = NextResponse.redirect(`${wallet}?oauth=robinhood&status=linked`)
      res.cookies.set('cm_robinhood_access', tokens.access_token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: tokens.expires_in ?? 3600,
      })
      if (tokens.refresh_token) {
        res.cookies.set('cm_robinhood_refresh', tokens.refresh_token, {
          httpOnly: true,
          sameSite: 'lax',
          secure: process.env.NODE_ENV === 'production',
          path: '/',
          maxAge: 60 * 60 * 24 * 30,
        })
      }
      res.cookies.set('cm_robinhood_linked', '1', {
        httpOnly: false,
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 30,
      })
      res.cookies.delete('cm_oauth_robinhood_state')
      res.cookies.delete('cm_oauth_robinhood_verifier')
      return res
    } catch {
      return NextResponse.redirect(`${wallet}?oauth=robinhood&status=error`)
    }
  }

  const res = NextResponse.redirect(`${wallet}?oauth=robinhood&status=linked&mode=setup`)
  res.cookies.set('cm_robinhood_linked', '1', {
    httpOnly: false,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  })
  res.cookies.delete('cm_oauth_robinhood_state')
  res.cookies.delete('cm_oauth_robinhood_verifier')
  return res
}
