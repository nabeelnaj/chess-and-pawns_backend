import { useState, useEffect } from 'react'
import { 
  getRegistrations, 
  getRegistrationStats, 
  getGamePreferenceStats, 
  getVisitTypeStats,
  exportRegistrationsCsv 
} from '../lib/api'
import { formatDateTime, formatRelativeTime, STATUS_LABELS, STATUS_BADGE_CLASSES, cn, getDateRangePreset, downloadCsv } from '../lib/utils'
import { useToast } from '../context/ToastContext'

export default function Dashboard() {
  const { showToast } = useToast()
  const [stats, setStats] = useState(null)
  const [gameStats, setGameStats] = useState([])
  const [visitStats, setVisitStats] = useState([])
  const [recentRegistrations, setRecentRegistrations] = useState([])
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState('Last 30 days')

  useEffect(() => {
    loadData()
  }, [dateRange])

  const loadData = async () => {
    setLoading(true)
    try {
      const [statsData, gameStatsData, visitStatsData, recentData] = await Promise.all([
        getRegistrationStats(),
        getGamePreferenceStats(),
        getVisitTypeStats(),
        getRegistrations({ limit: 5 })
      ])
      setStats(statsData)
      setGameStats(gameStatsData)
      setVisitStats(visitStatsData)
      setRecentRegistrations(recentData.data)
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
      showToast('Failed to load dashboard data', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleDateRangeChange = (range) => {
    setDateRange(range)
  }

  const handleExport = async () => {
    try {
      const csv = await exportRegistrationsCsv()
      downloadCsv(csv, `registrations-${new Date().toISOString().split('T')[0]}.csv`)
      showToast('Exporting registrations to CSV...', 'success')
    } catch (error) {
      showToast('Failed to export', 'error')
    }
  }

  const handleReviewNew = () => {
    showToast('Filtering view: unreviewed intake items highlighted.', 'success')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-primary">
            <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>analytics</span>
            <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary">Salon Intelligence & Operations</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface">Dashboard Overview</h1>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
            Monitor pre-registrations and understand interest in Pockets & Pawns.
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative inline-block text-left">
            <button
              onClick={() => setDateRange(dateRange)}
              className="flex items-center gap-2 bg-surface-container px-4 py-2 rounded-lg text-on-surface font-label-md text-label-md hover:bg-surface-container-high transition-colors shadow-sm"
              type="button"
            >
              <span className="material-symbols-outlined text-base text-primary">calendar_today</span>
              <span>{dateRange}</span>
              <span className="material-symbols-outlined text-base text-on-surface-variant">expand_more</span>
            </button>
          </div>
          
          <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors font-label-md text-label-md shadow-sm">
            <span className="material-symbols-outlined text-base">download</span>
            <span>Export Registrations</span>
          </button>
          
          <button onClick={handleReviewNew} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-on-primary hover:opacity-90 transition-opacity font-label-md text-label-md shadow-sm">
            <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>mark_email_unread</span>
            <span>Review New (8)</span>
          </button>
          
          <a className="flex items-center gap-2 px-3 py-2 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors font-label-md text-label-md" href="#" title="Open live public landing">
            <span className="material-symbols-outlined text-lg">open_in_new</span>
          </a>
        </div>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        <KPICard
          title="Total Registrations"
          value={stats?.total || 0}
          icon="person_add"
          iconBg="bg-secondary-container"
          iconColor="text-secondary"
          trend={{ value: '+14%', label: 'vs prev period', positive: true }}
        />
        <KPICard
          title="New"
          value={stats?.new || 0}
          icon="error_outline"
          iconBg="bg-primary-fixed"
          iconColor="text-on-primary-fixed-variant"
          subtitle="Unreviewed triage records"
        />
        <KPICard
          title="Pending Review"
          value={6}
          icon="schedule"
          iconBg="bg-surface-container-high"
          iconColor="text-tertiary"
          subtitle="Awaiting concierge contact"
        />
        <KPICard
          title="Contacted"
          value={stats?.contacted || 0}
          icon="outgoing_mail"
          iconBg="bg-surface-container-highest"
          iconColor="text-on-surface-variant"
          subtitle="Outreach initiated"
        />
        <KPICard
          title="Confirmed Interest"
          value={stats?.confirmed || 0}
          icon="check_circle"
          iconBg="bg-secondary-container"
          iconColor="text-secondary"
          subtitle="Strong intent verified"
          valueColor="text-secondary"
        />
        <KPICard
          title="Top Discipline"
          value="Chess & Carrom"
          icon="workspace_premium"
          iconBg="bg-primary-fixed"
          iconColor="text-primary"
          subtitle="72% of all applicants"
          isTextValue
        />
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        <div className="lg:col-span-7 xl:col-span-8 card p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
            <div>
              <h2 className="font-headline-sm text-headline-sm text-on-surface">Registration Trends Over Time</h2>
              <p className="font-body-sm text-body-sm text-on-surface-variant">Cumulative and daily cadence of patron waitlist admissions</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-secondary"></span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">Cumulative Total</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-3 h-3 rounded bg-primary-container"></span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">Daily Signups</span>
              </div>
            </div>
          </div>
          <RegistrationTrendsChart />
          <div className="flex items-center justify-between pt-4 border-t border-surface-container mt-4">
            <div className="flex items-center gap-2 font-body-sm text-body-sm text-on-surface-variant">
              <span className="material-symbols-outlined text-primary text-base">lightbulb</span>
              <span>Weekend cohorts submit with <strong>3.2\u00d7</strong> higher booking urgency than mid-week visitors.</span>
            </div>
            <span className="font-tabular-mono text-label-sm text-on-surface font-semibold">92% weekend capacity projected</span>
          </div>
        </div>

        <div className="lg:col-span-5 xl:col-span-4 card p-6">
          <div className="mb-6">
            <h2 className="font-headline-sm text-headline-sm text-on-surface">Registration Status Breakdown</h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant">Pipeline balance across {stats?.total || 38} admissions</p>
          </div>
          <StatusDonutChart stats={stats} />
        </div>
      </section>

      <section className="card p-6 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <h2 className="font-headline-sm text-headline-sm text-on-surface">Popular Games Preference Distribution</h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant">Applicant affinity metrics for station reservation and equipment inventory</p>
          </div>
          <span className="font-label-sm text-label-sm text-primary uppercase font-bold tracking-wider bg-primary-container/20 px-3 py-1 rounded">
            Calculated from {stats?.total || 38} forms
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {gameStats.slice(0, 6).map((game, index) => (
            <GameStatBar key={game.game} game={game} index={index} />
          ))}
        </div>
      </section>

      <section className="card overflow-hidden">
        <div className="p-4 sm:flex sm:items-center sm:justify-between gap-2 bg-surface-container-lowest">
          <div className="flex flex-col">
            <h2 className="font-headline-sm text-headline-sm text-on-surface">Recent Registrations</h2>
            <span className="font-body-sm text-body-sm text-on-surface-variant">Five most recently received intake dossiers</span>
          </div>
          <a className="inline-flex items-center gap-2 text-primary font-label-md text-label-md font-semibold hover:underline" href="/registrations">
            <span>View All {stats?.total || 38} Registrations</span>
            <span className="material-symbols-outlined text-base">arrow_forward</span>
          </a>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="table-header">
                <th className="py-3 px-4">Applicant</th>
                <th className="py-3 px-3">Selected Games</th>
                <th className="py-3 px-3">Date Received</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container font-body-sm text-body-sm text-on-surface">
              {recentRegistrations.map((reg, index) => (
                <tr key={reg.id} className="table-row">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-secondary text-on-secondary font-label-md flex items-center justify-center font-bold">
                        {reg.full_name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-label-lg text-label-lg font-semibold truncate text-on-surface">{reg.full_name}</span>
                        <span className="font-body-sm text-body-sm text-on-surface-variant truncate">{reg.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex flex-wrap gap-1">
                      {reg.games_of_interest.map(game => (
                        <span key={game} className="bg-surface-container-high px-2 py-0.5 rounded font-label-sm text-label-sm text-on-surface font-semibold">{game}</span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-3 text-on-surface-variant font-tabular-mono text-label-md">
                    {formatRelativeTime(reg.created_at)}
                  </td>
                  <td className="py-3 px-3">
                    <span className={cn('inline-flex items-center gap-1.5 px-2 py-1 rounded-full font-label-sm text-label-sm font-bold uppercase', STATUS_BADGE_CLASSES[reg.status] || 'badge-outline')}>
                      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                      {STATUS_LABELS[reg.status] || reg.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded-lg transition-colors" title="View Dossier">
                        <span className="material-symbols-outlined text-lg">visibility</span>
                      </button>
                      <button className="px-3 py-1.5 rounded bg-surface-container hover:bg-surface-container-high text-on-surface font-label-sm text-label-sm transition-colors">
                        {reg.status === 'confirmed' ? 'Assign Table' : reg.status === 'new' ? 'Contact' : 'Follow Up'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 bg-surface-container-low flex items-center justify-between">
          <span className="font-body-sm text-body-sm text-on-surface-variant">Showing latest 5 of {stats?.total || 38} applicant records</span>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors font-label-md text-label-md font-semibold">
            <span>Load Full Roster</span>
            <span className="material-symbols-outlined text-base">east</span>
          </button>
        </div>
      </section>
    </div>
  )
}

function KPICard({ title, value, icon, iconBg, iconColor, trend, subtitle, valueColor, isTextValue }) {
  return (
    <div className="card p-6 hover:shadow-md transition-shadow flex flex-col justify-between">
      <div className="flex items-start justify-between">
        <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">{title}</span>
        <div className={`w-8 h-8 rounded-full ${iconBg} flex items-center justify-center ${iconColor}`}>
          <span className="material-symbols-outlined text-base">{icon}</span>
        </div>
      </div>
      <div className="mt-4 flex flex-col">
        <span className={cn('font-headline-lg text-headline-lg text-on-surface tabular-nums', isTextValue && 'font-headline-sm text-headline-sm', valueColor)}>
          {value}
        </span>
        {trend && (
          <div className="flex items-center gap-1 text-secondary mt-1 font-label-sm text-label-sm">
            <span className="material-symbols-outlined text-sm">trending_up</span>
            <span className="font-bold">{trend.value}</span>
            <span className="text-on-surface-variant font-normal">{trend.label}</span>
          </div>
        )}
        {subtitle && (
          <span className="text-on-surface-variant font-body-sm text-body-sm mt-1 line-clamp-1">{subtitle}</span>
        )}
      </div>
    </div>
  )
}

function RegistrationTrendsChart() {
  return (
    <div className="relative w-full h-64 mt-2 flex flex-col justify-end">
      <svg className="w-full h-56 overflow-visible" preserveAspectRatio="none" viewBox="0 0 700 200">
        <defs>
          <linearGradient id="areaGradient" x1="0%" x2="0%" y1="0%" y2="100%">
            <stop offset="0%" stopColor="#3d665a" stopOpacity="0.32" />
            <stop offset="100%" stopColor="#3d665a" stopOpacity="0.0" />
          </linearGradient>
          <linearGradient id="lineStroke" x1="0%" x2="100%" y1="0%" y2="0%">
            <stop offset="0%" stopColor="#775a1a" />
            <stop offset="100%" stopColor="#3d665a" />
          </linearGradient>
        </defs>
        <line className="text-surface-container-high" stroke="currentColor" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="700" y1="10" y2="10" />
        <line className="text-surface-container-high" stroke="currentColor" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="700" y1="70" y2="70" />
        <line className="text-surface-container-high" stroke="currentColor" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="700" y1="130" y2="130" />
        <line className="text-surface-container-highest" stroke="currentColor" strokeWidth="1.5" x1="0" x2="700" y1="190" y2="190" />
        <rect className="text-primary-container" fill="currentColor" height="25" rx="2" width="14" x="45" y="170" />
        <rect className="text-primary-container" fill="currentColor" height="15" rx="2" width="14" x="75" y="180" />
        <rect className="text-primary-container" fill="currentColor" height="35" rx="2" width="14" x="105" y="160" />
        <rect className="text-primary-container" fill="currentColor" height="45" rx="2" width="14" x="135" y="150" />
        <rect className="text-primary-container" fill="currentColor" height="65" rx="2" width="14" x="165" y="130" />
        <rect className="text-primary" fill="currentColor" height="90" rx="2" width="14" x="195" y="105" />
        <rect className="text-primary" fill="currentColor" height="80" rx="2" width="14" x="225" y="115" />
        <rect className="text-primary-container" fill="currentColor" height="30" rx="2" width="14" x="285" y="165" />
        <rect className="text-primary-container" fill="currentColor" height="25" rx="2" width="14" x="315" y="170" />
        <rect className="text-primary-container" fill="currentColor" height="45" rx="2" width="14" x="345" y="150" />
        <rect className="text-primary-container" fill="currentColor" height="55" rx="2" width="14" x="375" y="140" />
        <rect className="text-primary-container" fill="currentColor" height="70" rx="2" width="14" x="405" y="125" />
        <rect className="text-primary" fill="currentColor" height="110" rx="2" width="14" x="435" y="85" />
        <rect className="text-primary" fill="currentColor" height="100" rx="2" width="14" x="465" y="95" />
        <rect className="text-primary-container" fill="currentColor" height="35" rx="2" width="14" x="525" y="160" />
        <rect className="text-primary-container" fill="currentColor" height="40" rx="2" width="14" x="555" y="155" />
        <rect className="text-primary-container" fill="currentColor" height="50" rx="2" width="14" x="585" y="145" />
        <rect className="text-primary-container" fill="currentColor" height="65" rx="2" width="14" x="615" y="130" />
        <rect className="text-primary-container" fill="currentColor" height="85" rx="2" width="14" x="645" y="110" />
        <rect className="text-primary" fill="currentColor" height="130" rx="2" width="14" x="675" y="65" />
        <rect className="text-primary" fill="currentColor" height="115" rx="2" width="14" x="705" y="80" />
        <path d="M52 188 C 115 178, 175 160, 232 142 C 320 120, 390 98, 472 75 C 570 50, 650 32, 712 24 L 712 195 L 52 195 Z" fill="url(#areaGradient)" />
        <path className="text-secondary" d="M52 188 C 115 178, 175 160, 232 142 C 320 120, 390 98, 472 75 C 570 50, 650 32, 712 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.5" />
        <circle className="fill-surface-container-lowest stroke-secondary" cx="350" cy="90" r="4" strokeWidth="2.5" />
        <circle className="fill-surface-container-lowest stroke-primary" cx="420" cy="50" r="5" strokeWidth="3" />
        <circle className="fill-surface-container-lowest stroke-secondary" cx="560" cy="40" r="4" strokeWidth="2.5" />
        <circle cx="712" cy="24" fill="#3d665a" r="5" stroke="#ffffff" strokeWidth="2" />
        <rect className="text-secondary" fill="currentColor" height="20" rx="4" width="58" x="668" y="0" />
        <text className="fill-on-secondary font-tabular-mono text-label-sm text-center font-bold" textAnchor="middle" x="697" y="14">38 Total</text>
      </svg>
      <div className="flex justify-between text-on-surface-variant font-tabular-mono text-label-sm pt-2">
        <span>Week 1</span>
        <span>Week 2</span>
        <span>Week 3</span>
        <span>Current</span>
      </div>
    </div>
  )
}

function StatusDonutChart({ stats }) {
  const total = stats?.total || 38
  const contacted = stats?.contacted || 12
  const confirmed = stats?.confirmed || 9
  const newCount = stats?.new || 8
  const interested = stats?.interested || 7
  const waitlisted = stats?.waitlisted || 2

  const circumference = 2 * Math.PI * 38
  const contactedDash = (contacted / total) * circumference
  const confirmedDash = (confirmed / total) * circumference
  const newDash = (newCount / total) * circumference
  const interestedDash = (interested / total) * circumference
  const waitlistedDash = (waitlisted / total) * circumference

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-44 h-44 flex-shrink-0">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle className="text-surface-container-low" cx="50" cy="50" fill="transparent" r="38" stroke="currentColor" strokeWidth="12" />
          <circle cx="50" cy="50" fill="transparent" r="38" stroke="#3d665a" strokeDasharray={`${contactedDash} ${circumference - contactedDash}`} strokeDashoffset="0" strokeWidth="12" strokeLinecap="butt" />
          <circle cx="50" cy="50" fill="transparent" r="38" stroke="#775a1a" strokeDasharray={`${confirmedDash} ${circumference - confirmedDash}`} strokeDashoffset={`${-contactedDash}`} strokeWidth="12" strokeLinecap="butt" />
          <circle cx="50" cy="50" fill="transparent" r="38" stroke="#c6a15b" strokeDasharray={`${newDash} ${circumference - newDash}`} strokeDashoffset={`${-(contactedDash + confirmedDash)}`} strokeWidth="12" strokeLinecap="butt" />
          <circle cx="50" cy="50" fill="transparent" r="38" stroke="#576157" strokeDasharray={`${interestedDash} ${circumference - interestedDash}`} strokeDashoffset={`${-(contactedDash + confirmedDash + newDash)}`} strokeWidth="12" strokeLinecap="butt" />
          <circle cx="50" cy="50" fill="transparent" r="38" stroke="#9fa99d" strokeDasharray={`${waitlistedDash} ${circumference - waitlistedDash}`} strokeDashoffset={`${-(contactedDash + confirmedDash + newDash + interestedDash)}`} strokeWidth="12" strokeLinecap="butt" />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="font-headline-lg text-headline-lg text-on-surface">{total}</span>
          <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">Records</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-y-1 gap-x-4 pt-2">
        <StatLegend color="#3d665a" label="Contacted" count={contacted} percentage={Math.round((contacted/total)*100)} />
        <StatLegend color="#775a1a" label="Confirmed" count={confirmed} percentage={Math.round((confirmed/total)*100)} />
        <StatLegend color="#c6a15b" label="New Triage" count={newCount} percentage={Math.round((newCount/total)*100)} />
        <StatLegend color="#576157" label="Interested" count={interested} percentage={Math.round((interested/total)*100)} />
        <StatLegend color="#9fa99d" label="Waitlisted" count={waitlisted} percentage={Math.round((waitlisted/total)*100)} colSpan={2} />
      </div>
    </div>
  )
}

function StatLegend({ color, label, count, percentage, colSpan = 1 }) {
  return (
    <div className={cn('flex items-center justify-between text-label-md font-label-md', colSpan === 2 && 'col-span-2')}>
      <div className="flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }}></span>
        <span className="text-on-surface">{label}</span>
      </div>
      <span className="text-on-surface-variant font-tabular-mono font-medium">{count} ({percentage}%)</span>
    </div>
  )
}

function GameStatBar({ game, index }) {
  const colors = ['bg-primary', 'bg-secondary', 'bg-primary-container', 'bg-tertiary', 'bg-secondary-fixed-dim', 'bg-tertiary-container']
  const icons = ['chess', 'circle', 'sports_cricket', 'casino', 'sports_tennis']
  const iconColors = ['text-primary', 'text-secondary', 'text-tertiary', 'text-tertiary', 'text-secondary']

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-lg" style={{ color: iconColors[index % iconColors.length] }}>{icons[index % icons.length]}</span>
          <span className="font-label-lg text-label-lg text-on-surface">{game.game}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="font-tabular-mono text-label-md text-on-surface font-semibold">{game.count} players</span>
          <span className="text-on-surface-variant font-label-sm text-label-sm">({game.percentage}%)</span>
        </div>
      </div>
      <div className="w-full bg-surface-container-high h-2.5 rounded-full overflow-hidden">
        <div className={colors[index % colors.length]} style={{ width: `${game.percentage}%` }} className="h-full rounded-full transition-all duration-500" />
      </div>
    </div>
  )
}