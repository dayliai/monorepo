export interface Database {
  public: {
    Tables: {
      internal_solutions: {
        Row: InternalSolution
        Insert: Omit<InternalSolution, 'id' | 'created_at'>
        Update: Partial<Omit<InternalSolution, 'id'>>
        Relationships: never[]
      }
      diagnostic_prompts: {
        Row: DiagnosticPrompt
        Insert: Omit<DiagnosticPrompt, 'id'>
        Update: Partial<Omit<DiagnosticPrompt, 'id'>>
        Relationships: never[]
      }
      diagnostic_paths: {
        Row: DiagnosticPath
        Insert: Omit<DiagnosticPath, 'id'>
        Update: Partial<Omit<DiagnosticPath, 'id'>>
        Relationships: never[]
      }
      filter_options: {
        Row: FilterOption
        Insert: Omit<FilterOption, 'id'>
        Update: Partial<Omit<FilterOption, 'id'>>
        Relationships: never[]
      }
      solution_feedback: {
        Row: SolutionFeedback
        Insert: Omit<SolutionFeedback, 'id' | 'created_at'>
        Update: Partial<Omit<SolutionFeedback, 'id'>>
        Relationships: never[]
      }
      user_liked_solutions: {
        Row: UserLikedSolution
        Insert: Omit<UserLikedSolution, 'id' | 'created_at'>
        Update: Partial<Omit<UserLikedSolution, 'id'>>
        Relationships: never[]
      }
      user_collections: {
        Row: UserCollection
        Insert: Omit<UserCollection, 'id' | 'created_at'>
        Update: Partial<Omit<UserCollection, 'id'>>
        Relationships: never[]
      }
      collection_items: {
        Row: CollectionItem
        Insert: Omit<CollectionItem, 'id' | 'created_at'>
        Update: Partial<Omit<CollectionItem, 'id'>>
        Relationships: never[]
      }
      community_submissions: {
        Row: CommunitySubmission
        Insert: Omit<CommunitySubmission, 'id' | 'created_at'>
        Update: Partial<Omit<CommunitySubmission, 'id'>>
        Relationships: never[]
      }
      community_requests: {
        Row: CommunityRequest
        Insert: Omit<CommunityRequest, 'id' | 'created_at'>
        Update: Partial<Omit<CommunityRequest, 'id'>>
        Relationships: never[]
      }
      contacts: {
        Row: Contact
        Insert: Omit<Contact, 'id' | 'created_at'>
        Update: Partial<Omit<Contact, 'id'>>
        Relationships: never[]
      }
    }
    Views: Record<string, { Row: Record<string, unknown>; Relationships: never[] }>
    Functions: Record<string, { Args: Record<string, unknown>; Returns: unknown }>
  }
}

export interface InternalSolution {
  id: string
  title: string
  description: string
  detailed_description?: string
  source_type: 'web' | 'youtube' | 'community'
  source_url?: string
  cover_image_url?: string
  adl_category: string
  disability_tags: string[]
  match_percentage?: number
  match_reason?: string
  person_name?: string
  time_ago?: string
  price_tier?: 'free' | '$' | '$$' | '$$$$'
  is_diy?: boolean
  what_made_it_work?: string
  created_at: string
}

export interface DiagnosticPrompt {
  id: string
  step: number
  question: string
  subtitle?: string
  options: DiagnosticOption[]
  condition_field?: string
  condition_value?: string
}

export interface DiagnosticOption {
  label: string
  value: string
  icon?: string
}

export interface DiagnosticPath {
  id: string
  parent_step: number
  parent_value: string
  step: number
  question: string
  options: DiagnosticOption[]
  is_multi_select?: boolean
}

export interface FilterOption {
  id: string
  category: string
  label: string
  value: string
  sort_order: number
}

export interface SolutionFeedback {
  id: string
  solution_id: string
  user_id?: string
  session_id: string
  is_helpful: boolean
  created_at: string
}

export interface UserLikedSolution {
  id: string
  user_id: string
  solution_id: string
  created_at: string
}

export interface UserCollection {
  id: string
  user_id: string
  name: string
  created_at: string
}

export interface CollectionItem {
  id: string
  collection_id: string
  solution_id: string
  created_at: string
}

export interface CommunitySubmission {
  id: string
  adl_category: string
  title: string
  description: string
  what_made_it_work?: string
  person_name: string
  email?: string
  notify_on_publish: boolean
  conversation_log: Array<{ role: string; content: string }>
  status: 'pending' | 'approved' | 'rejected'
  website_url?: string
  pricing?: string
  contact_name?: string
  contact_email?: string
  contact_phone?: string
  photos: string[]
  tags: string[]
  created_at: string
}

export interface CommunityRequest {
  id: string
  adl_category: string
  challenge_description: string
  what_tried?: string
  person_name: string
  email?: string
  notify_on_solution: boolean
  conversation_log: Array<{ role: string; content: string }>
  status: 'pending' | 'reviewed' | 'matched'
  condition_context?: string
  daily_impact?: string
  environment?: string
  contact_name?: string
  contact_email?: string
  contact_phone?: string
  photos: string[]
  urgency?: string
  created_at: string
}

export interface Contact {
  id: string
  email: string
  name?: string
  source: 'submission' | 'request' | 'contact_form'
  created_at: string
}

export type AgentType = 'submission' | 'request'

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export interface ChatRequest {
  messages: ChatMessage[]
  system: string
  agentType: AgentType
}
