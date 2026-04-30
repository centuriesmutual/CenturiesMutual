'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ArrowRightIcon,
  CameraIcon,
  CheckCircleIcon,
  HomeIcon,
  ShieldCheckIcon,
  TruckIcon,
  WifiIcon,
} from '@heroicons/react/24/outline'
import { cn } from '@/lib/utils'

type Product = {
  id: number
  category: string
  categorySlug: string
  title: string
  description: string
  features: string[]
  icon: typeof CameraIcon
  gradient: string
}

const PRODUCTS: Product[] = [
  {
    id: 1,
    category: 'Security Cameras',
    categorySlug: 'cameras',
    title: '4K Ultra HD Security Camera System',
    description:
      'Custom-built security cameras with 4K Ultra HD quality, night vision, motion detection, and cloud storage.',
    features: [
      '4K Ultra HD Video Quality',
      '24/7 Live Monitoring',
      'Night Vision Enabled',
      'Motion Detection',
      'Encrypted Cloud Storage',
      'Smart Alerts',
    ],
    icon: CameraIcon,
    gradient: 'from-[#14432A]/20 via-[#E8DFD6] to-[#FAFCFB]',
  },
  {
    id: 2,
    category: 'Network Devices',
    categorySlug: 'network',
    title: 'WiFi 6E Router & Network System',
    description:
      'High-performance network devices with WiFi 6E support, 10Gbps speeds, mesh networking, VPN support, and enterprise-grade firewall protection.',
    features: [
      'WiFi 6E Latest Standard',
      '10Gbps Max Speed',
      'Mesh Networking',
      'VPN Support',
      'Firewall Protection',
      'Smart Management',
    ],
    icon: WifiIcon,
    gradient: 'from-[#C9A53E]/15 via-[#F3EDE4] to-[#FAFCFB]',
  },
  {
    id: 3,
    category: 'Smart Home Security',
    categorySlug: 'smart-home',
    title: 'Complete Smart Home Security System',
    description:
      'Integrated security system combining cameras, network devices, and smart sensors. Complete home protection with 256-bit encryption and automated alerts.',
    features: [
      '100% Home Coverage',
      '256-bit Encryption',
      'Integrated System',
      'Smart Sensors',
      'Automated Alerts',
      'Access Control',
    ],
    icon: HomeIcon,
    gradient: 'from-[#0F3D2E]/25 via-[#E8DFD6] to-[#FAFCFB]',
  },
]

const FILTERS = [
  { slug: 'all', label: 'All products' },
  { slug: 'cameras', label: 'Security cameras' },
  { slug: 'network', label: 'Network' },
  { slug: 'smart-home', label: 'Smart home' },
] as const

