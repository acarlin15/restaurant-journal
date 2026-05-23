import { useState, useEffect, useRef } from 'react'
import { Search as SearchIcon, SlidersHorizontal, X } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { EntryCard } from '@/components/feed/EntryCard'
import { searchEntries, fetchVenues } from '@/lib/api'
import type { Entry, Venue } from '@/types/app'

export function Search() {
  const [query, setQuery] = useState('')
  const [venues, setVenues] = useState<Venue[]>([])
  const [selectedVenueId, setSelectedVenueId] = useState<string | null>(null)
  const [minRating, setMinRating] = useState<number | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [results, setResults] = useState<Entry[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    fetchVenues().then(setVenues)
  }, [])

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      if (!query && !selectedVenueId && !minRating) {
        setResults([])
        setSearched(false)
        return
      }
      setLoading(true)
      const data = await searchEntries(query, selectedVenueId, minRating)
      setResults(data)
      setSearched(true)
      setLoading(false)
    }, 250)
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [query, selectedVenueId, minRating])

  const hasFilters = selectedVenueId || minRating
  const activeFilterCount = [selectedVenueId, minRating].filter(Boolean).length

  function clearFilters() {
    setSelectedVenueId(null)
    setMinRating(null)
  }

  return (
    <>
      <PageHeader title="Search" />

      <div className="px-4 pt-3 pb-2 space-y-2 bg-white border-b border-stone-100">
        <div className="relative flex items-center">
          <SearchIcon size={16} className="absolute left-3 text-stone-400 pointer-events-none" />
          <input
            type="search"
            placeholder="Dish, venue, note, or tag…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm bg-stone-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-900/20 placeholder:text-stone-400"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3 text-stone-400"
              aria-label="Clear search"
            >
              <X size={15} />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFilters((s) => !s)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-600 bg-stone-100 rounded-full"
          >
            <SlidersHorizontal size={13} />
            Filters
            {activeFilterCount > 0 && (
              <span className="w-4 h-4 bg-stone-900 text-white rounded-full text-xs flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
          {hasFilters && (
            <button onClick={clearFilters} className="text-xs text-stone-400 hover:text-stone-600">
              Clear all
            </button>
          )}
        </div>

        {showFilters && (
          <div className="pt-2 space-y-4 pb-3">
            <div>
              <p className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-2">Venue</p>
              <div className="flex flex-wrap gap-2">
                {venues.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVenueId(selectedVenueId === v.id ? null : v.id)}
                    className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${
                      selectedVenueId === v.id
                        ? 'bg-stone-900 text-white border-stone-900'
                        : 'bg-white text-stone-600 border-stone-200'
                    }`}
                  >
                    {v.name}
                  </button>
                ))}
                {venues.length === 0 && (
                  <p className="text-xs text-stone-400">No venues yet</p>
                )}
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-2">Minimum rating</p>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((r) => (
                  <button
                    key={r}
                    onClick={() => setMinRating(minRating === r ? null : r)}
                    className={`w-9 h-9 text-sm rounded-full border transition-colors ${
                      minRating === r
                        ? 'bg-stone-900 text-white border-stone-900'
                        : 'bg-white text-stone-600 border-stone-200'
                    }`}
                  >
                    {r}★
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white">
        {loading ? (
          <div className="py-12 flex justify-center">
            <div className="w-5 h-5 border-2 border-stone-200 border-t-stone-600 rounded-full animate-spin" />
          </div>
        ) : results.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-stone-400 text-sm">
              {searched ? 'No entries match your search.' : 'Search your food journal.'}
            </p>
          </div>
        ) : (
          <>
            <p className="px-4 py-2.5 text-xs text-stone-400 border-b border-stone-100">
              {results.length} result{results.length !== 1 ? 's' : ''}
            </p>
            {results.map((entry) => (
              <EntryCard key={entry.id} entry={entry} />
            ))}
          </>
        )}
      </div>
    </>
  )
}
