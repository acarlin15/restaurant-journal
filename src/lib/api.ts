import { supabase } from './supabase'
import type { Entry, Venue, Tag, Profile, Stats } from '@/types/app'
import { mockEntries, mockVenues, mockTags, mockProfile, mockStats } from './mock-data'

let _demoMode = false
export function setDemoMode(on: boolean) { _demoMode = on }

const ENTRY_SELECT = '*, venues(*), entry_tags(tags(*))'

function transformEntry(raw: Record<string, unknown>): Entry {
  return {
    id: raw.id as string,
    dish_name: raw.dish_name as string,
    venue: (raw.venues as Venue) ?? undefined,
    experience_date: raw.experience_date as string,
    rating: (raw.rating as number) ?? undefined,
    flavor_notes: (raw.flavor_notes as string) ?? undefined,
    photo_urls: (raw.photo_urls as string[]) ?? [],
    tags: ((raw.entry_tags as { tags: Tag }[]) ?? []).map((et) => et.tags).filter(Boolean),
    created_at: raw.created_at as string,
  }
}

// ---- entries ----

export async function fetchEntries(offset = 0, limit = 20): Promise<Entry[]> {
  if (_demoMode) return mockEntries.slice(offset, offset + limit)
  const { data, error } = await supabase
    .from('entries')
    .select(ENTRY_SELECT)
    .eq('is_deleted', false)
    .order('experience_date', { ascending: false })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)
  if (error) throw error
  return (data ?? []).map(transformEntry)
}

export async function fetchEntry(id: string): Promise<Entry | null> {
  if (_demoMode) return mockEntries.find((e) => e.id === id) ?? null
  const { data, error } = await supabase
    .from('entries')
    .select(ENTRY_SELECT)
    .eq('id', id)
    .eq('is_deleted', false)
    .single()
  if (error) return null
  return transformEntry(data)
}

export async function createEntry(input: {
  dish_name: string
  venue_id?: string
  experience_date: string
  rating?: number
  flavor_notes?: string
  photo_urls: string[]
  tag_ids: string[]
}): Promise<Entry> {
  if (_demoMode) {
    const entry: Entry = {
      id: `demo-${Date.now()}`,
      dish_name: input.dish_name,
      venue: mockVenues.find((v) => v.id === input.venue_id),
      experience_date: input.experience_date,
      rating: input.rating,
      flavor_notes: input.flavor_notes,
      photo_urls: input.photo_urls,
      tags: mockTags.filter((t) => input.tag_ids.includes(t.id)),
      created_at: new Date().toISOString(),
    }
    mockEntries.unshift(entry)
    return entry
  }
  const { data, error } = await supabase
    .from('entries')
    .insert({
      dish_name: input.dish_name,
      venue_id: input.venue_id ?? null,
      experience_date: input.experience_date,
      rating: input.rating ?? null,
      flavor_notes: input.flavor_notes || null,
      photo_urls: input.photo_urls,
    })
    .select('id')
    .single()
  if (error) throw error

  if (input.tag_ids.length > 0) {
    const { error: tagError } = await supabase
      .from('entry_tags')
      .insert(input.tag_ids.map((tag_id) => ({ entry_id: data.id, tag_id })))
    if (tagError) throw tagError
  }

  const entry = await fetchEntry(data.id)
  if (!entry) throw new Error('Failed to fetch created entry')
  return entry
}

export async function updateEntry(
  id: string,
  input: {
    dish_name: string
    venue_id?: string
    experience_date: string
    rating?: number
    flavor_notes?: string
    photo_urls: string[]
    tag_ids: string[]
  }
): Promise<Entry> {
  if (_demoMode) {
    const idx = mockEntries.findIndex((e) => e.id === id)
    const updated: Entry = {
      ...(mockEntries[idx] ?? {}),
      id,
      dish_name: input.dish_name,
      venue: mockVenues.find((v) => v.id === input.venue_id),
      experience_date: input.experience_date,
      rating: input.rating,
      flavor_notes: input.flavor_notes,
      photo_urls: input.photo_urls,
      tags: mockTags.filter((t) => input.tag_ids.includes(t.id)),
      created_at: mockEntries[idx]?.created_at ?? new Date().toISOString(),
    }
    if (idx >= 0) mockEntries[idx] = updated
    return updated
  }
  const { error } = await supabase
    .from('entries')
    .update({
      dish_name: input.dish_name,
      venue_id: input.venue_id ?? null,
      experience_date: input.experience_date,
      rating: input.rating ?? null,
      flavor_notes: input.flavor_notes || null,
      photo_urls: input.photo_urls,
    })
    .eq('id', id)
  if (error) throw error

  await supabase.from('entry_tags').delete().eq('entry_id', id)
  if (input.tag_ids.length > 0) {
    const { error: tagError } = await supabase
      .from('entry_tags')
      .insert(input.tag_ids.map((tag_id) => ({ entry_id: id, tag_id })))
    if (tagError) throw tagError
  }

  const entry = await fetchEntry(id)
  if (!entry) throw new Error('Failed to fetch updated entry')
  return entry
}

export async function deleteEntry(id: string): Promise<void> {
  if (_demoMode) {
    const idx = mockEntries.findIndex((e) => e.id === id)
    if (idx >= 0) mockEntries.splice(idx, 1)
    return
  }
  const { error } = await supabase
    .from('entries')
    .update({ is_deleted: true })
    .eq('id', id)
  if (error) throw error
}

