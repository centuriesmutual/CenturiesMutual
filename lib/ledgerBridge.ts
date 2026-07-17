/**
 * Ledger Bridge API client.
 *
 * The bridge (gitlab.com/centuries.mutual/bridge) is the ONLY backend the
 * frontend talks to for wallet/rewards. We never call Fabric directly.
 *
 * Auth model:
 * - Member (browser) calls attach the Supabase session JWT as
 *   `Authorization: Bearer <access_token>`. The browser Origin is on the
 *   bridge CORS allowlist, so we send credentials normally.
 * - Admin activation is NOT a browser call — it runs server-side with the
 *   secret `x-api-key` (see app/api/admin/activate-wallet). The admin key is
 *   never referenced here so it can never be bundled for the browser.
 */

import { createClient } from '@/lib/supabase/client'

export type WalletStatusValue = 'inactive' | 'active' | 'suspended'

export interface WalletStatus {
  memberId: string
  status: WalletStatusValue
  activatedAt?: string
  activatedBy?: string
}

export interface RewardsBalance {
  balance: number
  currency: 'CM_CREDIT'
}

export interface RewardsHistoryEntry {
  id: string
  type: string
  amount: number
  currency: 'CM_CREDIT'
  description?: string
  createdAt: string
}

export interface RewardsHistory {
  entries: RewardsHistoryEntry[]
}

/** Error categories returned by the bridge error envelope. */
export type BridgeErrorCategory =
  | 'ledger'
  | 'validation'
  | 'auth'
  | 'not_implemented'
  | 'unknown'

export interface BridgeErrorEnvelope {
  code: string
  category: BridgeErrorCategory
  message: string
  retryable: boolean
}

/** Raw envelope shape as it arrives over the wire: `{ error: {...} }`. */
interface BridgeErrorResponse {
  error?: Partial<BridgeErrorEnvelope>
}

/**
 * Typed error thrown for any non-2xx bridge response. Callers switch on
 * `category` / `retryable` to render the correct UI state.
 */
export class LedgerBridgeError extends Error {
  readonly code: string
  readonly category: BridgeErrorCategory
  readonly retryable: boolean
  readonly status: number

  constructor(envelope: BridgeErrorEnvelope, status: number) {
    super(envelope.message)
    this.name = 'LedgerBridgeError'
    this.code = envelope.code
    this.category = envelope.category
    this.retryable = envelope.retryable
    this.status = status
  }

  /** 501 responses map to a "coming soon" experience. */
  get isComingSoon(): boolean {
    return this.status === 501 || this.category === 'not_implemented'
  }
}

/**
 * Resolve the bridge base URL. Member calls run in the browser, so the value
 * must be exposed via NEXT_PUBLIC_LEDGER_BRIDGE_URL; server code may also set
 * the non-public LEDGER_BRIDGE_URL. Trailing slashes are trimmed.
 */
export function resolveLedgerBridgeUrl(): string {
  const url =
    process.env.NEXT_PUBLIC_LEDGER_BRIDGE_URL?.trim() ||
    process.env.LEDGER_BRIDGE_URL?.trim()
  if (!url) {
    throw new LedgerBridgeError(
      {
        code: 'config_missing',
        category: 'unknown',
        message:
          'Rewards service is not configured. Set LEDGER_BRIDGE_URL / NEXT_PUBLIC_LEDGER_BRIDGE_URL.',
        retryable: false,
      },
      0,
    )
  }
  return url.replace(/\/$/, '')
}

/**
 * Parse a bridge Response into `T`, or throw a normalized LedgerBridgeError.
 * Shared by member (browser) and admin (server) call sites.
 */
export async function parseBridgeResponse<T>(res: Response): Promise<T> {
  if (res.ok) {
    return (await res.json()) as T
  }

  let envelope: Partial<BridgeErrorEnvelope> | undefined
  try {
    const body = (await res.json()) as BridgeErrorResponse
    envelope = body?.error
  } catch {
    // Non-JSON error body — fall through to defaults below.
  }

  if (res.status === 501) {
    throw new LedgerBridgeError(
      {
        code: envelope?.code ?? 'not_implemented',
        category: 'not_implemented',
        message: envelope?.message ?? 'This feature is coming soon.',
        retryable: false,
      },
      501,
    )
  }

  throw new LedgerBridgeError(
    {
      code: envelope?.code ?? 'unknown',
      category: envelope?.category ?? 'unknown',
      message: envelope?.message ?? 'Something went wrong. Please try again.',
      retryable: envelope?.retryable ?? false,
    },
    res.status,
  )
}

/** Read the current member's Supabase access token from the browser session. */
async function getMemberAccessToken(): Promise<string> {
  const supabase = createClient()
  const { data, error } = await supabase.auth.getSession()
  const token = data.session?.access_token
  if (error || !token) {
    throw new LedgerBridgeError(
      {
        code: 'no_session',
        category: 'auth',
        message: 'Please sign in to view your rewards wallet.',
        retryable: false,
      },
      401,
    )
  }
  return token
}

/** GET helper for authenticated member calls (browser). */
async function memberGet<T>(path: string): Promise<T> {
  const base = resolveLedgerBridgeUrl()
  const token = await getMemberAccessToken()

  let res: Response
  try {
    res = await fetch(`${base}${path}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    })
  } catch {
    // Network / CORS failure — treat as retryable ledger-style outage.
    throw new LedgerBridgeError(
      {
        code: 'network_error',
        category: 'ledger',
        message: 'Could not reach the rewards service. Please try again.',
        retryable: true,
      },
      0,
    )
  }

  return parseBridgeResponse<T>(res)
}

export function getWalletStatus(): Promise<WalletStatus> {
  return memberGet<WalletStatus>('/v1/centuries-mutual/rewards/wallet')
}

export function getRewardsBalance(): Promise<RewardsBalance> {
  return memberGet<RewardsBalance>('/v1/centuries-mutual/rewards/balance')
}

export function getRewardsHistory(): Promise<RewardsHistory> {
  return memberGet<RewardsHistory>('/v1/centuries-mutual/rewards/history')
}
