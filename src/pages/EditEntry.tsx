import { useState, useEffect } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import { PageHeader } from '@/components/layout/PageHeader'
import { EntryForm } from '@/components/entry/EntryForm'
import { fetchEntry } from '@/lib/api'
import type { Entry } from '@/types/app'

export function EditEntry() {
  const { id } = useParams<{ id: string }>()
  const [entry, setEntry] = useState<Entry | null | undefined>(undefined)

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

  return (
    <>
      <PageHeader title="Edit entry" showBack />
      <EntryForm initialData={entry} />
    </>
  )
}
