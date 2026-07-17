import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin/access'
import {
  LedgerBridgeError,
  parseBridgeResponse,
  resolveLedgerBridgeUrl,
} from '@/lib/ledgerBridge'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

interface LedgerLogEntry {
  id: string
  memberId?: string
  type?: string
  action?: string
  amount?: number
  currency?: string
  txId?: string
  blockNumber?: number
  status?: string
  createdAt?: string
  [key: string]: unknown
}

interface LedgerLogsResponse {
  entries?: LedgerLogEntry[]
  logs?: LedgerLogEntry[]
}

/**
 * GET — Hyperledger activity log for the admin portal.
 *
 * Proxies to the bridge admin logs endpoint with the server-only `x-api-key`
 * (never exposed to the browser). The bridge is the only backend we talk to for
 * ledger data. If the bridge has not shipped the logs endpoint yet it returns
 * 501, which we surface as a "coming soon" state rather than an error.
 */
export async function GET() {
  const auth = await requireAdmin()
  if (auth.error) return auth.error

  const adminKey = process.env.LEDGER_BRIDGE_ADMIN_KEY?.trim()
  if (!adminKey) {
    return NextResponse.json({
      ok: true,
      configured: false,
      comingSoon: true,
      message: 'Ledger logs are not configured. Set LEDGER_BRIDGE_ADMIN_KEY.',
      logs: [],
    })
  }

  let base: string
  try {
    base = resolveLedgerBridgeUrl()
  } catch {
    return NextResponse.json({
      ok: true,
      configured: false,
      comingSoon: true,
      message: 'Ledger service is not configured.',
      logs: [],
    })
  }

  let res: Response
  try {
    res = await fetch(`${base}/v1/centuries-mutual/rewards/ledger/logs`, {
      method: 'GET',
      headers: {
        'x-api-key': adminKey,
        Accept: 'application/json',
      },
      cache: 'no-store',
    })
  } catch {
    return NextResponse.json(
      {
        ok: false,
        retryable: true,
        message: 'Could not reach the ledger service. Please try again.',
        logs: [],
      },
      { status: 502 },
    )
  }

  try {
    const result = await parseBridgeResponse<LedgerLogsResponse>(res)
    const logs = result.entries ?? result.logs ?? []
    return NextResponse.json({ ok: true, configured: true, comingSoon: false, logs })
  } catch (err) {
    if (err instanceof LedgerBridgeError) {
      if (err.isComingSoon) {
        return NextResponse.json({
          ok: true,
          configured: true,
          comingSoon: true,
          message: 'Hyperledger logs are coming soon.',
          logs: [],
        })
      }
      return NextResponse.json(
        {
          ok: false,
          retryable: err.retryable,
          message: err.message,
          logs: [],
        },
        { status: err.status || 502 },
      )
    }
    return NextResponse.json(
      { ok: false, retryable: false, message: 'Something went wrong.', logs: [] },
      { status: 500 },
    )
  }
}
