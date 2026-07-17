import { NextResponse, type NextRequest } from 'next/server'
import { requireUser } from '@/lib/supabase/auth-helpers'
import {
  LedgerBridgeError,
  parseBridgeResponse,
  resolveLedgerBridgeUrl,
} from '@/lib/ledgerBridge'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

/**
 * Admin wallet activation — server-only.
 *
 * This route holds the secret `x-api-key` (rewards:admin scope) and proxies to
 * the bridge activation endpoint. The key is NEVER sent to the browser. The
 * (future) admin page invokes this route; it must be reached with a signed-in
 * session.
 */

interface ActivateBody {
  memberId?: string
  eventId?: string
}

interface ActivateResult {
  memberId: string
  status: 'active'
  activatedAt?: string
  activatedBy?: string
}

export async function POST(req: NextRequest) {
  const auth = await requireUser()
  if (auth.error) return auth.error

  const adminKey = process.env.LEDGER_BRIDGE_ADMIN_KEY?.trim()
  if (!adminKey) {
    return NextResponse.json(
      {
        error: {
          code: 'config_missing',
          category: 'unknown',
          message: 'Wallet activation is not configured.',
          retryable: false,
        },
      },
      { status: 500 },
    )
  }

  let body: ActivateBody
  try {
    body = (await req.json()) as ActivateBody
  } catch {
    return NextResponse.json(
      {
        error: {
          code: 'invalid_json',
          category: 'validation',
          message: 'Invalid request body.',
          retryable: false,
        },
      },
      { status: 400 },
    )
  }

  const memberId = body.memberId?.trim()
  if (!memberId) {
    return NextResponse.json(
      {
        error: {
          code: 'member_id_required',
          category: 'validation',
          message: 'A memberId is required to activate a wallet.',
          retryable: false,
        },
      },
      { status: 400 },
    )
  }

  const eventId = body.eventId?.trim() || crypto.randomUUID()

  let base: string
  try {
    base = resolveLedgerBridgeUrl()
  } catch (err) {
    if (err instanceof LedgerBridgeError) {
      return NextResponse.json(
        {
          error: {
            code: err.code,
            category: err.category,
            message: err.message,
            retryable: err.retryable,
          },
        },
        { status: 500 },
      )
    }
    throw err
  }

  let res: Response
  try {
    res = await fetch(
      `${base}/v1/centuries-mutual/rewards/members/${encodeURIComponent(
        memberId,
      )}/activate`,
      {
        method: 'POST',
        headers: {
          'x-api-key': adminKey,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ activatedBy: auth.user.id, eventId }),
      },
    )
  } catch {
    return NextResponse.json(
      {
        error: {
          code: 'network_error',
          category: 'ledger',
          message: 'Could not reach the rewards service. Please try again.',
          retryable: true,
        },
      },
      { status: 502 },
    )
  }

  try {
    const result = await parseBridgeResponse<ActivateResult>(res)
    return NextResponse.json(result, { status: 200 })
  } catch (err) {
    if (err instanceof LedgerBridgeError) {
      return NextResponse.json(
        {
          error: {
            code: err.code,
            category: err.category,
            message: err.message,
            retryable: err.retryable,
          },
        },
        { status: err.status || 502 },
      )
    }
    return NextResponse.json(
      {
        error: {
          code: 'unknown',
          category: 'unknown',
          message: 'Something went wrong. Please try again.',
          retryable: false,
        },
      },
      { status: 500 },
    )
  }
}
