'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { MapPinIcon } from '@heroicons/react/24/outline'

type FooterLink = { href: string; label: string; external?: boolean }

type FooterColumn = {
  title: string
  links: ReadonlyArray<FooterLink>
}

const FOOTER_COLUMNS: ReadonlyArray<FooterColumn> = [
  {
    title: 'Insurance',
    links: [
      { href: '/individual-family-services', label: 'Individual & Family' },
      { href: '/medicare-supplement', label: 'Medicare Supplement' },
      { href: '/medicare-advantage', label: 'Medicare Advantage' },
      { href: '/group-plans', label: 'Group Plans' },
      { href: '/dental', label: 'Dental' },
    ],
  },
  {
    title: 'Rewards & Pay',
    links: [
      { href: '/treasury', label: 'Rewards Wallet' },
      { href: '/pay', label: 'Rent, Bills & Groceries' },
      { href: '/rentalequity', label: 'Compound Earnings' },
      { href: '/utilities', label: 'Utilities' },
    ],
  },
  {
    title: 'Neighborhood',
    links: [
      { href: '/newspaper', label: 'Newspaper' },
      { href: '/wintergarden', label: 'Wintergarden' },
      { href: '/my-brothers-keeper', label: 'My Brothers Keeper' },
    ],
  },
  {
    title: 'Documents',
    links: [
      { href: '/forms', label: 'Forms' },
      { href: '/taxes', label: 'Taxes' },
      { href: '/find-a-doctor', label: 'Find a Provider' },
      { href: '/carrier-portal', label: 'Carrier Portal' },
    ],
  },
  {
    title: 'Company',
    links: [
      { href: '/help-desk', label: 'Help Desk' },
      { href: '/legal', label: 'Legal' },
      { href: '/developers', label: 'Developers' },
      { href: '/investor-relations', label: 'Investor Relations' },
    ],
  },
]

const LEGAL_LINKS: ReadonlyArray<FooterLink> = [
  { href: '/legal', label: 'Privacy Policy' },
  { href: '/legal', label: 'Terms of Service' },
  { href: '/legal', label: 'Member Agreement' },
  { href: '/audit-compliance', label: 'Regulatory Notices' },
  { href: '/security', label: 'Data Protection' },
  { href: '/help-desk', label: 'Contact Support' },
]

function FooterLinkItem({ href, label, external }: FooterLink) {
  const className =
    'text-white/80 text-decoration-none transition-opacity hover:text-white hover:opacity-100'
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {label}
      </a>
    )
  }
  return (
    <Link href={href} className={className}>
      {label}
    </Link>
  )
}

