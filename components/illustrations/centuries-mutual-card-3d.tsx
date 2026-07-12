'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { EB_Garamond } from 'next/font/google'

const cardSerif = EB_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
})

function EmvChip() {
  return (
    <div
      aria-hidden
      style={{
        position: 'relative',
        width: 52,
        height: 40,
        borderRadius: 8,
        background: 'linear-gradient(145deg, #F0D78C 0%, #C9A53E 42%, #A8882E 78%, #8F7324 100%)',
        boxShadow:
          'inset 0 1px 0 rgba(255,255,255,0.55), inset 0 -1px 0 rgba(0,0,0,0.22), 0 2px 4px rgba(0,0,0,0.25)',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 5,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gridTemplateRows: '1fr 1fr 1fr',
          gap: 2,
        }}
      >
        {Array.from({ length: 9 }).map((_, i) => (
          <span
            key={i}
            style={{
              borderRadius: 1,
              background:
                i === 4
                  ? 'rgba(120,90,20,0.35)'
                  : 'linear-gradient(180deg, rgba(255,255,255,0.35), rgba(90,70,15,0.25))',
              boxShadow: 'inset 0 0 0 0.5px rgba(90,70,20,0.45)',
            }}
          />
        ))}
      </div>
      <span
        style={{
          position: 'absolute',
          left: 5,
          right: 5,
          top: '33%',
          height: 1,
          background: 'rgba(90,70,20,0.35)',
        }}
      />
      <span
        style={{
          position: 'absolute',
          left: 5,
          right: 5,
          top: '66%',
          height: 1,
          background: 'rgba(90,70,20,0.35)',
        }}
      />
    </div>
  )
}

/**
 * Original card size (min 100% / 420px) with the same float drift as the grocery store:
 * y = sin(t * 0.35) * 0.05, rotation.y = -0.2 + sin(t * 0.15) * 0.04
 * plus Float-equivalent soft bob (speed 0.5, floatIntensity 0.1).
 */
export function CenturiesMutualCard3D({ className }: { className?: string }) {
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    let raf = 0
    const start = performance.now()

    const tick = (now: number) => {
      const t = (now - start) / 1000
      // Soft, slow drift — slightly more presence than before
      const y = Math.sin(t * 0.2) * 0.028
      const rotY = Math.sin(t * 0.12) * 0.018
      const yPx = y * 70
      const rotDeg = (rotY * 180) / Math.PI

      el.style.transform = `translateY(${yPx}px) rotateY(${rotDeg}deg)`
      raf = window.requestAnimationFrame(tick)
    }

    raf = window.requestAnimationFrame(tick)
    return () => window.cancelAnimationFrame(raf)
  }, [])

  return (
    <div
      className={className}
      style={{
        width: '100%',
        minHeight: 300,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'transparent',
        padding: '1.25rem 0.5rem',
        perspective: 1200,
      }}
    >
      <div
        ref={wrapRef}
        style={{
          transformStyle: 'preserve-3d',
          willChange: 'transform',
          width: 'min(100%, 420px)',
        }}
      >
        <div
          className={cardSerif.className}
          role="img"
          aria-label="Centuries Mutual health insurance membership card"
          style={{
            position: 'relative',
            width: '100%',
            aspectRatio: '1.586 / 1',
            borderRadius: 18,
            color: '#FAFCFB',
            background: '#14432A',
            boxShadow: `
              0 2px 0 rgba(255,255,255,0.08),
              0 22px 44px -20px rgba(8, 28, 18, 0.45),
              0 10px 20px -12px rgba(8, 28, 18, 0.3)
            `,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div
            aria-hidden
            style={{
              pointerEvents: 'none',
              position: 'absolute',
              inset: 0,
              background: `
                linear-gradient(125deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.04) 28%, transparent 48%),
                linear-gradient(to bottom, rgba(255,255,255,0.06), transparent 40%, rgba(0,0,0,0.12) 100%)
              `,
              borderRadius: 18,
            }}
          />
          <div
            aria-hidden
            style={{
              pointerEvents: 'none',
              position: 'absolute',
              inset: 0,
              borderRadius: 18,
              boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.1), inset 0 0 0 2px rgba(20,67,42,0.5)',
            }}
          />

          <div
            style={{
              position: 'relative',
              zIndex: 1,
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              padding: '1.15rem 1.35rem 0',
            }}
          >
            <div>
              <p
                style={{
                  margin: 0,
                  fontSize: 'clamp(1.05rem, 2.4vw, 1.28rem)',
                  fontWeight: 600,
                  letterSpacing: '0.02em',
                  lineHeight: 1.15,
                  color: '#FAFCFB',
                  textShadow: '0 1px 0 rgba(0,0,0,0.25)',
                }}
              >
                Centuries Mutual
              </p>
              <p
                style={{
                  margin: '0.3rem 0 0',
                  fontSize: '0.72rem',
                  fontWeight: 500,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: '#C9A53E',
                }}
              >
                Health Insurance
              </p>
            </div>

            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                background: 'rgba(15,51,33,0.85)',
                boxShadow: '0 0 0 1.5px #C9A53E, 0 4px 10px rgba(0,0,0,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                overflow: 'hidden',
              }}
            >
              <Image
                src="/cmlogotreesmall-removebg-preview.png"
                alt=""
                width={42}
                height={42}
                style={{ objectFit: 'contain' }}
                priority
              />
            </div>
          </div>

          <div
            style={{
              position: 'relative',
              zIndex: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              padding: '1.35rem 1.35rem 0',
            }}
          >
            <EmvChip />
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden>
              <path
                d="M10 8c3.5 2.2 3.5 9.8 0 12"
                stroke="#C9A53E"
                strokeWidth="1.6"
                strokeLinecap="round"
                opacity="0.85"
              />
              <path
                d="M13.5 5.5c5 3.2 5 13.8 0 17"
                stroke="#C9A53E"
                strokeWidth="1.6"
                strokeLinecap="round"
                opacity="0.55"
              />
              <path
                d="M17 3c6.5 4.2 6.5 17.8 0 22"
                stroke="#C9A53E"
                strokeWidth="1.6"
                strokeLinecap="round"
                opacity="0.35"
              />
            </svg>
          </div>

          <div
            style={{
              position: 'relative',
              zIndex: 1,
              marginTop: 'auto',
              padding: '1.5rem 1.35rem 1.2rem',
            }}
          >
            <p
              style={{
                margin: '0 0 1.1rem',
                fontSize: 'clamp(1.05rem, 2.5vw, 1.25rem)',
                fontWeight: 500,
                letterSpacing: '0.2em',
                color: '#FAFCFB',
                textShadow: '0 1px 0 rgba(0,0,0,0.3)',
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              ••••&nbsp;&nbsp;••••&nbsp;&nbsp;••••&nbsp;&nbsp;7842
            </p>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12 }}>
              <div>
                <p
                  style={{
                    margin: 0,
                    fontSize: '0.62rem',
                    fontWeight: 500,
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    color: 'rgba(250,252,251,0.5)',
                  }}
                >
                  Member
                </p>
                <p
                  style={{
                    margin: '0.15rem 0 0',
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    letterSpacing: '0.04em',
                    color: '#FAFCFB',
                    textShadow: '0 1px 0 rgba(0,0,0,0.25)',
                  }}
                >
                  Maya Reyes
                </p>
              </div>
              <p
                style={{
                  margin: 0,
                  fontSize: '0.62rem',
                  fontWeight: 500,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'rgba(201,165,62,0.85)',
                }}
              >
                CM · Member
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
