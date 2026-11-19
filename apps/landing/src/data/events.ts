/** Events and the partner hubs where volunteers meet. Shared by /events and the homepage strip. */

export interface Hub {
  id: string
  name: string
  city: string
  /** What the hub offers volunteers */
  offers: string[]
  website: string
  logo?: { src: string; w: number; h: number }
}

export const hubs: Hub[] = [
  {
    id: 'denton-maker-center',
    name: 'Denton Maker Center',
    city: 'Denton, TX',
    offers: ['Tools and equipment', 'Expert staff', 'Safe, inclusive workspaces'],
    website: 'https://www.dentonmakercenter.com/',
    // Same file the Partners page uses
    logo: { src: '/images/partners/partner-denton-maker-center.png', w: 500, h: 431 },
  },
]

export interface DllEvent {
  id: string
  title: string
  /** Shown as written, e.g. "Date coming soon" or "Saturday, March 6, 2027" */
  when: string
  description: string
  hubId: string
  /** Not fully confirmed: shows "Planned at <hub>" instead of "At <hub>" */
  hubPlanned?: boolean
}

/** Upcoming events, soonest first. */
export const events: DllEvent[] = [
  {
    id: 'first-community-event',
    title: 'Our first community event',
    when: 'Date coming soon',
    description:
      "Stay tuned for our first community event! We're planning a chance to meet, share ideas, and start building together.",
    hubId: 'denton-maker-center',
    hubPlanned: true,
  },
]

export const hubById = (id: string) => hubs.find((h) => h.id === id)

/** "Planned at Denton Maker Center" or "At Denton Maker Center" */
export const hubLine = (e: DllEvent) => {
  const hub = hubById(e.hubId)
  return hub ? `${e.hubPlanned ? 'Planned at' : 'At'} ${hub.name}` : ''
}
