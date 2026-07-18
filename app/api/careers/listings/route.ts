import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/admin'
import { FALLBACK_CAREER_LISTINGS } from '@/lib/careers/listings'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

/** GET — published career listings for the public careers page. */
export async function GET() {
  try {
    const supabase = createServiceClient()
    const { data, error } = await supabase
      .from('career_listings')
      .select(
        'id, title, department, employment_type, location, description, sort_order, published',
      )
      .eq('published', true)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: true })

    if (error) {
      // Table may not exist yet — fall back to seed copy.
      return NextResponse.json({
        ok: true,
        listings: FALLBACK_CAREER_LISTINGS.map((row, i) => ({
          ...row,
          id: `fallback-${i}`,
          published: true,
        })),
        source: 'fallback',
      })
    }

    if (!data?.length) {
      return NextResponse.json({
        ok: true,
        listings: FALLBACK_CAREER_LISTINGS.map((row, i) => ({
          ...row,
          id: `fallback-${i}`,
          published: true,
        })),
        source: 'fallback',
      })
    }

    return NextResponse.json({ ok: true, listings: data, source: 'database' })
  } catch {
    return NextResponse.json({
      ok: true,
      listings: FALLBACK_CAREER_LISTINGS.map((row, i) => ({
        ...row,
        id: `fallback-${i}`,
        published: true,
      })),
      source: 'fallback',
    })
  }
}
