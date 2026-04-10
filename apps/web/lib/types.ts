export type Solution = {
  id: string
  title: string
  description: string
  adl_category: string
  disability_tags: string[]
  price_tier?: string
  is_diy?: boolean
  source_url?: string
  cover_image_url?: string
  what_made_it_work?: string
  relevance_score?: number
  sourceType?: string
  sourceName?: string
}

export type CollectionColor = 'red' | 'orange' | 'yellow' | 'green' | 'teal' | 'blue' | 'purple' | 'pink'

export type Collection = {
  id: string
  name: string
  color: string
  solutionIds: string[]
}

export type CommunityRating = {
  average: number
  count: number
  userRating: number | null
}


export type ChallengeCategory = {
  id: string
  slug: string
  label: string
  description: string
  icon_emoji: string
  sort_order: number
}
