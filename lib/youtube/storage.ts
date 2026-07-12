import type { WatchEvent, YtPlaylist } from '@/lib/youtube/types'

const HISTORY_KEY = 'cm_yt_watch_history'
const PLAYLISTS_KEY = 'cm_yt_playlists'

export function loadWatchHistory(): WatchEvent[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(HISTORY_KEY)
    return raw ? (JSON.parse(raw) as WatchEvent[]) : []
  } catch {
    return []
  }
}

export function recordWatch(videoId: string, progress = 0.15, completed = false) {
  const history = loadWatchHistory().filter((h) => h.videoId !== videoId)
  const next: WatchEvent = {
    videoId,
    watchedAt: new Date().toISOString(),
    progress,
    completed,
  }
  const list = [next, ...history].slice(0, 200)
  window.localStorage.setItem(HISTORY_KEY, JSON.stringify(list))
  return list
}

export function loadPlaylists(): YtPlaylist[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(PLAYLISTS_KEY)
    if (!raw) {
      const starter: YtPlaylist = {
        id: 'watch-later',
        title: 'Watch later',
        videoIds: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      window.localStorage.setItem(PLAYLISTS_KEY, JSON.stringify([starter]))
      return [starter]
    }
    return JSON.parse(raw) as YtPlaylist[]
  } catch {
    return []
  }
}

function savePlaylists(list: YtPlaylist[]) {
  window.localStorage.setItem(PLAYLISTS_KEY, JSON.stringify(list))
}

export function createPlaylist(title: string) {
  const list = loadPlaylists()
  const playlist: YtPlaylist = {
    id: `pl-${Date.now().toString(36)}`,
    title: title.trim() || 'Untitled playlist',
    videoIds: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  const next = [playlist, ...list]
  savePlaylists(next)
  return next
}

export function addToPlaylist(playlistId: string, videoId: string) {
  const list = loadPlaylists().map((p) => {
    if (p.id !== playlistId) return p
    if (p.videoIds.includes(videoId)) return p
    return {
      ...p,
      videoIds: [videoId, ...p.videoIds],
      updatedAt: new Date().toISOString(),
    }
  })
  savePlaylists(list)
  return list
}

export function removeFromPlaylist(playlistId: string, videoId: string) {
  const list = loadPlaylists().map((p) => {
    if (p.id !== playlistId) return p
    return {
      ...p,
      videoIds: p.videoIds.filter((id) => id !== videoId),
      updatedAt: new Date().toISOString(),
    }
  })
  savePlaylists(list)
  return list
}
