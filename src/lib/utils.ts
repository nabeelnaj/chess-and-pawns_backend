import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date): string {
  const d = new Date(date)
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
}

export function formatDateTime(date: string | Date): string {
  const d = new Date(date)
  return d.toLocaleString('en-US', { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export function formatRelativeTime(date: string | Date): string {
  const d = new Date(date)
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return formatDate(d)
}

export const STATUS_LABELS: Record<string, string> = {
  new: 'New',
  contacted: 'Contacted',
  interested: 'Interested',
  confirmed: 'Confirmed',
  waitlisted: 'Waitlisted',
  archived: 'Archived'
}

export const STATUS_BADGE_CLASSES: Record<string, string> = {
  new: 'badge-new',
  contacted: 'badge-contacted',
  interested: 'badge-interested',
  confirmed: 'badge-confirmed',
  waitlisted: 'badge-waitlisted',
  archived: 'badge badge-outline'
}

export const VISIT_TYPE_LABELS: Record<string, string> = {
  casual: 'Casual Walk-in',
  friends: 'Friends & Family',
  tournaments: 'Tournaments'
}

export const PARTY_SIZE_LABELS: Record<string, string> = {
  solo: 'Solo',
  pair: '2 People',
  small: '3-4 People',
  large: '5+ People'
}

export const AGE_GROUP_LABELS: Record<string, string> = {
  '18-24': '18–24',
  '25-34': '25–34',
  '35+': '35+',
  '13-17': '13–17',
  'under-13': 'Under 13',
  'prefer-not': 'Prefer not to say'
}

export function getDateRangePreset(preset: string): { start: string; end: string } {
  const now = new Date()
  const end = now.toISOString().split('T')[0]
  let start: Date

  switch (preset) {
    case 'Last 7 days':
      start = new Date(now.getTime() - 7 * 86400000)
      break
    case 'Last 30 days':
      start = new Date(now.getTime() - 30 * 86400000)
      break
    case 'Last 90 days':
      start = new Date(now.getTime() - 90 * 86400000)
      break
    case 'All time':
      start = new Date('2020-01-01')
      break
    default:
      start = new Date(now.getTime() - 30 * 86400000)
  }

  return {
    start: start.toISOString().split('T')[0],
    end
  }
}

export function generateCsv(data: any[], headers: string[]): string {
  const rows = data.map(item => 
    headers.map(header => {
      const value = item[header.toLowerCase().replace(/\s+/g, '_')]
      return `"${String(value ?? '').replace(/"/g, '""')}"`
    }).join(',')
  )
  return [headers.map(h => `"${h}"`).join(','), ...rows].join('\n')
}

export function downloadCsv(csv: string, filename: string) {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = filename
  link.click()
  URL.revokeObjectURL(link.href)
}