// ---- search ----

export async function searchEntries(
  query: string,
  venueId?: string | null,
  minRating?: number | null
): Promise<Entry[]> {
  if (_demoMode) {
    return mockEntries.filter((e) => {
      const matchQuery = !query.trim() ||
        e.dish_name.toLowerCase().includes(query.toLowerCase()) ||
        (e.flavor_notes ?? '').toLowerCase().includes(query.toLowerCase())
      const matchVenue = !venueId || e.venue?.id === venueId
      const matchRating = !minRating || (e.rating ?? 0) >= minRating
      return matchQuery && matchVenue && matchRating
    })
  }
  let q = supabase.from('entries').select(ENTRY_SELECT).eq('is_deleted', false)

  if (query.trim()) {
    q = q.or(`dish_name.ilike.%${query}%,flavor_notes.ilike.%${query}%`)
  }
  if (venueId) q = q.eq('venue_id', venueId)
  if (minRating) q = q.gte('rating', minRating)

  const { data, error } = await q.order('experience_date', { ascending: false }).limit(100)
  if (error) throw error
  return (data ?? []).map(transformEntry)
}

// ---- venues ----

export async function fetchVenues(): Promise<Venue[]> {
  if (_demoMode) return [...mockVenues]
  const { data, error } = await supabase.from('venues').select('*').order('name')
  if (error) throw error
  return data ?? []
}

export async function createVenue(name: string, location?: string): Promise<Venue> {
  if (_demoMode) {
    const venue: Venue = { id: `demo-v-${Date.now()}`, name, location, venue_type: 'restaurant' }
    mockVenues.push(venue)
    return venue
  }
  const { data, error } = await supabase
    .from('venues')
    .insert({ name, location: location || null, venue_type: 'restaurant' })
    .select()
    .single()
  if (error) throw error
  return data
}

// ---- tags ----

export async function fetchTags(): Promise<Tag[]> {
  if (_demoMode) return [...mockTags]
  const { data, error } = await supabase.from('tags').select('*').order('name')
  if (error) throw error
  return data ?? []
}

export async function createTag(name: string): Promise<Tag> {
  if (_demoMode) {
    const existing = mockTags.find((t) => t.name === name)
    if (existing) return existing
    const tag: Tag = { id: `demo-t-${Date.now()}`, name }
    mockTags.push(tag)
    return tag
  }
  const { data, error } = await supabase
    .from('tags')
    .upsert({ name }, { onConflict: 'user_id,name' })
    .select()
    .single()
  if (error) throw error
  return data
}

// ---- profile ----

export async function fetchProfile(): Promise<Profile | null> {
  if (_demoMode) return { ...mockProfile }
  const { data, error } = await supabase.from('profiles').select('*').single()
  if (error) return null
  return {
    id: data.id,
    display_name: data.display_name ?? undefined,
    dietary_preferences: data.dietary_preferences ?? [],
  }
}

export async function updateProfile(updates: {
  display_name?: string
  dietary_preferences?: string[]
}): Promise<void> {
  if (_demoMode) {
    Object.assign(mockProfile, updates)
    return
  }
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')
  const { error } = await supabase
    .from('profiles')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', user.id)
  if (error) throw error
}

// ---- stats ----

export async function fetchStats(): Promise<Stats> {
  if (_demoMode) return { ...mockStats }
  const today = new Date()
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1)
    .toISOString()
    .split('T')[0]

  const [entriesRes, venuesRes, monthRes, tagsRes] = await Promise.all([
    supabase.from('entries').select('*', { count: 'exact', head: true }).eq('is_deleted', false),
    supabase.from('venues').select('*', { count: 'exact', head: true }),
    supabase
      .from('entries')
      .select('*', { count: 'exact', head: true })
      .eq('is_deleted', false)
      .gte('experience_date', monthStart),
    supabase.from('entry_tags').select('tags(name)'),
  ])

  const tagCounts: Record<string, number> = {}
  for (const row of tagsRes.data ?? []) {
    const name = (row.tags as { name: string } | null)?.name
    if (name) tagCounts[name] = (tagCounts[name] ?? 0) + 1
  }
  const top_tags = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, count]) => ({ name, count }))

  return {
    total_entries: entriesRes.count ?? 0,
    total_venues: venuesRes.count ?? 0,
    entries_this_month: monthRes.count ?? 0,
    top_tags,
  }
}

// ---- photos ----

export async function uploadPhoto(dataUrl: string): Promise<string> {
  if (_demoMode) return dataUrl
  const res = await fetch(dataUrl)
  const blob = await res.blob()
  const ext = blob.type.includes('webp') ? 'webp' : (blob.type.split('/')[1] ?? 'jpg')
  const { data: { user } } = await supabase.auth.getUser()
  const userId = user?.id ?? 'unknown'
  const filename = `${userId}/${Date.now()}.${ext}`

  const { error } = await supabase.storage
    .from('entry-photos')
    .upload(filename, blob, { contentType: blob.type })
  if (error) throw error

  const { data } = supabase.storage.from('entry-photos').getPublicUrl(filename)
  return data.publicUrl
}
