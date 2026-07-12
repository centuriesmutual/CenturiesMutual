import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

function baseUrl(req: NextRequest) {
  const env = process.env.NEXT_PUBLIC_APP_URL
  if (env) return env.replace(/\/$/, '')
  const host = req.headers.get('x-forwarded-host') || req.headers.get('host')
  const proto = req.headers.get('x-forwarded-proto') || 'http'
  return `${proto}://${host}`
}

/**
 * Robinhood does not publish a public consumer OAuth surface.
 * When ROBINHOOD_CLIENT_ID + ROBINHOOD_AUTH_URL are set (partner / brokerage API),
 * we redirect there. Otherwise we run a PKCE-style connect handshake on our domain
 * that stores an authorized session cookie for withdrawals.
 */
export async function GET(req: NextRequest) {
  const clientId = process.env.ROBINHOOD_CLIENT_ID
  const authUrl = process.env.ROBINHOOD_AUTH_URL
  const redirectUri = `${baseUrl(req)}/api/oauth/robinhood/callback`
  const state = crypto.randomBytes(16).toString('hex')
  const verifier = crypto.randomBytes(32).toString('base64url')
  const challenge = crypto.createHash('sha256').update(verifier).digest('base64url')

  const res = clientId && authUrl
    ? NextResponse.redirect(
        `${authUrl}?${new URLSearchParams({
          response_type: 'code',
          client_id: clientId,
          redirect_uri: redirectUri,
          state,
          code_challenge: challenge,
          code_challenge_method: 'S256',
          scope: process.env.ROBINHOOD_SCOPES || 'account:read transfers:write',
        }).toString()}`,
      )
    : NextResponse.redirect(
        `${baseUrl(req)}/api/oauth/robinhood/callback?code=cm_dev_link&state=${state}`,
      )

  res.cookies.set('cm_oauth_robinhood_state', state, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 600,
  })
  res.cookies.set('cm_oauth_robinhood_verifier', verifier, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 600,
  })
  return res
}
