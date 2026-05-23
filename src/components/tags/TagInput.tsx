import { useState, useRef, useEffect } from 'react'
import { Plus, X } from 'lucide-react'
import { fetchTags, createTag } from '@/lib/api'
import type { Tag } from '@/types/app'

interface TagInputProps {
  selected: Tag[]
  onChange: (tags: Tag[]) => void
}

export function TagInput({ selected, onChange }: TagInputProps) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [allTags, setAllTags] = useState<Tag[]>([])
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchTags().then(setAllTags)
  }, [])

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const selectedIds = new Set(selected.map((t) => t.id))
  const filtered = allTags.filter(
    (t) => !selectedIds.has(t.id) && t.name.toLowerCase().includes(query.toLowerCase())
  )
  const showCreate =
    query.trim() && !allTags.some((t) => t.name === query.trim().toLowerCase())

  function add(tag: Tag) {
    onChange([...selected, tag])
    setQuery('')
    inputRef.current?.focus()
  }

  async function create() {
    const name = query.trim().toLowerCase()
    if (!name) return
    const tag = await createTag(name)
    setAllTags((prev) => [...prev, tag].sort((a, b) => a.name.localeCompare(b.name)))
    add(tag)
  }

  function remove(id: string) {
    onChange(selected.filter((t) => t.id !== id))
  }

  return (
    <div ref={containerRef} className="relative">
      <div className="flex flex-wrap gap-2 min-h-[44px] px-3 py-2 border border-stone-200 rounded-xl bg-white focus-within:ring-2 focus-within:ring-stone-900/20">
        {selected.map((tag) => (
          <span
            key={tag.id}
            className="flex items-center gap-1 pl-2.5 pr-1.5 py-0.5 bg-stone-900 text-white text-xs rounded-full h-6"
          >
            {tag.name}
            <button
              type="button"
              onClick={() => remove(tag.id)}
              className="flex items-center justify-center w-4 h-4 rounded-full hover:bg-white/20 transition-colors"
              aria-label={`Remove ${tag.name}`}
            >
              <X size={10} />
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          type="text"
          placeholder={selected.length === 0 ? 'Add tags…' : ''}
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true) }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') { e.preventDefault(); if (showCreate) create() }
            if (e.key === 'Backspace' && !query && selected.length > 0) {
              remove(selected[selected.length - 1].id)
            }
          }}
          className="flex-1 min-w-[100px] text-sm outline-none placeholder:text-stone-400 bg-transparent"
        />
      </div>

      {open && (filtered.length > 0 || showCreate) && (
        <div className="absolute z-50 top-full mt-1 left-0 right-0 bg-white border border-stone-200 rounded-xl shadow-lg overflow-hidden max-h-48 overflow-y-auto">
          {filtered.map((tag) => (
            <button
              key={tag.id}
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => add(tag)}
              className="w-full flex items-center gap-2 px-3 py-2.5 text-left text-sm text-stone-700 hover:bg-stone-50 transition-colors"
            >
              <span className="text-stone-400">#</span>
              {tag.name}
            </button>
          ))}
          {showCreate && (
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={create}
              className="w-full flex items-center gap-2 px-3 py-2.5 text-left text-sm text-stone-700 hover:bg-stone-50 border-t border-stone-100 transition-colors"
            >
              <Plus size={13} className="text-stone-400" />
              Create &quot;{query.trim().toLowerCase()}&quot;
            </button>
          )}
        </div>
      )}
    </div>
  )
}
