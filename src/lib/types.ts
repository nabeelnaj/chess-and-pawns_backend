export interface Registration {
  id: string
  created_at: string
  updated_at: string
  full_name: string
  email: string
  phone: string | null
  age_group: string | null
  games_of_interest: string[]
  visit_type: string
  party_size: string
  notes: string | null
  consent_given: boolean
  status: 'new' | 'contacted' | 'interested' | 'confirmed' | 'waitlisted' | 'archived'
  admin_notes: string | null
  reviewed_by: string | null
  reviewed_at: string | null
}

export interface RegistrationStats {
  total: number
  new: number
  contacted: number
  interested: number
  confirmed: number
  waitlisted: number
  archived: number
}

export interface GamePreferenceStats {
  game: string
  count: number
  percentage: number
}

export interface VisitTypeStats {
  type: string
  count: number
  percentage: number
}

export interface DateRange {
  start: string
  end: string
}