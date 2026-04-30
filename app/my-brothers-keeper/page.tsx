import Link from 'next/link'
import { SiteHeader } from '@/components/layout/site-header'
import Footer from '@/components/Footer'

export default function MyBrothersKeeperPage() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-[60vh] bg-[#FAFCFB] px-6 py-16 md:px-10">
        <div className="mx-auto max-w-3xl rounded-2xl border border-[#E5E0D5] bg-white p-8 shadow-sm md:p-10">
          <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.24em] text-[#C9A53E]">Community</p>
          <h1 className="mt-3 font-serif text-3xl text-[#14432A]" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
            My Brothers Keeper
          </h1>
          <p className="mt-5 font-sans text-[15px] leading-relaxed text-[#3d4a41]">
            This page is the dedicated destination for My Brothers Keeper content in the Centuries Mutual experience.
          </p>
          <Link href="/" className="mt-8 inline-flex rounded-full bg-[#14432A] px-5 py-2.5 font-sans text-sm font-semibold text-white no-underline">
            Return home
          </Link>
        </div>
      </main>
      <Footer />
    </>
  )
}
