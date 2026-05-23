import { useState, useEffect } from 'react'
import { PageHeader } from '@/components/layout/PageHeader'
import { fetchProfile, updateProfile, fetchStats } from '@/lib/api'
import type { Stats } from '@/types/app'

const DIETARY_OPTIONS = ['vegetarian', 'vegan', 'pescatarian', 'gluten-free', 'dairy-free', 'halal', 'kosher']

interface ProfileProps {
  onLogout?: () => void
}

export function Profile({ onLogout }: ProfileProps) {
  const [displayName, setDisplayName] = useState('')
  const [dietaryPrefs, setDietaryPrefs] = useState<string[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchProfile().then((p) => {
      if (p) {
        setDisplayName(p.display_name ?? '')
        setDietaryPrefs(p.dietary_preferences)
      }
    })
    fetchStats().then(setStats)
  }, [])

  function togglePref(pref: string) {
    setDietaryPrefs((prev) =>
      prev.includes(pref) ? prev.filter((p) => p !== pref) : [...prev, pref]
    )
  }

  async function handleSave() {
    setSaving(true)
    await updateProfile({ display_name: displayName, dietary_preferences: dietaryPrefs })
    setSaving(false)
    setEditing(false)
  }

  return (
    <>
      <PageHeader
        title="Profile"
        right={
          !editing ? (
            <button onClick={() => setEditing(true)} className="text-sm font-medium text-stone-600">
              Edit
            </button>
          ) : (
            <button
              onClick={handleSave}
              disabled={saving}
              className="text-sm font-semibold text-stone-900 disabled:opacity-50"
            >
              {saving ? 'Saving…' : 'Save'}
            </button>
          )
        }
      />

      <div className="px-4 py-6 space-y-8">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-200 to-orange-300 flex items-center justify-center text-2xl font-bold text-white select-none">
            {(displayName || 'U').charAt(0).toUpperCase()}
          </div>
          {editing ? (
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Display name"
              className="flex-1 text-xl font-bold text-stone-900 border-b-2 border-stone-900 focus:outline-none bg-transparent pb-1"
              autoFocus
            />
          ) : (
            <div>
              <p className="text-xl font-bold text-stone-900">{displayName || 'Food Lover'}</p>
              <p className="text-sm text-stone-400">Personal journal</p>
            </div>
          )}
        </div>

        <div>
          <h2 className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-3">Stats</h2>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Entries', value: stats?.total_entries ?? '–' },
              { label: 'Venues', value: stats?.total_venues ?? '–' },
              { label: 'This month', value: stats?.entries_this_month ?? '–' },
            ].map(({ label, value }) => (
              <div key={label} className="bg-stone-100 rounded-2xl p-3 text-center">
                <p className="text-2xl font-bold text-stone-900">{value}</p>
                <p className="text-xs text-stone-500 mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {stats && stats.top_tags.length > 0 && (
          <div>
            <h2 className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-3">Top tags</h2>
            <div className="space-y-2">
              {stats.top_tags.map(({ name, count }) => (
                <div key={name} className="flex items-center justify-between">
                  <span className="text-sm text-stone-700">#{name}</span>
                  <div className="flex items-center gap-3">
                    <div className="w-28 h-1.5 bg-stone-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-stone-700 rounded-full"
                        style={{ width: `${(count / stats.top_tags[0].count) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-stone-400 w-4 text-right">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <h2 className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-3">
            Dietary preferences
          </h2>
          {editing ? (
            <div className="flex flex-wrap gap-2">
              {DIETARY_OPTIONS.map((pref) => (
                <button
                  key={pref}
                  onClick={() => togglePref(pref)}
                  className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                    dietaryPrefs.includes(pref)
                      ? 'bg-stone-900 text-white border-stone-900'
                      : 'bg-white text-stone-600 border-stone-200'
                  }`}
                >
                  {pref}
                </button>
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {dietaryPrefs.length > 0 ? (
                dietaryPrefs.map((pref) => (
                  <span key={pref} className="px-3 py-1.5 text-sm bg-stone-100 text-stone-700 rounded-full">
                    {pref}
                  </span>
                ))
              ) : (
                <p className="text-sm text-stone-400">No preferences set</p>
              )}
            </div>
          )}
        </div>

        {onLogout && (
          <button
            onClick={onLogout}
            className="w-full py-3 text-sm text-stone-500 border border-stone-200 rounded-xl hover:bg-stone-100 transition-colors"
          >
            Sign out
          </button>
        )}
      </div>
    </>
  )
}
