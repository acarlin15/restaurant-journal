import { useState } from 'react'
import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface RatingInputProps {
  value?: number
  onChange: (rating: number) => void
}

export function RatingInput({ value, onChange }: RatingInputProps) {
  const [hovered, setHovered] = useState<number | null>(null)
  const active = hovered ?? value ?? 0

  return (
    <div className="flex gap-1" role="group" aria-label="Rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className="p-1 -m-1 rounded transition-transform active:scale-90"
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(null)}
          onTouchStart={() => setHovered(star)}
          onTouchEnd={() => setHovered(null)}
          onClick={() => onChange(star === value ? 0 : star)}
          aria-label={`${star} star${star !== 1 ? 's' : ''}`}
        >
          <Star
            size={30}
            strokeWidth={1.5}
            className={cn(
              'transition-colors',
              star <= active ? 'fill-amber-400 text-amber-400' : 'fill-stone-200 text-stone-200'
            )}
          />
        </button>
      ))}
    </div>
  )
}
