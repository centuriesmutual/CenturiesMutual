import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

function isAuth0Configured() {
  return Boolean(
    process.env.AUTH0_SECRET &&
      process.env.AUTH0_BASE_URL &&
      process.env.AUTH0_ISSUER_BASE_URL &&
      process.env.AUTH0_CLIENT_ID &&
      process.env.AUTH0_CLIENT_SECRET,
  )
}

/**
 * Auth0 catch-all. Only initializes the SDK when all required env vars exist,
 * so Vercel static generation / builds without Auth0 config do not assert.
 * Wallet login (/login) is the primary auth path today.
 */
export async function GET(
  req: NextRequest,
  ctx: { params: { auth0: string[] } },
) {
  if (!isAuth0Configured()) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  const { handleAuth } = await import('@auth0/nextjs-auth0')
  const handler = handleAuth()
  return handler(req, ctx)
}
