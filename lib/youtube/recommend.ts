import type { WatchEvent, YtVideo } from '@/lib/youtube/types'

/**
 * Lightweight recommendation ranker.
 * When YOUTUBE_API_KEY is live, the API can pass Data API results through the same scorer.
 */
export function rankRecommendations(
  catalog: ReadonlyArray<YtVideo>,
  opts: {
    seedVideoId?: string | null
    history: ReadonlyArray<WatchEvent>
    category?: string
    limit?: number
  },
): YtVideo[] {
  const { seedVideoId, history, category, limit = 24 } = opts
  const seed = seedVideoId ? catalog.find((v) => v.id === seedVideoId) : null
  const watchedIds = new Set(history.map((h) => h.videoId))
  const tagAffinity = new Map<string, number>()
  const categoryAffinity = new Map<string, number>()

  for (const event of history) {
    const video = catalog.find((v) => v.id === event.videoId)
    if (!video) continue
    const weight = event.completed ? 3 : 1 + event.progress
    categoryAffinity.set(
      video.category,
      (categoryAffinity.get(video.category) ?? 0) + weight,
    )
    for (const tag of video.tags) {
      tagAffinity.set(tag, (tagAffinity.get(tag) ?? 0) + weight)
    }
  }

  if (seed) {
    categoryAffinity.set(seed.category, (categoryAffinity.get(seed.category) ?? 0) + 4)
    for (const tag of seed.tags) {
      tagAffinity.set(tag, (tagAffinity.get(tag) ?? 0) + 3)
    }
  }

  const scored = catalog
    .filter((v) => v.id !== seedVideoId)
    .filter((v) => !category || category === 'All' || v.category === category)
    .map((video) => {
      let score = Math.log10(video.viewCount + 10)
      score += (categoryAffinity.get(video.category) ?? 0) * 1.4
      for (const tag of video.tags) {
        score += (tagAffinity.get(tag) ?? 0) * 1.1
      }
      // Mild freshness boost
      const ageDays =
        (Date.now() - new Date(video.publishedAt).getTime()) / (1000 * 60 * 60 * 24)
      score += Math.max(0, 14 - ageDays) * 0.08
      // Soft penalty for already watched (still allow rewatch in feed)
      if (watchedIds.has(video.id)) score *= 0.55
      // Exploration noise so the shelf is not static
      score += pseudoNoise(video.id) * 0.35
      return { video, score }
    })
    .sort((a, b) => b.score - a.score)

  return scored.slice(0, limit).map((s) => s.video)
}

function pseudoNoise(id: string) {
  let h = 0
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0
  return (h % 1000) / 1000
}

export function formatViewCount(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M views`
  if (n >= 1_000) return `${(n / 1_000).toFixed(n >= 10_000 ? 0 : 1)}K views`
  return `${n} views`
}

export function formatTimeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  if (days < 1) return 'Today'
  if (days === 1) return '1 day ago'
  if (days < 30) return `${days} days ago`
  const months = Math.floor(days / 30)
  if (months === 1) return '1 month ago'
  if (months < 12) return `${months} months ago`
  const years = Math.floor(months / 12)
  return years === 1 ? '1 year ago' : `${years} years ago`
}
