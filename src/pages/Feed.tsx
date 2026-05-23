import { useState, useEffect } from 'react'
import { PageHeader } from '@/components/layout/PageHeader'
import { FloatingActionButton } from '@/components/layout/FloatingActionButton'
import { EntryCard } from '@/components/feed/EntryCard'
import { EmptyFeed } from '@/components/feed/EmptyFeed'
import { fetchEntries } from '@/lib/api'
import type { Entry } from '@/types/app'

const PAGE_SIZE = 20

export function Feed() {
  const [entries, setEntries] = useState<Entry[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(false)

  useEffect(() => {
    fetchEntries(0, PAGE_SIZE)
      .then((data) => {
        setEntries(data)
        setHasMore(data.length === PAGE_SIZE)
      })
      .finally(() => setLoading(false))
  }, [])

  async function loadMore() {
    setLoadingMore(true)
    const more = await fetchEntries(entries.length, PAGE_SIZE)
    setEntries((prev) => [...prev, ...more])
    setHasMore(more.length === PAGE_SIZE)
    setLoadingMore(false)
  }

  return (
    <>
      <PageHeader title="Journal" />
      <div className="bg-white">
        {loading ? (
          <div className="py-16 flex justify-center">
            <div className="w-6 h-6 border-2 border-stone-200 border-t-stone-600 rounded-full animate-spin" />
          </div>
        ) : entries.length === 0 ? (
          <EmptyFeed />
        ) : (
          <>
            {entries.map((entry) => (
              <EntryCard key={entry.id} entry={entry} />
            ))}
            {hasMore && (
              <button
                onClick={loadMore}
                disabled={loadingMore}
                className="w-full py-4 text-sm text-stone-500 hover:text-stone-700 transition-colors disabled:opacity-50"
              >
                {loadingMore ? 'Loading…' : 'Load more'}
              </button>
            )}
          </>
        )}
      </div>
      <FloatingActionButton />
    </>
  )
}
