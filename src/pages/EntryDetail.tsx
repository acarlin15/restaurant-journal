import { useState, useEffect } from 'react'
import { useParams, Navigate, useNavigate, Link } from 'react-router-dom'
import { Star, MapPin, Calendar, Pencil, Trash2 } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { fetchEntry, deleteEntry } from '@/lib/api'
import type { Entry } from '@/types/app'

function formatDate(dateStr: string) {
  return new Date(dateStr + 'T12:00:00').toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  })
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={18}
          className={s <= rating ? 'fill-amber-400 text-amber-400' : 'fill-stone-200 text-stone-200'}
        />
      ))}
    </div>
  )
}

export function EntryDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [entry, setEntry] = useState<Entry | null | undefined>(undefined)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (!id) return
    fetchEntry(id).then(setEntry)
  }, [id])

  if (entry === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="w-6 h-6 border-2 border-stone-200 border-t-stone-600 rounded-full animate-spin" />
      </div>
    )
  }

  if (!entry) return <Navigate to="/feed" replace />

  async function handleDelete() {
    if (!id) return
    setDeleting(true)
    await deleteEntry(id)
    navigate('/feed', { replace: true })
  }

  return (
    <>
      <PageHeader
        title={entry.dish_name}
        showBack
        right={
          <Link
            to={`/entry/${entry.id}/edit`}
            className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-stone-100 transition-colors"
            aria-label="Edit entry"
          >
            <Pencil size={17} className="text-stone-600" />
          </Link>
        }
      />

      <div className="bg-white min-h-screen">
        {entry.photo_urls[0] && (
          <div className="aspect-[4/3] bg-stone-100 overflow-hidden">
            <img
              src={entry.photo_urls[0]}
              alt={entry.dish_name}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="px-4 py-5 space-y-5">
          <div>
            <h1 className="text-2xl font-bold text-stone-900 mb-2">{entry.dish_name}</h1>
            {entry.rating && <StarRating rating={entry.rating} />}
          </div>

          <div className="space-y-2">
            {entry.venue && (
              <div className="flex items-center gap-2 text-stone-600">
                <MapPin size={15} className="text-stone-400 flex-shrink-0" />
                <span className="text-sm">{entry.venue.name}</span>
                {entry.venue.location && (
                  <span className="text-sm text-stone-400">· {entry.venue.location}</span>
                )}
              </div>
            )}
            <div className="flex items-center gap-2 text-stone-600">
              <Calendar size={15} className="text-stone-400 flex-shrink-0" />
              <span className="text-sm">{formatDate(entry.experience_date)}</span>
            </div>
          </div>

          {entry.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {entry.tags.map((tag) => (
                <span
                  key={tag.id}
                  className="px-3 py-1 bg-stone-100 text-stone-700 text-sm rounded-full"
                >
                  {tag.name}
                </span>
              ))}
            </div>
          )}

          {entry.flavor_notes && (
            <div>
              <h2 className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-2">
                Tasting notes
              </h2>
              <p className="text-sm text-stone-700 leading-relaxed">{entry.flavor_notes}</p>
            </div>
          )}

          {entry.photo_urls.length > 1 && (
            <div className="grid grid-cols-3 gap-2">
              {entry.photo_urls.slice(1).map((url, i) => (
                <div key={i} className="aspect-square rounded-xl overflow-hidden bg-stone-100">
                  <img src={url} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}

          {!showDeleteConfirm ? (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="flex items-center gap-2 text-sm text-red-500 py-2"
            >
              <Trash2 size={15} />
              Delete entry
            </button>
          ) : (
            <div className="p-4 bg-red-50 rounded-xl space-y-3">
              <p className="text-sm text-stone-700 font-medium">Delete this entry?</p>
              <p className="text-xs text-stone-500">This can't be undone.</p>
              <div className="flex gap-3">
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-lg disabled:opacity-50"
                >
                  {deleting ? 'Deleting…' : 'Delete'}
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 bg-stone-100 text-stone-700 text-sm font-medium rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
