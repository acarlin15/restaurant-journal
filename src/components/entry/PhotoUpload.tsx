import { useRef } from 'react'
import { Camera, X } from 'lucide-react'

interface PhotoUploadProps {
  photos: string[]
  onAdd: (dataUrl: string) => void
  onRemove: (index: number) => void
}

export function PhotoUpload({ photos, onAdd, onRemove }: PhotoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const result = ev.target?.result
      if (typeof result === 'string') onAdd(result)
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  return (
    <div>
      <div className="flex gap-2 flex-wrap">
        {photos.map((src, i) => (
          <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden bg-stone-100">
            <img src={src} alt="" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => onRemove(i)}
              className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 flex items-center justify-center"
              aria-label="Remove photo"
            >
              <X size={12} className="text-white" />
            </button>
          </div>
        ))}

        {photos.length < 4 && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="w-20 h-20 rounded-xl border-2 border-dashed border-stone-300 flex flex-col items-center justify-center gap-1 text-stone-400 active:bg-stone-100 transition-colors"
          >
            <Camera size={22} strokeWidth={1.5} />
            <span className="text-xs">Add photo</span>
          </button>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  )
}
