import { YT_CATALOG, getCatalogVideo } from '@/lib/youtube/catalog'
import { rankRecommendations } from '@/lib/youtube/recommend'
import type { WatchEvent, YtVideo } from '@/lib/youtube/types'

/**
 * Server-side YouTube access.
 * When YOUTUBE_API_KEY is present on Vercel, feed/search hydrate from Data API v3.
 * Until then, catalog + recommendation ranker power the UI.
 */
export async function fetchHomeFeed(opts: {
  category?: string
  history?: WatchEvent[]
}): Promise<{ source: 'youtube' | 'catalog'; videos: YtVideo[] }> {
  const key = process.env.YOUTUBE_API_KEY
  if (key) {
    try {
      const videos = await fetchFromYouTubeApi(key, opts.category)
      if (videos.length) {
        return {
          source: 'youtube',
          videos: rankRecommendations(videos, {
            history: opts.history ?? [],
            category: opts.category,
            limit: 48,
          }),
        }
      }
    } catch {
      // fall through to catalog
    }
  }

  return {
    source: 'catalog',
    videos: rankRecommendations(YT_CATALOG, {
      history: opts.history ?? [],
      category: opts.category,
      limit: 48,
    }),
  }
}

export async function fetchRelated(videoId: string, history: WatchEvent[] = []) {
  const key = process.env.YOUTUBE_API_KEY
  if (key) {
    try {
      const related = await fetchRelatedFromApi(key, videoId)
      if (related.length) {
        return {
          source: 'youtube' as const,
          videos: rankRecommendations(related, {
            seedVideoId: videoId,
            history,
            limit: 20,
          }),
        }
      }
    } catch {
      // catalog fallback
    }
  }

  return {
    source: 'catalog' as const,
    videos: rankRecommendations(YT_CATALOG, {
      seedVideoId: videoId,
      history,
      limit: 20,
    }),
  }
}

export function resolveVideo(id: string) {
  return getCatalogVideo(id)
}

async function fetchFromYouTubeApi(apiKey: string, category?: string): Promise<YtVideo[]> {
  const channelId = process.env.YOUTUBE_CHANNEL_ID
  const q = category && category !== 'All' ? category : process.env.YOUTUBE_DEFAULT_QUERY || 'Centuries Mutual'
  const params = new URLSearchParams({
    part: 'snippet',
    type: 'video',
    maxResults: '24',
    q,
    key: apiKey,
  })
  if (channelId) params.set('channelId', channelId)

  const searchRes = await fetch(
    `https://www.googleapis.com/youtube/v3/search?${params.toString()}`,
    { next: { revalidate: 300 } },
  )
  if (!searchRes.ok) return []
  const searchJson = (await searchRes.json()) as {
    items?: Array<{ id?: { videoId?: string }; snippet?: Record<string, string> }>
  }
  const ids = (searchJson.items ?? [])
    .map((i) => i.id?.videoId)
    .filter((id): id is string => Boolean(id))
  if (!ids.length) return []

  const detailsRes = await fetch(
    `https://www.googleapis.com/youtube/v3/videos?${new URLSearchParams({
      part: 'snippet,contentDetails,statistics',
      id: ids.join(','),
      key: apiKey,
    }).toString()}`,
    { next: { revalidate: 300 } },
  )
  if (!detailsRes.ok) return []
  const details = (await detailsRes.json()) as {
    items?: Array<{
      id: string
      snippet: {
        title: string
        description: string
        channelId: string
        channelTitle: string
        publishedAt: string
        tags?: string[]
        categoryId?: string
        thumbnails?: { high?: { url?: string }; medium?: { url?: string } }
      }
      contentDetails: { duration: string }
      statistics: { viewCount?: string }
    }>
  }

  return (details.items ?? []).map((item) => ({
    id: item.id,
    title: item.snippet.title,
    description: item.snippet.description,
    channelId: item.snippet.channelId,
    channelTitle: item.snippet.channelTitle,
    channelAvatar: '/cmlogotreesmall-removebg-preview.png',
    thumbnail:
      item.snippet.thumbnails?.high?.url ||
      item.snippet.thumbnails?.medium?.url ||
      `https://i.ytimg.com/vi/${item.id}/hqdefault.jpg`,
    duration: isoDurationToClock(item.contentDetails.duration),
    durationSeconds: isoDurationToSeconds(item.contentDetails.duration),
    viewCount: Number(item.statistics.viewCount ?? 0),
    publishedAt: item.snippet.publishedAt,
    tags: item.snippet.tags ?? [],
    category: category && category !== 'All' ? category : 'For you',
  }))
}

async function fetchRelatedFromApi(apiKey: string, videoId: string): Promise<YtVideo[]> {
  const res = await fetch(
    `https://www.googleapis.com/youtube/v3/search?${new URLSearchParams({
      part: 'snippet',
      type: 'video',
      relatedToVideoId: videoId,
      maxResults: '20',
      key: apiKey,
    }).toString()}`,
    { next: { revalidate: 300 } },
  )
  if (!res.ok) return []
  // relatedToVideoId is restricted on newer API keys — fall back to search by seed title tags via catalog if empty
  const json = (await res.json()) as {
    items?: Array<{ id?: { videoId?: string } }>
  }
  const ids = (json.items ?? [])
    .map((i) => i.id?.videoId)
    .filter((id): id is string => Boolean(id))
  if (!ids.length) return []
  return fetchFromYouTubeApi(apiKey).then((all) => all.filter((v) => ids.includes(v.id)))
}

function isoDurationToSeconds(iso: string) {
  const m = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
  if (!m) return 0
  return Number(m[1] ?? 0) * 3600 + Number(m[2] ?? 0) * 60 + Number(m[3] ?? 0)
}

function isoDurationToClock(iso: string) {
  const total = isoDurationToSeconds(iso)
  const h = Math.floor(total / 3600)
  const m = Math.floor((total % 3600) / 60)
  const s = total % 60
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  return `${m}:${String(s).padStart(2, '0')}`
}
