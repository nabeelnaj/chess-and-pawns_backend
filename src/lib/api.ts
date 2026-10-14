import { supabase } from './supabase'
import type { Registration, RegistrationStats, GamePreferenceStats, VisitTypeStats, DateRange } from './types'

// Convert Supabase registration to our type
function mapRegistration(data: any): Registration {
  return {
    id: data.id,
    created_at: data.created_at,
    updated_at: data.updated_at,
    full_name: data.full_name,
    email: data.email,
    phone: data.phone,
    age_group: data.age_group,
    games_of_interest: data.games_of_interest || [],
    visit_type: data.visit_type,
    party_size: data.party_size,
    notes: data.notes,
    consent_given: data.consent_given,
    status: data.status,
    admin_notes: data.admin_notes,
    reviewed_by: data.reviewed_by,
    reviewed_at: data.reviewed_at
  }
}

export async function getRegistrations(options?: {
  status?: string
  search?: string
  limit?: number
  offset?: number
  dateRange?: DateRange
}): Promise<{ data: Registration[]; count: number }> {
  let query = supabase
    .from('registrations')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })

  if (options?.status && options.status !== 'all') {
    query = query.eq('status', options.status)
  }

  if (options?.search) {
    query = query.or(`full_name.ilike.%${options.search}%,email.ilike.%${options.search}%,phone.ilike.%${options.search}%`)
  }

  if (options?.dateRange) {
    query = query.gte('created_at', options.dateRange.start).lte('created_at', options.dateRange.end)
  }

  if (options?.limit) {
    query = query.limit(options.limit)
  }

  if (options?.offset) {
    query = query.range(options.offset, options.offset + (options.limit || 10) - 1)
  }

  const { data, error, count } = await query

  if (error) throw error

  return {
    data: (data || []).map(mapRegistration),
    count: count || 0
  }
}

export async function getRegistrationStats(): Promise<RegistrationStats> {
  const { data, error } = await supabase
    .from('registrations')
    .select('status')

  if (error) throw error

  const stats: RegistrationStats = {
    total: data.length,
    new: 0,
    contacted: 0,
    interested: 0,
    confirmed: 0,
    waitlisted: 0,
    archived: 0
  }

  data.forEach(reg => {
    if (reg.status in stats) {
      stats[reg.status as keyof RegistrationStats]++
    }
  })

  return stats
}

export async function getGamePreferenceStats(): Promise<GamePreferenceStats[]> {
  const { data, error } = await supabase
    .from('registrations')
    .select('games_of_interest')

  if (error) throw error

  const gameCounts: Record<string, number> = {}
  let totalRegistrations = data.length

  data.forEach(reg => {
    (reg.games_of_interest || []).forEach(game => {
      gameCounts[game] = (gameCounts[game] || 0) + 1
    })
  })

  return Object.entries(gameCounts)
    .map(([game, count]) => ({
      game,
      count,
      percentage: totalRegistrations > 0 ? Math.round((count / totalRegistrations) * 100) : 0
    }))
    .sort((a, b) => b.count - a.count)
}

export async function getVisitTypeStats(): Promise<VisitTypeStats[]> {
  const { data, error } = await supabase
    .from('registrations')
    .select('visit_type')

  if (error) throw error

  const typeCounts: Record<string, number> = {}
  let total = data.length

  data.forEach(reg => {
    typeCounts[reg.visit_type] = (typeCounts[reg.visit_type] || 0) + 1
  })

  return Object.entries(typeCounts)
    .map(([type, count]) => ({
      type,
      count,
      percentage: total > 0 ? Math.round((count / total) * 100) : 0
    }))
    .sort((a, b) => b.count - a.count)
}

export async function updateRegistrationStatus(id: string, status: Registration['status'], adminNotes?: string): Promise<Registration> {
  const updates: any = { status, updated_at: new Date().toISOString() }
  if (adminNotes !== undefined) updates.admin_notes = adminNotes

  const { data, error } = await supabase
    .from('registrations')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return mapRegistration(data)
}

export async function updateRegistrationNotes(id: string, notes: string): Promise<Registration> {
  const { data, error } = await supabase
    .from('registrations')
    .update({ admin_notes: notes, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return mapRegistration(data)
}

export async function deleteRegistration(id: string): Promise<void> {
  const { error } = await supabase
    .from('registrations')
    .delete()
    .eq('id', id)

  if (error) throw error
}

export async function exportRegistrationsCsv(filters?: { status?: string; dateRange?: DateRange }): Promise<string> {
  let query = supabase
    .from('registrations')
    .select('*')
    .order('created_at', { ascending: false })

  if (filters?.status && filters.status !== 'all') {
    query = query.eq('status', filters.status)
  }

  if (filters?.dateRange) {
    query = query.gte('created_at', filters.dateRange.start).lte('created_at', filters.dateRange.end)
  }

  const { data, error } = await query

  if (error) throw error

  const headers = [
    'ID', 'Date', 'Name', 'Email', 'Phone', 'Age Group',
    'Games', 'Visit Type', 'Party Size', 'Status', 'Notes', 'Consent'
  ]

  const rows = (data || []).map(reg => [
    reg.id,
    new Date(reg.created_at).toLocaleString(),
    reg.full_name,
    reg.email,
    reg.phone || '',
    reg.age_group || '',
    (reg.games_of_interest || []).join('; '),
    reg.visit_type,
    reg.party_size,
    reg.status,
    reg.notes || '',
    reg.consent_given ? 'Yes' : 'No'
  ])

  return [headers, ...rows].map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n')
}