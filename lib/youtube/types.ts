export type YtVideo = {
  id: string
  title: string
  description: string
  channelId: string
  channelTitle: string
  channelAvatar: string
  thumbnail: string
  duration: string
  durationSeconds: number
  viewCount: number
  publishedAt: string
  tags: string[]
  category: string
}

export type YtPlaylist = {
  id: string
  title: string
  videoIds: string[]
  createdAt: string
  updatedAt: string
}

export type WatchEvent = {
  videoId: string
  watchedAt: string
  progress: number
  completed: boolean
}
