import { permanentRedirect } from 'next/navigation'

/** Legacy `/search` URLs redirect to `/neighborhood` (same experience, canonical path). */
export default function SearchRedirectPage({
  searchParams,
}: {
  searchParams?: { q?: string }
}) {
  const q = searchParams?.q?.trim()
  permanentRedirect(q ? `/neighborhood?q=${encodeURIComponent(q)}` : '/neighborhood')
}
