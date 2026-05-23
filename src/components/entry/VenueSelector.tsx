import { useState, useRef, useEffect } from 'react'
import { MapPin, Plus } from 'lucide-react'
import { fetchVenues, createVenue } from '@/lib/api'
import type { Venue } from '@/types/app'
import { cn } from '@/lib/utils'

interface VenueSelectorProps {
  value?: Venue
  onChange: (venue: Venue | undefined) => void
}

export function VenueSelector({ value, onChange }: VenueSelectorProps) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [venues, setVenues] = useState<Venue[]>([])
  const [creating, setCreating] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchVenues().then(setVenues)
  }, [])

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const filtered = venues.filter((v) =>
    v.name.toLowerCase().includes(query.toLowerCase())
  )

  function handleSelect(venue: Venue) {
    onChange(venue)
    setQuery('')
    setOpen(false)
  }

  async function handleCreate() {
    const name = query.trim()
    if (!name || creating) return
    setCreating(true)
    try {
      const venue = await createVenue(name)
      setVenues((prev) => [...prev, venue].sort((a, b) => a.name.localeCompare(b.name)))
      onChange(venue)
      setQuery('')
      setOpen(false)
    } finally {
      setCreating(false)
    }
  }

  return (
    <div ref={containerRef} className="relative">
      {value ? (
        <div className="flex items-center gap-2 px-3 py-2.5 bg-stone-100 rounded-xl">
          <MapPin size={15} className="text-stone-500 flex-shrink-0" />
          <span className="text-sm text-stone-900 flex-1 truncate">{value.name}</span>
          <button
            type="button"
            onClick={() => onChange(undefined)}
            className="text-xs text-stone-400 hover:text-stone-600"
          >
            Clear
          </button>
        </div>
      ) : (
        <input
          type="text"
          placeholder="Search or add a venue…"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true) }}
          onFocus={() => setOpen(true)}
          className="w-full px-3 py-2.5 text-sm border border-stone-200 rounded-xl bg-white placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-900/20"
        />
      )}

      {open && !value && (
        <div className="absolute z-50 top-full mt-1 left-0 right-0 bg-white border border-stone-200 rounded-xl shadow-lg overflow-hidden max-h-56 overflow-y-auto">
          {filtered.map((venue) => (
            <button
              key={venue.id}
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => handleSelect(venue)}
              className="w-full flex items-center gap-2 px-3 py-2.5 text-left text-sm hover:bg-stone-50 transition-colors"
            >
              <MapPin size={13} className="text-stone-400 flex-shrink-0" />
              <div>
                <div className="text-stone-900">{venue.name}</div>
                {venue.location && <div className="text-xs text-stone-400">{venue.location}</div>}
              </div>
            </button>
          ))}
          {query.trim() && !filtered.some((v) => v.name.toLowerCase() === query.toLowerCase()) && (
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={handleCreate}
              disabled={creating}
              className={cn(
                'w-full flex items-center gap-2 px-3 py-2.5 text-left text-sm text-stone-700 hover:bg-stone-50 transition-colors disabled:opacity-50',
                filtered.length > 0 && 'border-t border-stone-100'
              )}
            >
              <Plus size={13} className="text-stone-500 flex-shrink-0" />
              {creating ? 'Adding…' : `Add "${query.trim()}"`}
            </button>
          )}
          {filtered.length === 0 && !query.trim() && (
            <div className="px-3 py-3 text-sm text-stone-400">Type to search venues</div>
          )}
        </div>
      )}
    </div>
  )
}
