import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

function baseUrl(req: NextRequest) {
  const env = process.env.NEXT_PUBLIC_APP_URL
  if (env) return env.replace(/\/$/, '')
  const host = req.headers.get('x-forwarded-host') || req.headers.get('host')
  const proto = req.headers.get('x-forwarded-proto') || 'http'
  return `${proto}://${host}`
}

export async function GET(req: NextRequest) {
  const clientId = process.env.COINBASE_CLIENT_ID
  const redirectUri = `${baseUrl(req)}/api/oauth/coinbase/callback`
  const state = crypto.randomBytes(16).toString('hex')

  const res = clientId
    ? NextResponse.redirect(
        `https://login.coinbase.com/oauth2/auth?${new URLSearchParams({
          response_type: 'code',
          client_id: clientId,
          redirect_uri: redirectUri,
          state,
          scope: [
            'wallet:user:read',
            'wallet:accounts:read',
            'wallet:transactions:send',
          ].join(','),
          account: 'select',
        }).toString()}`,
      )
    : NextResponse.redirect(
        `${baseUrl(req)}/api/oauth/coinbase/callback?code=cm_dev_link&state=${state}`,
      )

  res.cookies.set('cm_oauth_coinbase_state', state, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 600,
  })

  return res
}
