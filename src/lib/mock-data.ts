import type { Entry, Venue, Tag, Profile, Stats } from '@/types/app'

export const mockVenues: Venue[] = [
  { id: 'v1', name: 'Osteria Mozza', location: 'Los Angeles, CA', venue_type: 'restaurant' },
  { id: 'v2', name: 'Sqirl', location: 'Los Angeles, CA', venue_type: 'cafe' },
  { id: 'v3', name: 'Republique', location: 'Los Angeles, CA', venue_type: 'restaurant' },
  { id: 'v4', name: 'Home Kitchen', venue_type: 'home' },
  { id: 'v5', name: 'Konbi', location: 'Los Angeles, CA', venue_type: 'cafe' },
  { id: 'v6', name: 'Night + Market', location: 'West Hollywood, CA', venue_type: 'restaurant' },
]

export const mockTags: Tag[] = [
  { id: 't1', name: 'umami' },
  { id: 't2', name: 'date night' },
  { id: 't3', name: 'repeat' },
  { id: 't4', name: 'natural wine' },
  { id: 't5', name: 'spicy' },
  { id: 't6', name: 'vegetarian' },
  { id: 't7', name: 'pasta' },
  { id: 't8', name: 'must return' },
  { id: 't9', name: 'brunch' },
  { id: 't10', name: 'tokyo' },
]

export const mockEntries: Entry[] = [
  {
    id: 'e1',
    dish_name: 'Burrata with stone fruit',
    venue: mockVenues[0],
    experience_date: '2026-05-07',
    rating: 5,
    flavor_notes: 'Incredibly fresh burrata — almost milky sweet. The nectarine cut through the richness perfectly. Finished with a generous pour of their house olive oil and flaky sea salt. One of the best bites I\'ve had this year.',
    photo_urls: ['https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&q=80'],
    tags: [mockTags[0], mockTags[1], mockTags[2]],
    created_at: '2026-05-07T19:30:00Z',
  },
  {
    id: 'e2',
    dish_name: 'Sorrel rice bowl',
    venue: mockVenues[1],
    experience_date: '2026-05-05',
    rating: 4,
    flavor_notes: 'Bright and tangy from the sorrel pesto. The crispy rice at the bottom was the highlight — almost like a tahdig. Perfect brunch dish.',
    photo_urls: ['https://images.unsplash.com/photo-1512058564366-18510be2db19?w=800&q=80'],
    tags: [mockTags[5], mockTags[8]],
    created_at: '2026-05-05T10:15:00Z',
  },
  {
    id: 'e3',
    dish_name: 'Croque madame',
    venue: mockVenues[2],
    experience_date: '2026-05-03',
    rating: 5,
    flavor_notes: 'The béchamel was silky with just the right amount of gruyère funk. Runny yolk over the top tied everything together. Weekend treat.',
    photo_urls: ['https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=800&q=80'],
    tags: [mockTags[7], mockTags[8]],
    created_at: '2026-05-03T11:00:00Z',
  },
  {
    id: 'e4',
    dish_name: 'Cacio e pepe — homemade',
    venue: mockVenues[3],
    experience_date: '2026-04-30',
    rating: 4,
    flavor_notes: 'Second attempt at making this properly. Finally got the emulsification right — no clumping. Key was letting the pasta water cool slightly before adding the cheese. Tonnarelli pasta from the Italian deli.',
    photo_urls: [],
    tags: [mockTags[6], mockTags[5]],
    created_at: '2026-04-30T20:00:00Z',
  },
  {
    id: 'e5',
    dish_name: 'Egg salad sandwich',
    venue: mockVenues[4],
    experience_date: '2026-04-28',
    rating: 5,
    flavor_notes: 'The Japanese milk bread makes this. Impossibly soft. The egg salad is lightly seasoned — lets the freshness speak. Been thinking about this one all week.',
    photo_urls: ['https://images.unsplash.com/photo-1528736235302-52922df5c122?w=800&q=80'],
    tags: [mockTags[2], mockTags[7]],
    created_at: '2026-04-28T12:30:00Z',
  },
  {
    id: 'e6',
    dish_name: 'Nam tok moo',
    venue: mockVenues[5],
    experience_date: '2026-04-25',
    rating: 5,
    flavor_notes: 'Grilled pork waterfall salad — the toasted rice powder gives it an incredible texture. Funky fish sauce dressing with tons of fresh herbs. Absolutely fiery.',
    photo_urls: ['https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=800&q=80'],
    tags: [mockTags[0], mockTags[4], mockTags[7]],
    created_at: '2026-04-25T19:45:00Z',
  },
]

export const mockProfile: Profile = {
  id: 'user-1',
  display_name: 'Carlina',
  dietary_preferences: ['pescatarian'],
}

export const mockStats: Stats = {
  total_entries: 42,
  total_venues: 18,
  entries_this_month: 6,
  top_tags: [
    { name: 'repeat', count: 12 },
    { name: 'umami', count: 9 },
    { name: 'must return', count: 7 },
    { name: 'natural wine', count: 6 },
    { name: 'date night', count: 5 },
  ],
}