export function ShopMain() {
  return (
    <>
      {/* Announcement strip — Shopify-style top bar */}
      <div className="border-b border-[#C9A53E]/25 bg-[#0F3D2E] px-4 py-2.5 text-center">
        <p className="font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-[#FAFCFB]/95 sm:text-xs">
          Member bundles · Custom installs ·{' '}
          <Link href="/help-desk" className="text-[#E8D9A8] underline decoration-[#C9A53E]/60 underline-offset-2 hover:text-[#FAFCFB]">
            Help desk
          </Link>
        </p>
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden bg-[#0F3D2E] px-6 pb-16 pt-10 md:pb-20 md:pt-14 lg:px-10">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage:
              'radial-gradient(ellipse 80% 50% at 20% 0%, rgba(201, 169, 62, 0.35), transparent 55%), radial-gradient(ellipse 60% 40% at 100% 100%, rgba(232, 223, 214, 0.2), transparent 50%)',
          }}
          aria-hidden
        />
        <div className="relative mx-auto max-w-[1200px]">
          <nav className="mb-8 font-sans text-xs text-[#E8DFD6]/80">
            <Link href="/" className="text-[#FAFCFB]/85 no-underline transition hover:text-[#FAFCFB]">
              Home
            </Link>
            <span className="mx-2 text-[#C9A53E]/70" aria-hidden>
              /
            </span>
            <span className="text-[#FAFCFB]">Shop</span>
          </nav>
          <p className="mb-3 font-sans text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-[#C9A53E] sm:text-[0.75rem]">
            Centuries Mutual
          </p>
          <h1
            className="max-w-3xl font-serif text-[clamp(1.85rem,4.5vw,2.85rem)] font-medium leading-[1.12] tracking-[-0.02em] text-[#FAFCFB]"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Network Products Shop
          </h1>
          <p className="mt-5 max-w-2xl font-sans text-[0.9375rem] leading-[1.65] text-[#E8DFD6]/92 md:text-base">
            Custom-built network products. Secure your home with our advanced security cameras, network devices, and smart home
            systems.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="#collection"
              className="inline-flex items-center gap-2 rounded-full bg-[#FAFCFB] px-6 py-3 font-sans text-sm font-semibold text-[#0F3D2E] no-underline shadow-md transition hover:bg-[#E8DFD6]"
            >
              Browse collection
              <ArrowRightIcon className="h-4 w-4" aria-hidden />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center rounded-full border border-[#FAFCFB]/35 bg-transparent px-6 py-3 font-sans text-sm font-semibold text-[#FAFCFB] no-underline transition hover:border-[#C9A53E]/60 hover:bg-[#FAFCFB]/10"
            >
              Contact sales
            </Link>
          </div>
        </div>
      </section>

      {/* Trust row */}
      <section className="border-b border-[#E5E0D5] bg-[#FAFCFB] px-6 py-4 lg:px-10">
        <div className="mx-auto flex max-w-[1200px] flex-col items-center justify-center gap-4 sm:flex-row sm:flex-wrap sm:gap-x-10 sm:gap-y-2">
          {[
            { Icon: ShieldCheckIcon, text: 'Centuries Mutual backed' },
            { Icon: TruckIcon, text: 'Coordinated delivery & setup' },
            { Icon: CheckCircleIcon, text: 'Plain-English specifications' },
          ].map(({ Icon, text }) => (
            <div key={text} className="flex items-center gap-2 font-sans text-xs font-medium text-[#55655D] sm:text-[13px]">
              <Icon className="h-5 w-5 shrink-0 text-[#14432A]" aria-hidden />
              {text}
            </div>
          ))}
        </div>
      </section>

      <ShopCollectionGrid />
    </>
  )
}

