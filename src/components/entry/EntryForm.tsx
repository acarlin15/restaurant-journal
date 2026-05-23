import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { RatingInput } from './RatingInput'
import { PhotoUpload } from './PhotoUpload'
import { VenueSelector } from './VenueSelector'
import { TagInput } from '@/components/tags/TagInput'
import { createEntry, updateEntry, uploadPhoto } from '@/lib/api'
import type { Entry, Venue, Tag } from '@/types/app'

interface EntryFormProps {
  initialData?: Partial<Entry>
}

export function EntryForm({ initialData }: EntryFormProps) {
  const navigate = useNavigate()
  const [dishName, setDishName] = useState(initialData?.dish_name ?? '')
  const [venue, setVenue] = useState<Venue | undefined>(initialData?.venue)
  const [date, setDate] = useState(initialData?.experience_date ?? new Date().toISOString().split('T')[0])
  const [rating, setRating] = useState<number | undefined>(initialData?.rating)
  const [notes, setNotes] = useState(initialData?.flavor_notes ?? '')
  const [photos, setPhotos] = useState<string[]>(initialData?.photo_urls ?? [])
  const [tags, setTags] = useState<Tag[]>(initialData?.tags ?? [])
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  function addPhoto(dataUrl: string) {
    setPhotos((p) => [...p, dataUrl])
  }

  function removePhoto(index: number) {
    setPhotos((p) => p.filter((_, i) => i !== index))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!dishName.trim()) { setError('Dish name is required'); return }
    setError('')
    setSubmitting(true)

    try {
      // Upload any new photos (DataURLs → storage URLs)
      const uploadedPhotos = await Promise.all(
        photos.map((p) => p.startsWith('data:') ? uploadPhoto(p) : Promise.resolve(p))
      )

      const input = {
        dish_name: dishName.trim(),
        venue_id: venue?.id,
        experience_date: date,
        rating,
        flavor_notes: notes.trim() || undefined,
        photo_urls: uploadedPhotos,
        tag_ids: tags.map((t) => t.id),
      }

      const saved = initialData?.id
        ? await updateEntry(initialData.id, input)
        : await createEntry(input)

      navigate(`/entry/${saved.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="px-4 py-5 space-y-6">
      <div className="space-y-1.5">
        <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wide">
          Dish *
        </label>
        <input
          type="text"
          placeholder="What did you eat?"
          value={dishName}
          onChange={(e) => setDishName(e.target.value)}
          className="w-full px-3 py-2.5 text-base border border-stone-200 rounded-xl bg-white placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-900/20"
          autoFocus
        />
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>

      <div className="space-y-1.5">
        <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wide">
          Venue
        </label>
        <VenueSelector value={venue} onChange={setVenue} />
      </div>

      <div className="space-y-1.5">
        <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wide">
          Date
        </label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full px-3 py-2.5 text-sm border border-stone-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-stone-900/20"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wide">
          Rating
        </label>
        <RatingInput value={rating} onChange={setRating} />
      </div>

      <div className="space-y-2">
        <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wide">
          Photos
        </label>
        <PhotoUpload photos={photos} onAdd={addPhoto} onRemove={removePhoto} />
      </div>

      <div className="space-y-1.5">
        <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wide">
          Tasting notes
        </label>
        <textarea
          placeholder="Describe the flavors, textures, what stood out…"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={4}
          className="w-full px-3 py-2.5 text-sm border border-stone-200 rounded-xl bg-white placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-900/20 resize-none leading-relaxed"
        />
      </div>

      <div className="space-y-1.5">
        <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wide">
          Tags
        </label>
        <TagInput selected={tags} onChange={setTags} />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full py-3.5 bg-stone-900 text-white font-semibold rounded-xl text-sm active:scale-98 transition-transform disabled:opacity-60"
      >
        {submitting ? 'Saving…' : (initialData?.id ? 'Save changes' : 'Log entry')}
      </button>
    </form>
  )
}
