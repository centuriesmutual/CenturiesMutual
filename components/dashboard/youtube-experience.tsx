'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import {
  PlusIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
  XMarkIcon,
  CheckIcon,
} from '@heroicons/react/24/outline'
import { YT_CATALOG, getCatalogVideo } from '@/lib/youtube/catalog'
import { rankRecommendations } from '@/lib/youtube/recommend'
import {
  addToPlaylist,
  createPlaylist,
  loadPlaylists,
  loadWatchHistory,
  recordWatch,
} from '@/lib/youtube/storage'
import type { WatchEvent, YtPlaylist, YtVideo } from '@/lib/youtube/types'

const PAGE_SIZE = 8

export function YoutubeExperience() {
  const [history, setHistory] = useState<WatchEvent[]>([])
  const [playlists, setPlaylists] = useState<YtPlaylist[]>([])
  const [feed, setFeed] = useState<YtVideo[]>([])
  const [cursor, setCursor] = useState(0)
  const [activeIndex, setActiveIndex] = useState(0)
  const [muted, setMuted] = useState(true)
  const [saveFor, setSaveFor] = useState<string | null>(null)
  const [newPlaylistName, setNewPlaylistName] = useState('')
  const scrollerRef = useRef<HTMLDivElement>(null)
  const loadingMore = useRef(false)

  useEffect(() => {
    setHistory(loadWatchHistory())
    setPlaylists(loadPlaylists())
  }, [])

  const buildPage = useCallback(
    (start: number, hist: WatchEvent[], exclude: Set<string>) => {
      const ranked = rankRecommendations(YT_CATALOG, {
        history: hist,
        category: 'All',
        limit: YT_CATALOG.length,
      })
      const unused = ranked.filter((v) => !exclude.has(v.id))
      const pool = unused.length ? unused : ranked
      const out: YtVideo[] = []
      for (let i = 0; i < PAGE_SIZE; i++) {
        const v = pool[(start + i) % pool.length]
        if (v) out.push({ ...v, id: `${v.id}__${start + i}` })
      }
      return out
    },
    [],
  )

  useEffect(() => {
    let cancelled = false
    const run = async () => {
      try {
        const res = await fetch(
          `/api/youtube/feed?category=All&history=${encodeURIComponent(JSON.stringify(history))}`,
        )
        if (!res.ok) throw new Error('feed failed')
        const data = (await res.json()) as { videos: YtVideo[] }
        if (cancelled) return
        const base = data.videos.length ? data.videos : [...YT_CATALOG]
        const first = base.slice(0, PAGE_SIZE).map((v, i) => ({ ...v, id: `${v.id}__${i}` }))
        setFeed(first)
        setCursor(first.length)
      } catch {
        if (cancelled) return
        const first = buildPage(0, history, new Set())
        setFeed(first)
        setCursor(PAGE_SIZE)
      }
    }
    void run()
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const realId = (composite: string) => composite.split('__')[0]

  const appendMore = useCallback(() => {
    if (loadingMore.current) return
    loadingMore.current = true
    const exclude = new Set(feed.map((v) => realId(v.id)))
    const next = buildPage(cursor, history, exclude)
    setFeed((prev) => [...prev, ...next])
    setCursor((c) => c + PAGE_SIZE)
    loadingMore.current = false
  }, [buildPage, cursor, feed, history])

  useEffect(() => {
    const root = scrollerRef.current
    if (!root) return

    const onScroll = () => {
      const h = root.clientHeight
      if (!h) return
      const idx = Math.round(root.scrollTop / h)
      setActiveIndex((prev) => (prev === idx ? prev : idx))
      if (idx >= feed.length - 3) appendMore()
    }

    root.addEventListener('scroll', onScroll, { passive: true })
    return () => root.removeEventListener('scroll', onScroll)
  }, [appendMore, feed.length])

  useEffect(() => {
    const item = feed[activeIndex]
    if (!item) return
    setHistory(recordWatch(realId(item.id), 0.35, false))
  }, [activeIndex, feed])

  const saveToPlaylist = (playlistId: string, videoId: string) => {
    setPlaylists(addToPlaylist(playlistId, realId(videoId)))
    setSaveFor(null)
  }

  if (!feed.length) {
    return (
      <div className="flex min-h-[60dvh] items-center justify-center bg-black">
        <p className="font-sans text-sm text-white/60">Loading your feed…</p>
      </div>
    )
  }

  return (
    <div className="relative mx-auto h-[calc(100dvh-57px)] w-full bg-black px-3 pb-3 pt-2 sm:px-4 sm:pb-4 sm:pt-3">
      <div
        ref={scrollerRef}
        className="h-full snap-y snap-mandatory overflow-y-auto overscroll-y-contain rounded-2xl bg-black ring-1 ring-white/10 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {feed.map((video, index) => {
          const id = realId(video.id)
          const meta = getCatalogVideo(id) ?? video
          const isActive = index === activeIndex
          return (
            <section
              key={video.id}
              className="relative h-full w-full shrink-0 snap-start snap-always bg-black"
            >
              {isActive || Math.abs(index - activeIndex) <= 1 ? (
                <iframe
                  title={meta.title}
                  src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=${isActive ? 1 : 0}&mute=${muted ? 1 : 0}&controls=1&rel=0&modestbranding=1&playsinline=1`}
                  className="absolute inset-0 h-full w-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={meta.thumbnail}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover"
                />
              )}

              <div className="absolute bottom-4 right-4 z-[1] flex flex-col items-center gap-3 sm:bottom-6 sm:right-6">
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.92 }}
                  onClick={() => setMuted((m) => !m)}
                  className="flex h-11 w-11 items-center justify-center rounded-full border-0 bg-black/40 text-white backdrop-blur-sm"
                  aria-label={muted ? 'Unmute' : 'Mute'}
                >
                  {muted ? (
                    <SpeakerXMarkIcon className="h-5 w-5" />
                  ) : (
                    <SpeakerWaveIcon className="h-5 w-5" />
                  )}
                </motion.button>
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.92 }}
                  onClick={() => setSaveFor(video.id)}
                  className="flex h-11 w-11 items-center justify-center rounded-full border-0 bg-black/40 text-white backdrop-blur-sm"
                  aria-label="Save to playlist"
                >
                  <PlusIcon className="h-5 w-5" />
                </motion.button>
              </div>
            </section>
          )
        })}
      </div>

      {saveFor ? (
        <PlaylistPicker
          playlists={playlists}
          onClose={() => setSaveFor(null)}
          onSelect={(pid) => saveToPlaylist(pid, saveFor)}
          onCreate={(name) => {
            const next = createPlaylist(name)
            setPlaylists(next)
            if (next[0]) saveToPlaylist(next[0].id, saveFor)
          }}
          newName={newPlaylistName}
          setNewName={setNewPlaylistName}
        />
      ) : null}
    </div>
  )
}

function PlaylistPicker({
  playlists,
  onClose,
  onSelect,
  onCreate,
  newName,
  setNewName,
}: {
  playlists: YtPlaylist[]
  onClose: () => void
  onSelect: (id: string) => void
  onCreate: (name: string) => void
  newName: string
  setNewName: (v: string) => void
}) {
  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/50 p-4 sm:items-center">
      <div className="w-full max-w-md rounded-2xl bg-[#121212] p-5 shadow-xl ring-1 ring-white/10">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="m-0 font-sans text-[1rem] font-semibold text-white">Save to playlist</h3>
          <button type="button" onClick={onClose} className="border-0 bg-transparent p-1 text-white/60">
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
        <div className="max-h-56 space-y-1 overflow-y-auto">
          {playlists.map((pl) => (
            <button
              key={pl.id}
              type="button"
              onClick={() => onSelect(pl.id)}
              className="flex w-full items-center justify-between rounded-lg border-0 bg-transparent px-3 py-2.5 text-left font-sans text-[0.875rem] font-medium text-white transition hover:bg-white/10"
            >
              <span>{pl.title}</span>
              <CheckIcon className="h-4 w-4 text-white/50" />
            </button>
          ))}
        </div>
        <div className="mt-4 flex gap-2">
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="New playlist name"
            className="min-w-0 flex-1 rounded-lg border border-white/15 bg-black px-3 py-2 font-sans text-[0.875rem] text-white outline-none placeholder:text-white/40 focus:border-white/40"
          />
          <button
            type="button"
            onClick={() => {
              if (!newName.trim()) return
              onCreate(newName.trim())
              setNewName('')
            }}
            className="rounded-lg bg-white px-3 py-2 font-sans text-[0.8125rem] font-semibold text-black"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  )
}