function ShopCollectionGrid() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]['slug']>('all')

  const filtered =
    filter === 'all' ? PRODUCTS : PRODUCTS.filter((p) => p.categorySlug === filter)

  return (
    <section id="collection" className="bg-[#E8DFD6]/45 px-6 py-16 md:py-24 lg:px-10">
      <div className="mx-auto max-w-[1200px]">
        <div className="mb-10 flex flex-col gap-6 md:mb-14 md:flex-row md:items-end md:justify-between">
          <div>
            <h2
              className="font-serif text-[clamp(1.65rem,3vw,2.25rem)] font-medium leading-[1.15] text-[#14432A]"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Our Products
            </h2>
            <p className="mt-3 max-w-xl font-sans text-[0.9375rem] leading-[1.65] text-[#55655D]">
              Enterprise-grade networking and security solutions for your home
            </p>
          </div>
          <p className="font-sans text-sm tabular-nums text-[#6B6B66]">
            {filtered.length} {filtered.length === 1 ? 'product' : 'products'}
          </p>
        </div>

        {/* Category pills */}
        <div className="mb-10 flex flex-wrap gap-2">
          {FILTERS.map(({ slug, label }) => (
            <button
              key={slug}
              type="button"
              onClick={() => setFilter(slug)}
              className={cn(
                'rounded-full border px-4 py-2 font-sans text-xs font-semibold uppercase tracking-wider transition sm:text-[13px]',
                filter === slug
                  ? 'border-[#14432A] bg-[#14432A] text-[#FAFCFB] shadow-sm'
                  : 'border-[#E5E0D5] bg-[#FAFCFB] text-[#14432A] hover:border-[#C9A53E]/50 hover:bg-[#FAFCFB]',
              )}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-10 lg:grid-cols-3">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Bottom CTA — luxury band */}
        <div className="mt-16 overflow-hidden rounded-2xl border border-[#E5E0D5] bg-[#14432A] shadow-[0_20px_50px_rgba(15,51,33,0.18)] md:mt-20">
          <div className="relative px-6 py-12 text-center md:px-12 md:py-14">
            <div
              className="pointer-events-none absolute inset-0 opacity-30"
              style={{
                backgroundImage:
                  'radial-gradient(ellipse 50% 80% at 50% 0%, rgba(201, 169, 62, 0.25), transparent 60%)',
              }}
              aria-hidden
            />
            <div className="relative">
              <h3
                className="font-serif text-2xl font-medium text-[#FAFCFB] md:text-[1.75rem]"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Need Custom Solutions?
              </h3>
              <p className="mx-auto mt-4 max-w-2xl font-sans text-[0.9375rem] leading-[1.65] text-[#E8DFD6]/95">
                Our team can design and build custom network and security solutions tailored to your specific needs.
              </p>
              <Link
                href="/contact"
                className="mt-8 inline-flex items-center justify-center rounded-full bg-[#FAFCFB] px-8 py-3.5 font-sans text-sm font-semibold text-[#14432A] no-underline shadow-md transition hover:bg-[#E8DFD6]"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function ProductCard({ product }: { product: Product }) {
  const Icon = product.icon
  return (
    <article
      className={cn(
        'group flex flex-col overflow-hidden rounded-2xl border border-[#E5E0D5] bg-[#FAFCFB]',
        'shadow-[0_6px_24px_-4px_rgba(15,61,46,0.08)] transition-all duration-300',
        'hover:-translate-y-1 hover:shadow-[0_16px_44px_-10px_rgba(20,67,42,0.18)]',
      )}
    >
      <div
        className={cn(
          'relative aspect-[4/5] overflow-hidden bg-gradient-to-br',
          product.gradient,
        )}
      >
        <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(15,61,46,0.06),transparent_45%)]" aria-hidden />
        <Icon
          className="absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 text-[#14432A]/18 transition-transform duration-500 group-hover:scale-110 sm:h-32 sm:w-32"
          aria-hidden
        />
        <div className="absolute left-4 top-4 rounded-full bg-[#FAFCFB]/95 px-3 py-1 font-sans text-[10px] font-semibold uppercase tracking-wider text-[#14432A] shadow-sm ring-1 ring-[#E5E0D5]/80">
          In stock · Built to order
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <p className="font-sans text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-[#C9A53E]">{product.category}</p>
        <h3
          className="mt-2 font-serif text-xl font-semibold leading-snug text-[#14432A] sm:text-[1.35rem]"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          {product.title}
        </h3>
        <p className="mt-1 font-sans text-sm font-medium text-[#0f3321]">Quote on request</p>
        <p className="mt-3 font-sans text-[0.9375rem] leading-[1.65] text-[#55655D]">{product.description}</p>

        <ul className="mt-5 space-y-2 border-t border-[#E5E0D5]/80 pt-5">
          {product.features.map((feature) => (
            <li key={feature} className="flex gap-2.5 font-sans text-[0.8125rem] leading-snug text-[#3d4a41]">
              <CheckCircleIcon className="mt-0.5 h-4 w-4 shrink-0 text-[#14432A]" aria-hidden />
              {feature}
            </li>
          ))}
        </ul>

        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-center">
          <Link
            href="/contact"
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-[#14432A] px-5 py-3 font-sans text-sm font-semibold text-[#FAFCFB] no-underline transition hover:bg-[#0f3321]"
          >
            Contact sales
            <ArrowRightIcon className="h-4 w-4" aria-hidden />
          </Link>
          <Link
            href="/help-desk"
            className="inline-flex justify-center rounded-full border border-[#E5E0D5] bg-transparent px-5 py-3 font-sans text-sm font-semibold text-[#14432A] no-underline transition hover:border-[#C9A53E]/55 hover:bg-[#F3EDE4]/50"
          >
            Ask a question
          </Link>
        </div>
      </div>
    </article>
  )
}
