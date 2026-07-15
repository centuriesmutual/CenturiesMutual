import { NextRequest, NextResponse } from 'next/server'
import { fetchRelated, resolveVideo } from '@/lib/youtube/server'
import type { WatchEvent } from '@/lib/youtube/types'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(
  req: NextRequest,
  ctx: { params: { id: string } },
) {
  const { id } = ctx.params
  const video = resolveVideo(id)
  let history: WatchEvent[] = []
  try {
    const raw = req.nextUrl.searchParams.get('history')
    if (raw) history = JSON.parse(raw) as WatchEvent[]
  } catch {
    history = []
  }

  const related = await fetchRelated(id, history)
  return NextResponse.json({
    video,
    related: related.videos,
    source: related.source,
  })
}
