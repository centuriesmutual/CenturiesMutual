'use client'

import { useCallback, useEffect, useState } from 'react'

const STORAGE_KEY = 'cm:recent-searches'

export function useRecentSearches(max = 5) {
  const [searches, setSearches] = useState<string[]>([])
  const [ready, setReady] = useState(false)

  useEffect(() => {
    try {
      const raw = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null
      if (raw) {
        const parsed = JSON.parse(raw) as unknown
        if (Array.isArray(parsed) && parsed.every((x) => typeof x === 'string')) {
          setSearches(parsed)
        }
      }
    } catch {
      // ignore corrupt storage
    }
    setReady(true)
  }, [])

  const persist = useCallback((next: string[]) => {
    setSearches(next)
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      }
    } catch {
      // quota / private mode
    }
  }, [])

  const push = useCallback(
    (q: string) => {
      const t = q.trim()
      if (!t) return
      const next = [t, ...searches.filter((s) => s.toLowerCase() !== t.toLowerCase())].slice(0, max)
      persist(next)
    },
    [searches, persist, max]
  )

  const remove = useCallback(
    (entry: string) => {
      persist(searches.filter((s) => s !== entry))
    },
    [searches, persist]
  )

  return { searches, push, remove, ready }
}
