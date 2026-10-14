import { useState, useEffect, useMemo } from 'react'
import { 
  getRegistrations, 
  updateRegistrationStatus, 
  updateRegistrationNotes,
  deleteRegistration,
  exportRegistrationsCsv 
} from '../lib/api'
import { formatDateTime, formatRelativeTime, STATUS_LABELS, STATUS_BADGE_CLASSES, VISIT_TYPE_LABELS, PARTY_SIZE_LABELS, cn, getDateRangePreset, downloadCsv } from '../lib/utils'
import { useToast } from '../context/ToastContext'

export default function Registrations() {
  const { showToast } = useToast()
  const [registrations, setRegistrations] = useState([])
  const [loading, setLoading] = useState(true)
  const [totalCount, setTotalCount] = useState(0)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [gameFilter, setGameFilter] = useState('all')
  const [visitTypeFilter, setVisitTypeFilter] = useState('all')
  const [dateRange, setDateRange] = useState('Last 30 days')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [selectedIds, setSelectedIds] = useState([])
  const [batchActionOpen, setBatchActionOpen] = useState(false)
  const [detailOpen, setDetailOpen] = useState(null)
  const [deletingId, setDeletingId] = useState(null)

  const statuses = ['all', 'new', 'contacted', 'interested', 'confirmed', 'waitlisted', 'archived']
  const gameTypes = ['all', 'Chess', 'Billiards', 'Board Games', 'Carrom', 'Table Tennis', 'Other']
  const visitTypes = ['all', 'casual', 'friends', 'tournaments']

  useEffect(() => {
    loadData()
  }, [statusFilter, gameFilter, visitTypeFilter, dateRange, currentPage, pageSize])

  const loadData = async () => {
    setLoading(true)
    try {
      const dateRangeObj = getDateRangePreset(dateRange)
      const result = await getRegistrations({
        status: statusFilter,
        limit: pageSize,
        offset: (currentPage - 1) * pageSize,
        dateRange: dateRangeObj
      })
      setRegistrations(result.data)
      setTotalCount(result.count)
    } catch (error) {
      console.error('Failed to load registrations:', error)
      showToast('Failed to load registrations', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (id, status) => {
    try {
      await updateRegistrationStatus(id, status)
      setRegistrations(prev => prev.map(r => r.id === id ? { ...r, status } : r))
      showToast(`Status updated to ${STATUS_LABELS[status]}`, 'success')
    } catch (error) {
      showToast('Failed to update status', 'error')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this registration?')) return
    setDeletingId(id)
    try {
      await deleteRegistration(id)
      setRegistrations(prev => prev.filter(r => r.id !== id))
      setTotalCount(prev => prev - 1)
      showToast('Registration deleted', 'success')
    } catch (error) {
      showToast('Failed to delete', 'error')
    } finally {
      setDeletingId(null)
    }
  }

  const handleExport = async () => {
    try {
      const csv = await exportRegistrationsCsv({ status: statusFilter !== 'all' ? statusFilter : undefined })
      downloadCsv(csv, `registrations-${new Date().toISOString().split('T')[0]}.csv`)
      showToast('Exporting registrations to CSV...', 'success')
    } catch (error) {
      showToast('Failed to export', 'error')
    }
  }

  const toggleSelect = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  const toggleSelectAll = () => {
    if (selectedIds.length === registrations.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(registrations.map(r => r.id))
    }
  }

  const filteredRegistrations = useMemo(() => {
    let result = registrations
    if (search) {
      const s = search.toLowerCase()
      result = result.filter(r => 
        r.full_name.toLowerCase().includes(s) ||
        r.email.toLowerCase().includes(s) ||
        (r.phone || '').includes(s) ||
        r.games_of_interest.some(g => g.toLowerCase().includes(s))
      )
    }
    if (gameFilter !== 'all') {
      result = result.filter(r => r.games_of_interest.includes(gameFilter))
    }
    if (visitTypeFilter !== 'all') {
      result = result.filter(r => r.visit_type === visitTypeFilter)
    }
    return result
  }, [registrations, search, gameFilter, visitTypeFilter])

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-primary">
            <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>bookmark_manager</span>
            <span className="font-label-sm text-label-sm uppercase tracking-wider">Admissions & Roster Division</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface">Registrations</h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Review, organize, and manage people interested in Pockets & Pawns.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 bg-surface-container-high px-3 py-1.5 rounded-full font-label-md text-label-md text-on-surface-variant">
            <span className="w-2 h-2 rounded-full bg-secondary"></span>
            Showing {filteredRegistrations.length} of {totalCount} records
          </span>
        </div>
      </div>

      <div className="card p-4">
        <div className="flex flex-col lg:flex-row gap-4 lg:items-center justify-between">
          <div className="flex-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <div className="relative flex-1 min-w-[260px]">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg pointer-events-none">search</span>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-surface-container-low pl-10 pr-9 py-2 rounded-lg font-body-sm text-body-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all placeholder:text-on-surface-variant/70"
                placeholder="Search applicant name, email, phone, or game..."
                type="text"
              />
              {search && (
                <button 
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface p-1 rounded"
                  title="Clear search"
                  type="button"
                >
                  <span className="material-symbols-outlined text-base leading-none">close</span>
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-1">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none bg-surface-container-low hover:bg-surface-container text-on-surface font-label-md text-label-md px-3 pr-8 py-2 rounded-lg cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="all">All Statuses</option>
                <option value="new">New (8)</option>
                <option value="contacted">Contacted (12)</option>
                <option value="interested">Interested (7)</option>
                <option value="confirmed">Confirmed (9)</option>
                <option value="waitlisted">Waitlisted (2)</option>
              </select>
              
              <select
                value={gameFilter}
                onChange={(e) => setGameFilter(e.target.value)}
                className="appearance-none bg-surface-container-low hover:bg-surface-container text-on-surface font-label-md text-label-md px-3 pr-8 py-2 rounded-lg cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="all">All Games</option>
                <option value="Chess">Chess</option>
                <option value="Carrom">Carrom</option>
                <option value="Billiards">Pool</option>
                <option value="Board Games">Board Games</option>
                <option value="Table Tennis">Table Tennis</option>
              </select>

              <select
                value={visitTypeFilter}
                onChange={(e) => setVisitTypeFilter(e.target.value)}
                className="appearance-none bg-surface-container-low hover:bg-surface-container text-on-surface font-label-md text-label-md px-3 pr-8 py-2 rounded-lg cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="all">All Types</option>
                <option value="casual">Casual Play</option>
                <option value="tournaments">Competitive / League</option>
                <option value="friends">Weekend Social</option>
              </select>

              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="appearance-none bg-surface-container-low hover:bg-surface-container text-on-surface font-label-md text-label-md px-3 pr-8 py-2 rounded-lg cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="Last 7 days">Last 7 days</option>
                <option value="Last 30 days">Last 30 days</option>
                <option value="Last 90 days">Last 90 days</option>
              </select>

              <button className="flex items-center gap-1 text-on-surface-variant hover:text-error px-2 py-2 rounded font-label-sm text-label-sm transition-colors" onClick={() => { setSearch(''); setStatusFilter('all'); setGameFilter('all'); setVisitTypeFilter('all'); }}>
                <span className="material-symbols-outlined text-base">filter_alt_off</span>
                <span>Clear Filters</span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={handleExport} className="inline-flex items-center gap-2 bg-secondary-container hover:bg-secondary-fixed-dim text-on-secondary-fixed-variant px-4 py-2 rounded-lg font-label-lg text-label-lg shadow-sm transition-colors">
              <span className="material-symbols-outlined text-base">download</span>
              <span>Export Filtered CSV</span>
            </button>
            <button className="inline-flex items-center gap-2 bg-secondary hover:bg-on-secondary-fixed text-on-secondary px-4 py-2 rounded-lg font-label-lg text-label-lg shadow-sm transition-all hover:shadow">
              <span className="material-symbols-outlined text-base">person_add</span>
              <span>+ Add Registration</span>
            </button>
          </div>
        </div>
      </div>

      {selectedIds.length > 0 && (
        <div className="flex items-center justify-between bg-inverse-surface text-inverse-on-surface px-6 py-3 rounded-xl mb-4 shadow-md animate-slide-in">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded bg-primary-container text-on-primary-container flex items-center justify-center font-label-sm text-label-sm font-bold">{selectedIds.length}</span>
              <span className="font-label-md text-label-md font-semibold">records selected</span>
            </div>
            <span className="text-on-surface-variant/40">|</span>
            <span className="font-body-sm text-body-sm text-inverse-on-surface/80 hidden sm:inline">Bulk roster adjustments & communications</span>
          </div>
          <div className="flex items-center gap-1">
            <button className="flex items-center gap-1.5 bg-inverse-surface hover:bg-surface-container-highest/20 text-inverse-on-surface px-3 py-1.5 rounded-lg font-label-sm text-label-sm transition-colors">
              <span className="material-symbols-outlined text-base">edit_note</span>
              <span>Update Status</span>
            </button>
            <button className="flex items-center gap-1.5 bg-inverse-surface hover:bg-surface-container-highest/20 text-inverse-on-surface px-3 py-1.5 rounded-lg font-label-sm text-label-sm transition-colors">
              <span className="material-symbols-outlined text-base">file_download</span>
              <span>Export Selected (CSV)</span>
            </button>
            <button className="flex items-center gap-1.5 bg-error/20 hover:bg-error text-white px-3 py-1.5 rounded-lg font-label-sm text-label-sm transition-colors" onClick={() => { if(confirm('Confirm deletion?')) alert('Delete action'); }}>
              <span className="material-symbols-outlined text-base">delete</span>
              <span>Delete Selected</span>
            </button>
            <button className="ml-1 text-inverse-on-surface/60 hover:text-inverse-on-surface p-1" onClick={() => setSelectedIds([])} title="Dismiss selection">
              <span className="material-symbols-outlined text-base">close</span>
            </button>
          </div>
        </div>
      )}

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="table-header">
                <th className="py-3 px-4 w-10">
                  <input type="checkbox" checked={selectedIds.length === registrations.length && registrations.length > 0} onChange={toggleSelectAll} className="rounded text-secondary focus:ring-0 cursor-pointer w-4 h-4" />
                </th>
                <th className="py-3 px-4">Applicant</th>
                <th className="py-3 px-3">Contact</th>
                <th className="py-3 px-3">Games of Interest</th>
                <th className="py-3 px-3">Visit Type</th>
                <th className="py-3 px-3">Group</th>
                <th className="py-3 px-3">Registered</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-high text-on-surface">
              {filteredRegistrations.map((reg) => (
                <tr key={reg.id} className={cn('table-row', selectedIds.includes(reg.id) && 'bg-primary-container/20')}>
                  <td className="py-3 px-4">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(reg.id)}
                      onChange={() => toggleSelect(reg.id)}
                      className="rounded text-secondary focus:ring-0 cursor-pointer w-4 h-4"
                    />
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-secondary text-on-secondary font-label-md flex items-center justify-center font-bold">
                        {reg.full_name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-label-lg text-label-lg font-semibold truncate text-on-surface">{reg.full_name}</span>
                        <span className="font-label-sm text-label-sm bg-surface-container px-1.5 rounded w-fit text-on-surface-variant font-medium">{AGE_GROUP_LABELS[reg.age_group] || reg.age_group}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex flex-col font-body-sm text-body-sm">
                      <button className="inline-flex items-center gap-1 text-on-surface hover:text-primary transition-colors text-left" onClick={() => navigator.clipboard.writeText(reg.email)} title="Copy email">
                        <span className="truncate max-w-[130px]">{reg.email}</span>
                        <span className="material-symbols-outlined text-xs text-on-surface-variant">content_copy</span>
                      </button>
                      {reg.phone && <span className="font-tabular-mono text-tabular-mono text-on-surface-variant text-xs">{reg.phone}</span>}
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex flex-wrap items-center gap-1">
                      {reg.games_of_interest.map(game => (
                        <span key={game} className="bg-surface-container-high px-2 py-0.5 rounded font-label-sm text-label-sm text-on-surface font-semibold">{game}</span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-label-sm text-label-sm px-2 py-1 rounded bg-surface-container text-on-surface font-medium whitespace-nowrap">{VISIT_TYPE_LABELS[reg.visit_type] || reg.visit_type}</span>
                  </td>
                  <td className="py-3 px-3 font-body-sm text-body-sm text-on-surface whitespace-nowrap">
                    {PARTY_SIZE_LABELS[reg.party_size] || reg.party_size}
                  </td>
                  <td className="py-3 px-3 font-tabular-mono text-tabular-mono text-on-surface-variant text-xs whitespace-nowrap">
                    {formatDateTime(reg.created_at)}
                  </td>
                  <td className="py-3 px-3">
                    <span className={cn('inline-flex items-center gap-1.5 px-2 py-1 rounded-full font-label-sm text-label-sm font-bold uppercase', STATUS_BADGE_CLASSES[reg.status] || 'badge-outline')}>
                      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                      {STATUS_LABELS[reg.status] || reg.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="relative inline-block text-left">
                      <button className="p-1 text-on-surface-variant hover:text-on-surface rounded-lg hover:bg-surface-container" type="button">
                        <span className="material-symbols-outlined text-lg">more_vert</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-3 bg-surface-container-low text-on-surface-variant font-label-md text-label-md gap-2">
          <div className="flex items-center gap-2">
            <span>Rows per page:</span>
            <select value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))} className="bg-surface-container-lowest px-2 py-1 rounded font-label-sm text-label-sm focus:outline-none text-on-surface">
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </select>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-tabular-mono text-tabular-mono">Page {currentPage} of {Math.ceil(totalCount / pageSize)}</span>
            <div className="flex items-center gap-1">
              <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="p-1 rounded bg-surface-container-high text-on-surface hover:bg-surface-container disabled:opacity-50 disabled:cursor-not-allowed">
                <span className="material-symbols-outlined text-base">chevron_left</span>
              </button>
              <button disabled={currentPage >= Math.ceil(totalCount / pageSize)} onClick={() => setCurrentPage(p => p + 1)} className="p-1 rounded bg-surface-container-high text-on-surface hover:bg-surface-container disabled:opacity-50 disabled:cursor-not-allowed">
                <span className="material-symbols-outlined text-base">chevron_right</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function handleExport() {
  const csv = exportRegistrationsCsv()
  downloadCsv(csv, `registrations-${new Date().toISOString().split('T')[0]}.csv`)
  showToast('Exporting registrations to CSV...', 'success')
}

function toggleSelect(id) {
  setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
}

function toggleSelectAll() {
  if (selectedIds.length === registrations.length) {
    setSelectedIds([])
  } else {
    setSelectedIds(registrations.map(r => r.id))
  }
}