import { Link } from 'react-router-dom'
import { Star, MapPin } from 'lucide-react'
import type { Entry } from '@/types/app'

function formatDate(dateStr: string) {
  return new Date(dateStr + 'T12:00:00').toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={11}
          className={i < rating ? 'fill-amber-400 text-amber-400' : 'fill-stone-200 text-stone-200'}
        />
      ))}
    </div>
  )
}

interface EntryCardProps {
  entry: Entry
}

export function EntryCard({ entry }: EntryCardProps) {
  return (
    <Link to={`/entry/${entry.id}`} className="block active:opacity-80 transition-opacity">
      <article className="flex gap-3 px-4 py-3.5 border-b border-stone-100 last:border-0">
        {/* Photo or placeholder */}
        <div className="flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden bg-stone-100">
          {entry.photo_urls[0] ? (
            <img
              src={entry.photo_urls[0]}
              alt={entry.dish_name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-2xl">🍽️</div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-semibold text-stone-900 text-sm leading-snug truncate">{entry.dish_name}</h3>
            <span className="flex-shrink-0 text-xs text-stone-400">{formatDate(entry.experience_date)}</span>
          </div>

          {entry.venue && (
            <div className="flex items-center gap-1 mb-1.5">
              <MapPin size={11} className="text-stone-400 flex-shrink-0" />
              <span className="text-xs text-stone-500 truncate">{entry.venue.name}</span>
            </div>
          )}

          {entry.rating && (
            <div className="mb-1.5">
              <StarRating rating={entry.rating} />
            </div>
          )}

          {entry.flavor_notes && (
            <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">{entry.flavor_notes}</p>
          )}

          {entry.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1.5">
              {entry.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag.id}
                  className="px-2 py-0.5 bg-stone-100 text-stone-600 text-xs rounded-full"
                >
                  {tag.name}
                </span>
              ))}
              {entry.tags.length > 3 && (
                <span className="px-2 py-0.5 text-stone-400 text-xs">+{entry.tags.length - 3}</span>
              )}
            </div>
          )}
        </div>
      </article>
    </Link>
  )
}
