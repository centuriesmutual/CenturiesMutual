export type NeighborhoodSuggestion = {
  id: string
  name: string
  listingCount: number
  sub?: string
}

/** Mock catalog for command-palette results (UI demo). */
export const NEIGHBORHOOD_SUGGESTIONS: NeighborhoodSuggestion[] = [
  { id: 'plano-downtown', name: 'Downtown Plano', listingCount: 42, sub: 'Walkable Main St' },
  { id: 'legacy-west', name: 'Legacy West', listingCount: 67, sub: 'Plano · retail & dining' },
  { id: 'mckinney-historic', name: 'Historic Downtown McKinney', listingCount: 31, sub: 'Square & events' },
  { id: 'deep-ellum', name: 'Deep Ellum, Dallas', listingCount: 58, sub: 'Arts & nightlife' },
  { id: 'bishop-arts', name: 'Bishop Arts District', listingCount: 44, sub: 'Oak Cliff' },
  { id: 'uptown-dallas', name: 'Uptown Dallas', listingCount: 73, sub: 'Katy Trail access' },
]
