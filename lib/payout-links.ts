'use client'

export type LinkedProvider = 'coinbase' | 'robinhood' | 'paymentus'

export type LinkedAccount = {
  provider: LinkedProvider
  linkedAt: string
  displayName: string
  accountRef: string
}

const KEY = 'cm_linked_payouts'

export function loadLinkedAccounts(): Partial<Record<LinkedProvider, LinkedAccount>> {
  if (typeof window === 'undefined') return {}
  try {
    const raw = window.localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as Partial<Record<LinkedProvider, LinkedAccount>>) : {}
  } catch {
    return {}
  }
}

export function saveLinkedAccount(account: LinkedAccount) {
  const map = loadLinkedAccounts()
  map[account.provider] = account
  window.localStorage.setItem(KEY, JSON.stringify(map))
}

export function unlinkAccount(provider: LinkedProvider) {
  const map = loadLinkedAccounts()
  delete map[provider]
  window.localStorage.setItem(KEY, JSON.stringify(map))
}
