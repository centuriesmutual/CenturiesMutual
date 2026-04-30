'use client'

import * as Dialog from '@radix-ui/react-dialog'
import { Command } from 'cmdk'
import { motion } from 'framer-motion'
import { CornerDownLeft, Clock, MapPin, Search, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { useRecentSearches } from '@/hooks/use-recent-searches'
import { NEIGHBORHOOD_SUGGESTIONS } from '@/lib/search-data'

export function CommunitySearchHotkeys({ onOpen }: { onOpen: () => void }) {
  useEffect(() => {
    const trap = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        onOpen()
        return
      }
      if (e.key !== '/' || e.ctrlKey || e.metaKey || e.altKey) return
      const t = e.target as HTMLElement | null
      const tag = t?.tagName
      const editable =
        tag === 'INPUT' ||
        tag === 'TEXTAREA' ||
        (t as HTMLElement)?.isContentEditable ||
        t?.closest('[role="combobox"],[role="searchbox"],[role="textbox"]') !== null
      if (editable) return
      e.preventDefault()
      onOpen()
    }
    window.addEventListener('keydown', trap)
    return () => window.removeEventListener('keydown', trap)
  }, [onOpen])
  return null
}

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

function HighlightMatch({ text, query }: { text: string; query: string }) {
  const qTrim = query.trim()
  const q = qTrim.toLowerCase()
  const full = text
  if (!q) return <>{full}</>
  const low = full.toLowerCase()
  const i = low.indexOf(q)
  if (i < 0) return <>{full}</>
  return (
    <>
      {full.slice(0, i)}
      <mark className="rounded-sm bg-amber-100/95 px-0.5 font-medium text-inherit">{full.slice(i, i + qTrim.length)}</mark>
      {full.slice(i + qTrim.length)}
    </>
  )
}

