export interface Venue {
  id: string
  name: string
  location?: string
  venue_type?: 'restaurant' | 'home' | 'market' | 'bar' | 'cafe'
}

export interface Tag {
  id: string
  name: string
}

export interface Entry {
  id: string
  dish_name: string
  venue?: Venue
  experience_date: string
  rating?: number
  flavor_notes?: string
  photo_urls: string[]
  tags: Tag[]
  created_at: string
}

export interface Profile {
  id: string
  display_name?: string
  dietary_preferences: string[]
}

export interface Stats {
  total_entries: number
  total_venues: number
  top_tags: { name: string; count: number }[]
  entries_this_month: number
}
