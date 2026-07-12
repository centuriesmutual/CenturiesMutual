import { NextRequest, NextResponse } from 'next/server'
import { fetchHomeFeed } from '@/lib/youtube/server'
import type { WatchEvent } from '@/lib/youtube/types'

export async function GET(req: NextRequest) {
  const category = req.nextUrl.searchParams.get('category') ?? 'All'
  let history: WatchEvent[] = []
  try {
    const raw = req.nextUrl.searchParams.get('history')
    if (raw) history = JSON.parse(raw) as WatchEvent[]
  } catch {
    history = []
  }

  const feed = await fetchHomeFeed({ category, history })
  return NextResponse.json(feed)
}
