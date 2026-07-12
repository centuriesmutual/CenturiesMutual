'use client'

export type LedgerEntry = {
  id: string
  label: string
  detail: string
  amount: number
  date: string
}

const LEDGER_KEY = 'cm_wallet_ledger'

export function loadLedger(): LedgerEntry[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(LEDGER_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as LedgerEntry[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function saveLedger(entries: LedgerEntry[]) {
  window.localStorage.setItem(LEDGER_KEY, JSON.stringify(entries))
}

export function appendLedgerEntry(entry: Omit<LedgerEntry, 'id'>): LedgerEntry[] {
  const next: LedgerEntry = {
    ...entry,
    id: `tx-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  }
  const list = [next, ...loadLedger()]
  saveLedger(list)
  return list
}