export function CommunitySearchModal({ open, onOpenChange }: Props) {
  const router = useRouter()
  const { searches: recentList, push, remove } = useRecentSearches(5)
  const [query, setQuery] = useState('')

  useEffect(() => {
    if (!open) setQuery('')
  }, [open])

  const trimmed = query.trim()

  const filteredHoods = useMemo(() => {
    if (!trimmed) return []
    const t = trimmed.toLowerCase()
    return NEIGHBORHOOD_SUGGESTIONS.filter(
      (n) =>
        n.name.toLowerCase().includes(t) ||
        (n.sub ?? '').toLowerCase().includes(t),
    )
  }, [trimmed])

  function commit(selection: string) {
    const v = selection.trim()
    if (!v) return
    push(v)
    console.log('[CommunitySearch]', v)
    onOpenChange(false)
    router.push(`/neighborhood?q=${encodeURIComponent(v)}`)
  }

  const showSyntheticEmptyHelp = !!(trimmed && filteredHoods.length === 0)

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[1290] bg-[#0F3D2E]/60 backdrop-blur-sm" />

        <Dialog.Content className="fixed left-[50%] top-[48%] z-[1310] w-[calc(100%-1.75rem)] max-w-[640px] -translate-x-1/2 -translate-y-1/2 border-0 p-0 shadow-none outline-none">
          <Dialog.Title className="sr-only">Search rooms and neighborhoods</Dialog.Title>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="relative flex max-h-[70vh] flex-col overflow-hidden rounded-2xl border border-[#E5E0D5] bg-[#FAF7F0] shadow-2xl"
          >
            <Command loop shouldFilter={false} className="community-cmdk flex min-h-0 flex-1 flex-col font-sans" label="Community search">
              <div className="flex items-center gap-3 border-b border-[#E5E0D5] px-4 py-3.5 text-[#262626]">
                <Search className="h-6 w-6 shrink-0 text-[#6B6B66]" strokeWidth={2} aria-hidden />
                <Command.Input
                  placeholder="Where are you headed?"
                  autoFocus
                  value={query}
                  onValueChange={setQuery}
                  spellCheck={false}
                  autoCorrect="off"
                  autoCapitalize="off"
                  className="flex-1 border-0 bg-transparent font-sans text-lg font-medium text-[#262626] outline-none placeholder:text-[#838383]"
                />
                <span className="hidden shrink-0 items-center gap-1 text-[11px] text-[#838383] sm:flex" aria-hidden>
                  <kbd className="rounded border border-[#E5E0D5] bg-[#faf9f7] px-1.5 py-0.5 font-mono text-[10px]">Esc</kbd>
                </span>
              </div>

              <Command.List className="max-h-[min(52vh,420px)] overflow-y-auto overflow-x-hidden py-3">
                {!trimmed && recentList.length > 0 && (
                  <Command.Group heading="Recent" className="px-2 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:pb-2">
                    {recentList.map((entry) => (
                      <Command.Item
                        key={`recent:${entry}`}
                        value={`q:${encodeURIComponent(entry)}`}
                        onSelect={() => commit(entry)}
                        className="group mx-1 mb-px flex cursor-pointer select-none items-center gap-3 rounded-lg border-l-2 border-transparent px-3 py-2.5 text-[14px] aria-selected:border-l-[#0F3D2E] aria-selected:bg-[#F0EBE0]"
                      >
                        <Clock className="h-4 w-4 shrink-0 text-[#878780]" aria-hidden />
                        <span className="flex-1 truncate">{entry}</span>
                        <button
                          type="button"
                          aria-label={`Remove ${entry}`}
                          onPointerDown={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                          }}
                          onClick={(e) => {
                            e.stopPropagation()
                            remove(entry)
                          }}
                          className="opacity-0 transition group-hover:opacity-100"
                        >
                          <X className="h-4 w-4 text-[#6B6B66]" aria-hidden />
                        </button>
                      </Command.Item>
                    ))}
                  </Command.Group>
                )}

                {!trimmed && (
                  <Command.Group heading="Popular near you" className="px-2 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:pb-2 [&_[cmdk-group-heading]]:pt-4">
                    {NEIGHBORHOOD_SUGGESTIONS.map((hood) => (
                      <Command.Item
                        key={hood.id}
                        value={`q:${encodeURIComponent(hood.name)}`}
                        keywords={[hood.sub ?? '', String(hood.listingCount)]}
                        onSelect={() => commit(hood.name)}
                        className="mx-1 mb-px flex cursor-pointer items-start gap-3 rounded-lg border-l-2 border-transparent px-3 py-2.5 text-[14px] aria-selected:border-l-[#0F3D2E] aria-selected:bg-[#F0EBE0]"
                      >
                        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#878780]" aria-hidden />
                        <span className="min-w-0 flex-1 leading-snug">
                          <span className="font-medium text-[#262626]">{hood.name}</span>
                          {hood.sub && (
                            <span className="mt-0.5 block truncate text-[12px] text-[#6B6B66]">{hood.sub}</span>
                          )}
                          <span className="mt-1 block text-[11px] text-[#8a8a82]">{hood.listingCount} stays</span>
                        </span>
                      </Command.Item>
                    ))}
                  </Command.Group>
                )}

                {trimmed ? (
                  <Command.Group heading="Matching listings" className="px-2 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:pb-2 [&_[cmdk-group-heading]]:pt-2">
                    <Command.Item
                      value={`go:${encodeURIComponent(trimmed)}`}
                      keywords={[trimmed]}
                      onSelect={() => commit(trimmed)}
                      className="mx-1 mb-1 flex cursor-pointer items-center gap-2 rounded-lg border-l-2 border-transparent px-3 py-2.5 text-[14px] font-semibold text-[#0F3D2E] aria-selected:border-l-[#0F3D2E] aria-selected:bg-[#F0EBE0]"
                    >
                      <Search className="h-4 w-4 shrink-0" aria-hidden strokeWidth={2} />
                      <span>{`Search for “${trimmed}”`}</span>
                    </Command.Item>
                    {filteredHoods.map((hood) => (
                      <Command.Item
                        key={hood.id}
                        value={`q:${encodeURIComponent(hood.name)}`}
                        keywords={[hood.sub ?? '', String(hood.listingCount)]}
                        onSelect={() => commit(hood.name)}
                        className="mx-1 mb-px flex cursor-pointer items-start gap-3 rounded-lg border-l-2 border-transparent px-3 py-2.5 text-[14px] aria-selected:border-l-[#0F3D2E] aria-selected:bg-[#F0EBE0]"
                      >
                        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#878780]" aria-hidden />
                        <span className="min-w-0 flex-1 leading-snug">
                          <span className="font-medium text-[#262626]">
                            <HighlightMatch text={hood.name} query={trimmed} />
                          </span>
                          {hood.sub && (
                            <span className="mt-0.5 block truncate text-[12px] text-[#6B6B66]">{hood.sub}</span>
                          )}
                          <span className="mt-1 block text-[11px] text-[#8a8a82]">{hood.listingCount} stays</span>
                        </span>
                      </Command.Item>
                    ))}
                    {showSyntheticEmptyHelp && (
                      <div className="px-6 py-14 text-center text-[14px] leading-relaxed text-[#6B6B66]" role="status">
                        No listings match that phrase yet — Press Enter after typing, try another neighborhood, or use the suggestion above.
                      </div>
                    )}
                  </Command.Group>
                ) : null}
              </Command.List>

              <footer className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t border-[#E5E0D5] bg-[#f6f4ed] px-4 py-2.5 text-[11px] text-[#6B6B66]">
                <span className="flex flex-wrap items-center gap-x-5 gap-y-2">
                  <span className="inline-flex items-center gap-2">
                    <kbd className="rounded border border-[#E5E0D5] bg-[#FAF7F0] px-1.5 py-px font-mono text-[10px] leading-none">
                      ↑↓
                    </kbd>
                    <span>navigate</span>
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <kbd className="rounded border border-[#E5E0D5] bg-[#FAF7F0] px-1.5 py-px">
                      <CornerDownLeft className="inline h-3 w-3 text-[#555]" aria-hidden />
                    </kbd>
                    <span>select</span>
                  </span>
                  <span>esc · close</span>
                </span>
                <span className="whitespace-nowrap font-medium tracking-tight text-[rgba(15,61,46,0.72)]">
                  Powered by Centuries Mutual
                </span>
              </footer>
            </Command>
          </motion.div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