export default function Footer({
  variant = 'full',
}: {
  /** `legal` keeps only the copyright / legal link bar (sub-footer). */
  variant?: 'full' | 'legal'
}) {
  const [mounted, setMounted] = useState(false)
  const [windowWidth, setWindowWidth] = useState(0)

  useEffect(() => {
    setMounted(true)
    setWindowWidth(window.innerWidth)

    const handleResize = () => {
      setWindowWidth(window.innerWidth)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const getLogoSize = () => {
    if (!mounted) return { width: 60, height: 60, fontSize: '1.5rem' }
    if (windowWidth < 400) return { width: 40, height: 40, fontSize: '1.25rem' }
    if (windowWidth < 640) return { width: 45, height: 45, fontSize: '1.3rem' }
    if (windowWidth < 768) return { width: 50, height: 50, fontSize: '1.2rem' }
    return { width: 60, height: 60, fontSize: '1.5rem' }
  }

  const { width, height, fontSize } = getLogoSize()
  const year = mounted ? new Date().getFullYear() : 2026

  const legalBar = (
    <div className="border-t border-white/10">
      <div className="container py-4">
        <div className="d-flex flex-column flex-lg-row align-items-start align-items-lg-center justify-content-between gap-3">
          <p className="mb-0 text-white/55" style={{ fontSize: '0.8125rem' }}>
            © {year} Centuries Mutual. All rights reserved.
          </p>
          <ul className="list-unstyled d-flex flex-wrap gap-x-3 gap-y-2 mb-0">
            {LEGAL_LINKS.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="font-sans text-[0.75rem] uppercase tracking-[0.12em] text-white/55 text-decoration-none hover:text-white"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <p className="mt-3 mb-0 text-white/35" style={{ fontSize: '0.7rem', lineHeight: 1.55, maxWidth: 920 }}>
          © Centuries Mutual. All product names, logos, and brands are property of
          their respective owners. Coverage and rewards are subject to plan documents
          and applicable law.
        </p>
      </div>
    </div>
  )

  if (variant === 'legal') {
    return <footer className="bg-[#0B1F17] text-white">{legalBar}</footer>
  }

  return (
    <footer className="bg-[#0B1F17] text-white">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500&display=swap');

        .footer-logo-container {
          position: relative;
          width: ${width}px;
          height: ${height}px;
        }
        .footer-logo-container img {
          filter: brightness(0) invert(1);
          opacity: 0.9;
        }
        .cm-footer-heading {
          font-family: ui-sans-serif, system-ui, sans-serif;
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #c9a53e;
          margin-bottom: 1rem;
        }
        .cm-footer-link-list li {
          margin-bottom: 0.55rem;
          font-size: 0.875rem;
          line-height: 1.4;
        }
      `}</style>

      {/* Top enterprise band */}
      <div className="border-b border-white/10">
        <div className="container py-3">
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-2">
            <p className="mb-0 font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-white/55">
              Exclusive health insurance · Member rewards · Secure brokerage
            </p>
            <div className="d-flex flex-wrap gap-3">
              <Link
                href="/enrollment"
                className="font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-[#C9A53E] text-decoration-none hover:text-white"
              >
                Enroll
              </Link>
              <Link
                href="/downloads"
                className="font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-white/70 text-decoration-none hover:text-white"
              >
                Get the App
              </Link>
              <Link
                href="/help-desk"
                className="font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-white/70 text-decoration-none hover:text-white"
              >
                Support
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-5">
        {/* Brand + sitemap */}
        <div className="row gy-4">
          <div className="col-12 col-lg-3 footer-content">
            <div className="d-flex align-items-center mb-3 footer-logo">
              <div className="footer-logo-container me-2">
                <Image
                  src="/cmlogotreesmall-removebg-preview.png"
                  alt="Centuries Mutual Logo"
                  width={width}
                  height={height}
                  className="me-2"
                  style={{ objectFit: 'contain' }}
                />
              </div>
              <span
                style={{
                  color: '#ffffff',
                  fontFamily: "'Playfair Display', serif",
                  fontSize: fontSize,
                  fontWeight: '500',
                  letterSpacing: mounted && windowWidth < 640 ? '0' : '0.5px',
                  whiteSpace: 'nowrap',
                  display: 'inline-block',
                }}
              >
                Centuries Mutual
              </span>
            </div>
            <p className="mb-3 text-white/75" style={{ fontSize: '0.95rem', lineHeight: 1.65, maxWidth: 320 }}>
              Providing a comprehensive brokerage network to further a secure and
              better future.
            </p>
            <div className="d-flex align-items-center text-white mb-3" style={{ opacity: 0.8 }}>
              <MapPinIcon style={{ width: '18px', height: '18px', marginRight: '6px' }} />
              <span style={{ fontSize: '0.9rem' }}>Dallas, Texas</span>
            </div>
            <p className="mb-1 text-white/45" style={{ fontSize: '0.75rem', letterSpacing: '0.04em' }}>
              Member services
            </p>
            <p className="mb-0">
              <a
                href="mailto:support@centuriesmutual.com"
                className="text-white/80 text-decoration-none"
                style={{ fontSize: '0.875rem' }}
              >
                support@centuriesmutual.com
              </a>
            </p>
          </div>

          <div className="col-12 col-lg-9">
            <div className="row row-cols-2 row-cols-md-3 row-cols-xl-5 gy-4">
              {FOOTER_COLUMNS.map((column) => (
                <div key={column.title} className="col footer-content">
                  <h5 className="cm-footer-heading">{column.title}</h5>
                  <ul className="list-unstyled cm-footer-link-list footer-links mb-0">
                    {column.links.map((link) => (
                      <li key={`${column.title}-${link.label}`}>
                        <FooterLinkItem {...link} />
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Legal disclaimer */}
        <div className="mt-5 rounded-3 border border-white/10 bg-white/[0.03] px-4 py-4">
          <p className="cm-footer-heading mb-3">Legal disclaimer</p>
          <p className="mb-0 font-sans text-[0.8125rem] leading-[1.65] text-white/65">
            Centuries Mutual is an insurance brokerage and healthcare rewards network.
            Coverage, premiums, and rewards vary by eligibility, geography, and
            underwriting and are governed solely by applicable plan documents and law.
            Wellness, fitness, nutrition, and performance programs are supplemental and
            are not medical advice or clinical care. Third-party marks belong to their
            owners; appearance does not imply affiliation beyond stated relationships.
            This website is not an offer of securities, tax advice, or a guarantee of
            any outcome.
          </p>
        </div>
      </div>

      {legalBar}
    </footer>
  )
}
