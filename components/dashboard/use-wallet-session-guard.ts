'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import {
  clearOauthHold,
  endWalletSession,
  hasOauthHold,
  isSessionEnding,
  isSessionExpired,
  loadSession,
  markOauthHold,
  markSessionEnding,
  SESSION_IDLE_MS,
  touchSession,
  validateWalletAccess,
} from '@/lib/member-profile'

const LEAVE_MESSAGE =
  'Leaving Wallet will end your secure session. You will need to sign in again.'

function isWalletPath(path: string) {
  return path === '/wallet' || path.startsWith('/wallet/')
}

function isExternalHref(href: string) {
  return (
    href.startsWith('http://') ||
    href.startsWith('https://') ||
    href.startsWith('mailto:') ||
    href.startsWith('tel:')
  )
}

function resolveHref(anchor: HTMLAnchorElement): string | null {
  const raw = anchor.getAttribute('href')
  if (!raw || raw.startsWith('#') || raw.startsWith('javascript:')) return null
  try {
    const url = new URL(raw, window.location.origin)
    if (url.origin === window.location.origin) {
      return `${url.pathname}${url.search}${url.hash}`
    }
    return url.href
  } catch {
    return raw
  }
}

/**
 * Finance-style Wallet session guard: idle timeout, leave warnings,
 * and forced logout whenever the member exits Wallet.
 */
export function useWalletSessionGuard(enabled: boolean) {
  const router = useRouter()
  const endingRef = useRef(false)

  useEffect(() => {
    if (!enabled) return

    const endAndRedirect = (to = '/login') => {
      if (endingRef.current) return
      endingRef.current = true
      markSessionEnding()
      endWalletSession()
      router.replace(to)
    }

    const confirmLeave = () => window.confirm(LEAVE_MESSAGE)

    const leaveWallet = (destination?: string) => {
      if (hasOauthHold() || isSessionEnding()) return
      if (!confirmLeave()) return
      endingRef.current = true
      markSessionEnding()
      endWalletSession()
      if (destination) {
        if (isExternalHref(destination)) {
          window.location.href = destination
        } else {
          router.push(destination)
        }
      } else {
        router.replace('/login')
      }
    }

    // Activity keeps the idle clock fresh.
    const onActivity = () => {
      if (endingRef.current) return
      const session = loadSession()
      if (!session || isSessionExpired(session)) {
        endAndRedirect()
        return
      }
      touchSession()
    }

    const activityEvents: Array<keyof WindowEventMap> = [
      'pointerdown',
      'keydown',
      'scroll',
      'touchstart',
    ]
    activityEvents.forEach((evt) =>
      window.addEventListener(evt, onActivity, { passive: true }),
    )

    const idleTimer = window.setInterval(() => {
      const session = loadSession()
      if (!session || isSessionExpired(session)) endAndRedirect()
    }, Math.min(30_000, SESSION_IDLE_MS / 2))

    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasOauthHold() || endingRef.current || isSessionEnding()) return
      e.preventDefault()
      e.returnValue = LEAVE_MESSAGE
      return LEAVE_MESSAGE
    }

    const onDocumentClick = (e: MouseEvent) => {
      if (endingRef.current || hasOauthHold() || isSessionEnding()) return
      const target = e.target as HTMLElement | null
      const anchor = target?.closest('a') as HTMLAnchorElement | null
      if (!anchor || anchor.target === '_blank' || e.metaKey || e.ctrlKey || e.shiftKey) {
        return
      }
      const href = resolveHref(anchor)
      if (!href) return

      if (isExternalHref(href)) {
        e.preventDefault()
        leaveWallet(href)
        return
      }

      const path = href.startsWith('/') ? href.split(/[?#]/)[0] : href
      if (path && !isWalletPath(path)) {
        e.preventDefault()
        leaveWallet(href)
      }
    }

    // Browser back/forward away from Wallet.
    const onPopState = () => {
      if (endingRef.current || hasOauthHold() || isSessionEnding()) return
      if (isWalletPath(window.location.pathname)) return
      if (!confirmLeave()) {
        router.replace('/wallet')
        return
      }
      endingRef.current = true
      markSessionEnding()
      endWalletSession()
      router.replace('/login')
    }

    window.addEventListener('beforeunload', onBeforeUnload)
    window.addEventListener('popstate', onPopState)
    document.addEventListener('click', onDocumentClick, true)

    return () => {
      window.clearInterval(idleTimer)
      activityEvents.forEach((evt) => window.removeEventListener(evt, onActivity))
      window.removeEventListener('beforeunload', onBeforeUnload)
      window.removeEventListener('popstate', onPopState)
      document.removeEventListener('click', onDocumentClick, true)
    }
  }, [enabled, router])
}

/** Call before redirecting into an OAuth / external payout flow. */
export function beginWalletOauthRedirect() {
  markOauthHold()
}

export function finishWalletOauthRedirect() {
  clearOauthHold()
}

export { validateWalletAccess }
