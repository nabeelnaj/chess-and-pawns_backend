import { useState, useEffect } from 'react'
import { getRegistrationStats, getGamePreferenceStats, getVisitTypeStats } from '../lib/api'
import { cn, getDateRangePreset } from '../lib/utils'

export default function Analytics() {
  const [stats, setStats] = useState(null)
  const [gameStats, setGameStats] = useState([])
  const [visitStats, setVisitStats] = useState([])
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState('Last 30 days')

  useEffect(() => {
    loadData()
  }, [dateRange])

  const loadData = async () => {
    setLoading(true)
    try {
      const [statsData, gameStatsData, visitStatsData] = await Promise.all([
        getRegistrationStats(),
        getGamePreferenceStats(),
        getVisitTypeStats()
      ])
      setStats(statsData)
      setGameStats(gameStatsData)
      setVisitStats(visitStatsData)
    } catch (error) {
      console.error('Failed to load analytics:', error)
    } finally {
      setLoading(false)
    }
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
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div className="flex flex-col gap-1 max-w-2xl">
          <div className="flex items-center gap-2 text-primary">
            <span className="material-symbols-outlined text-base">insights</span>
            <span className="font-label-md text-label-md uppercase tracking-wider">Executive Intelligence</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface">Registration Analytics & Demand Insights</h1>
          <p className="font-body-md text-body-md text-on-surface-variant">Deep-dive into community interest, game preferences, visitor demographics, and scheduling demand.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="bg-surface-container p-1 rounded-lg flex items-center shadow-sm">
            {['Last 7 days', 'Last 30 days', 'Last 90 days', 'All time'].map(range => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                className={`px-4 py-2 rounded-lg font-label-md text-label-md transition-all ${dateRange === range ? 'bg-surface text-on-surface font-semibold shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}
              >
                {range}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-secondary text-on-secondary rounded-lg font-label-md text-label-md hover:opacity-95 shadow-sm transition-transform active:scale-95">
            <span className="material-symbols-outlined text-base">download</span>
            <span>Export Report</span>
          </button>
        </div>
      </div>

      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <KPICard
          title="Total Registrations"
          value={stats?.total || 0}
          icon="app_registration"
          iconColor="text-primary"
          iconBg="bg-primary/10"
          trend={{ value: '+18.4%', label: 'month-over-month', positive: true }}
          subtitle="Target: 50 before launch"
          progress={76}
        />
        <KPICard
          title="Average Daily Signups"
          value="2.4"
          unit="/ day"
          icon="pace"
          iconColor="text-secondary"
          iconBg="bg-secondary/10"
          trend={{ value: 'Peak on Fridays & Saturdays', positive: true }}
          subtitle="Weekend velocity: 3.8 / day"
        />
        <KPICard
          title="Top Demand Category"
          value="Chess Tournaments"
          icon="trophy"
          iconColor="text-primary"
          iconBg="bg-primary-container/20"
          subtitle="Runner Up: Weekend Swiss Open"
          isTextValue
        />
        <KPICard
          title="Most Common Group Size"
          value="Duos & Groups (2-4)"
          icon="group"
          iconColor="text-tertiary"
          iconBg="bg-tertiary-container/30"
          subtitle="Table Layout Advice: Quad-table pairing"
          isTextValue
        />
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        <div className="lg:col-span-8 card p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
            <div>
              <h2 className="font-headline-sm text-headline-sm text-on-surface">Cumulative & Daily Pre-Registrations</h2>
              <p className="font-body-sm text-body-sm text-on-surface-variant">Dual-axis view showing incremental growth and distinct weekend volume spikes.</p>
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
          <CumulativeChart />
          <div className="flex items-center justify-between pt-4 border-t border-surface-container mt-4">
            <div className="flex items-center gap-2 font-body-sm text-body-sm text-on-surface-variant">
              <span className="material-symbols-outlined text-primary text-base">lightbulb</span>
              <span>Weekend cohorts submit with <strong>3.2\u00d7</strong> higher booking urgency than mid-week visitors.</span>
            </div>
            <span className="font-tabular-mono text-label-sm text-on-surface font-semibold">92% weekend capacity projected</span>
          </div>
        </div>

        <div className="lg:col-span-4 card p-6">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-headline-sm text-headline-sm text-on-surface">Game Preferences</h2>
              <span className="font-label-sm text-label-sm text-on-surface-variant bg-surface-container px-2 py-0.5 rounded font-semibold">Multi-Select</span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant">Head-to-head popularity across all {stats?.total || 38} member profiles.</p>
          </div>
          <div className="space-y-4">
            {gameStats.slice(0, 5).map((game, index) => (
              <GamePreferenceBar key={game.game} game={game} index={index} />
            ))}
          </div>
          <div className="mt-4 p-3 bg-surface-container-low rounded-lg flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-lg">flag</span>
            <p className="font-body-sm text-body-sm text-on-surface-variant">Carrom & Pool cross-booking occurs in <strong>42%</strong> of social applications.</p>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        <div className="lg:col-span-5 card p-6">
          <div className="mb-6">
            <h2 className="font-headline-sm text-headline-sm text-on-surface">Preferred Visit Type</h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant">How applicants envision their regular clubhouse attendance.</p>
          </div>
          <VisitTypeDonut stats={visitStats} />
          <div className="mt-4 p-3 bg-surface-container-low rounded-lg text-on-surface-variant font-body-sm text-body-sm">
            <strong>Operation Note:</strong> Keep 4-6 tables non-reservable on weekend evenings to accommodate the 42% casual walk-in demand.
          </div>
        </div>

        <div className="lg:col-span-7 card p-6">
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-headline-sm text-headline-sm text-on-surface">Applicant Demographics & Group Dynamics</h2>
                <p className="font-body-sm text-body-sm text-on-surface-variant">Party sizes and age distribution across pre-registered pool.</p>
              </div>
              <span className="material-symbols-outlined text-secondary bg-secondary-container/30 p-2 rounded-lg">diversity_3</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <GroupSizeChart />
            <AgeCohortsChart />
          </div>
          <div className="mt-4 pt-4 border-t border-surface-container flex items-center justify-between text-body-sm text-on-surface-variant">
            <span>Prime Target Audience: <strong>Young Professionals & Graduates</strong></span>
            <span className="font-label-sm text-label-sm text-secondary font-bold uppercase">Strong Match for Cafe Hybrid</span>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        <div className="lg:col-span-8 card p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
            <div>
              <h2 className="font-headline-sm text-headline-sm text-on-surface">Applicant Conversion & Onboarding Funnel</h2>
              <p className="font-body-sm text-body-sm text-on-surface-variant">Progression from initial landing page submission to opening day RSVP.</p>
            </div>
            <div className="flex items-center gap-1 text-secondary font-label-md text-label-md font-semibold bg-secondary-container/30 px-3 py-1 rounded-full">
              <span className="material-symbols-outlined text-base">verified</span>
              <span>36.8% Full Conversion</span>
            </div>
          </div>
          <ConversionFunnel />
          <div className="flex flex-wrap items-center justify-between gap-2 pt-4 border-t border-surface-container mt-4">
            <div className="flex items-center gap-2 font-body-sm text-body-sm text-on-surface-variant">
              <span className="material-symbols-outlined text-secondary text-base">forward_to_inbox</span>
              <span>10 queued applicants waiting for second onboarding batch cycle.</span>
            </div>
            <button className="font-label-sm text-label-sm text-secondary hover:underline font-semibold flex items-center gap-1">
              <span>Manage Email Triggers</span>
              <span className="material-symbols-outlined text-xs">arrow_forward</span>
            </button>
          </div>
        </div>

        <div className="lg:col-span-4 card p-6 relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary-container/20 rounded-full blur-2xl pointer-events-none"></div>
          <div className="flex items-center justify-between mb-4">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary font-bold bg-primary-container/30 px-2 py-0.5 rounded">Tactical Brief</span>
            <span className="material-symbols-outlined text-on-surface-variant text-base">auto_awesome</span>
          </div>
          <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2">Staff Recommendations</h3>
          <p className="font-body-sm text-body-sm text-on-surface-variant">Synthesized from {stats?.total || 38} verified participant questionnaires:</p>
          <div className="space-y-4 mt-4">
            <RecommendationCard icon="schedule" iconColor="text-primary" title="Evening Chess Meetups" description="High demand for weekday evening chess meetups; consider adding dedicated <strong>6:00 PM \u2013 9:00 PM</strong> open challenge slots." />
            <RecommendationCard icon="table_restaurant" iconColor="text-secondary" title="Pairing Table Configurations" description="Since <strong>53%</strong> register as pairs or small groups of 4, reserve Salon Bay B exclusively for 4-top chess and carrom configurations." />
            <RecommendationCard icon="school" iconColor="text-tertiary" title="Masterclass Timing" description="Introductory blitz workshops poll highest for Sunday mid-afternoon slots between 2:00 PM and 4:30 PM." />
          </div>
          <div className="pt-4 mt-4 border-t border-surface-container-high/60 flex items-center justify-between">
            <span className="font-label-sm text-label-sm text-on-surface-variant">Last updated 12 mins ago</span>
            <button className="px-3 py-2 bg-secondary text-on-secondary rounded-lg font-label-sm text-label-sm font-semibold hover:opacity-90 transition-opacity">Apply to Schedule</button>
          </div>
        </div>
      </section>
    </div>
  )
}

function KPICard({ title, value, unit, icon, iconColor, iconBg, trend, subtitle, progress, isTextValue }) {
  return (
    <div className="card p-6 hover:shadow-md transition-shadow relative overflow-hidden group">
      <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/5 rounded-full blur-xl pointer-events-none" />
      <div className="flex items-start justify-between">
        <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">{title}</span>
        <div className={`w-8 h-8 rounded-xl ${iconBg} flex items-center justify-center ${iconColor}`}>
          <span className="material-symbols-outlined text-lg">{icon}</span>
        </div>
      </div>
      <div className="mt-4">
        <div className={cn('font-headline-lg text-display-lg text-on-surface font-normal', isTextValue && 'font-headline-sm text-headline-sm')}>
          {value} {unit ? <span className="font-label-md text-label-md text-on-surface-variant ml-1">{unit}</span> : null}
        </div>
        {trend && (
          <div className="flex items-center gap-1 text-secondary mt-1 font-label-sm text-label-sm font-semibold">
            <span className="material-symbols-outlined text-sm">trending_up</span>
            <span>{trend.value}</span>
            {trend.label && <span>{trend.label}</span>}
          </div>
        )}
      </div>
      {progress !== undefined && (
        <div className="mt-4 pt-1 flex items-center justify-between font-label-sm text-label-sm text-on-surface-variant">
          <span>Target: 50 before launch</span>
          <span className="font-tabular-mono font-semibold">{progress}%</span>
        </div>
      )}
      {subtitle && (
        <div className="mt-4 pt-1 flex items-center justify-between font-label-sm text-label-sm text-on-surface-variant">
          <span>{subtitle}</span>
        </div>
      )}
    </div>
  )
}

function CumulativeChart() {
  return (
    <div className="w-full h-72 relative">
      <svg className="w-full h-full overflow-visible" fill="none" preserveAspectRatio="none" viewBox="0 0 760 220">
        <defs>
          <linearGradient id="areaGradient" x1="0%" x2="0%" y1="0%" y2="100%">
            <stop offset="0%" stopColor="#3d665a" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#3d665a" stopOpacity="0.0" />
          </linearGradient>
          <linearGradient id="lineStroke" x1="0%" x2="100%" y1="0%" y2="0%">
            <stop offset="0%" stopColor="#775a1a" />
            <stop offset="100%" stopColor="#3d665a" />
          </linearGradient>
        </defs>
        <line className="text-surface-container-high" stroke="currentColor" strokeDasharray="3 3" strokeWidth="1" x1="30" x2="730" y1="20" y2="20" />
        <line className="text-surface-container-high" stroke="currentColor" strokeDasharray="3 3" strokeWidth="1" x1="30" x2="730" y1="65" y2="65" />
        <line className="text-surface-container-high" stroke="currentColor" strokeDasharray="3 3" strokeWidth="1" x1="30" x2="730" y1="110" y2="110" />
        <line className="text-surface-container-high" stroke="currentColor" strokeDasharray="3 3" strokeWidth="1" x1="30" x2="730" y1="155" y2="155" />
        <line className="text-surface-container-highest" stroke="currentColor" strokeWidth="1.5" x1="30" x2="730" y1="195" y2="195" />
        <rect className="text-surface-container/50" fill="currentColor" height="175" rx="4" width="70" x="180" y="20" />
        <rect className="text-surface-container/50" fill="currentColor" height="175" rx="4" width="70" x="420" y="20" />
        <rect className="text-surface-container/50" fill="currentColor" height="175" rx="4" width="60" x="660" y="20" />
        <text className="fill-on-surface-variant font-label-sm text-[9px] uppercase tracking-wider font-semibold" x="195" y="32">Weekend</text>
        <text className="fill-on-surface-variant font-label-sm text-[9px] uppercase tracking-wider font-semibold" x="435" y="32">Weekend</text>
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
        <path className="text-secondary" d="M52 188 C 115 178, 175 160, 232 142 C 320 120, 390 98, 472 75 C 570 50, 650 32, 712 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="3.5" />
        <circle className="text-secondary" cx="52" cy="188" fill="#ffffff" r="4" stroke="currentColor" strokeWidth="2.5" />
        <circle className="text-secondary" cx="232" cy="142" fill="#ffffff" r="4" stroke="currentColor" strokeWidth="2.5" />
        <circle className="text-secondary" cx="472" cy="75" fill="#ffffff" r="4" stroke="currentColor" strokeWidth="2.5" />
        <circle cx="712" cy="24" fill="#3d665a" r="5" stroke="#ffffff" strokeWidth="2" />
        <rect className="text-secondary" fill="currentColor" height="20" rx="4" width="58" x="668" y="0" />
        <text className="fill-on-secondary font-tabular-mono text-label-sm text-center font-bold" textAnchor="middle" x="697" y="14">38 Total</text>
      </svg>
      <div className="flex justify-between items-center pt-2 font-tabular-mono text-label-sm text-on-surface-variant">
        <span>Week 1 (Oct 1 - 7)</span>
        <span>Week 2 (Oct 8 - 14)</span>
        <span>Week 3 (Oct 15 - 21)</span>
        <span>Current Week</span>
      </div>
    </div>
  )
}

function GamePreferenceBar({ game, index }) {
  const colors = ['bg-secondary', 'bg-primary-container', 'bg-tertiary', 'bg-outline', 'bg-outline-variant']
  const icons = ['chess', 'circle', 'sports_cricket', 'casino', 'sports_tennis']
  
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className="font-label-md text-label-md font-semibold text-on-surface flex items-center gap-1">
          <span className="material-symbols-outlined text-base" style={{ color: ['#123d32', '#c6a15b', '#576157', '#7f7667', '#d1c5b4'][index % 5] }}>{icons[index % icons.length]}</span>
          {game.game}
        </span>
        <span className="font-tabular-mono text-label-md font-bold text-on-surface">{game.percentage}%</span>
      </div>
      <div className="h-3 w-full bg-surface-container rounded-full overflow-hidden">
        <div className={colors[index % colors.length]} style={{ width: `${game.percentage}%` }} className="h-full rounded-full" />
      </div>
    </div>
  )
}

function VisitTypeDonut({ stats }) {
  const total = stats?.reduce((sum, s) => sum + s.count, 0) || 38
  const circumference = 2 * Math.PI * 38
  
  const segments = [
    { label: 'Casual Walk-in', color: '#3d665a', percentage: 42, dash: 42/100 * circumference },
    { label: 'League / Comp', color: '#c6a15b', percentage: 29, dash: 29/100 * circumference },
    { label: 'Private Events', color: '#576157', percentage: 18, dash: 18/100 * circumference },
    { label: 'Masterclasses', color: '#d1c5b4', percentage: 11, dash: 11/100 * circumference }
  ]

  let offset = 0
  const paths = segments.map(seg => {
    const path = <circle 
      key={seg.label} 
      cx="50" cy="50" fill="transparent" r="38" 
      stroke={seg.color} 
      strokeDasharray={`${seg.dash} ${circumference - seg.dash}`} 
      strokeDashoffset={-offset} 
      strokeWidth="15" strokeLinecap="butt" 
    />
    offset += seg.dash
    return path
  })

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6">
      <div className="relative w-44 h-44 flex-shrink-0">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle className="text-surface-container" cx="50" cy="50" fill="transparent" r="38" stroke="currentColor" strokeWidth="15" />
          {paths}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="font-headline-sm text-headline-sm text-on-surface font-bold">100%</span>
          <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Indexed</span>
        </div>
      </div>
      <div className="flex flex-col space-y-2 w-full">
        {segments.map(seg => (
          <div key={seg.label} className="flex items-center justify-between text-body-sm">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: seg.color }}></span>
              <span className="font-medium text-on-surface">{seg.label}</span>
            </div>
            <span className="font-tabular-mono text-label-md font-bold text-on-surface">{seg.percentage}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function GroupSizeChart() {
  return (
    <div>
      <h3 className="font-label-lg text-label-lg text-on-surface font-semibold flex items-center gap-2">
        <span className="material-symbols-outlined text-base text-primary">groups_2</span>
        <span>Group Size Distribution</span>
      </h3>
      <div className="w-full h-8 bg-surface-container rounded-lg overflow-hidden flex shadow-inner mt-4">
        <div className="bg-secondary flex items-center justify-center text-on-secondary font-label-sm text-label-sm font-semibold" style={{ width: '31%' }}>31%</div>
        <div className="bg-primary-container flex items-center justify-center text-on-primary-container font-label-sm text-label-sm font-bold" style={{ width: '53%' }}>53%</div>
        <div className="bg-tertiary flex items-center justify-center text-on-tertiary font-label-sm text-label-sm font-semibold" style={{ width: '16%' }}>16%</div>
      </div>
      <div className="space-y-1 mt-4">
        <div className="flex items-center justify-between font-body-sm text-body-sm">
          <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-secondary"></span><span className="text-on-surface">Solo Players</span></div>
          <span className="font-tabular-mono font-semibold text-on-surface">31% (12 applicants)</span>
        </div>
        <div className="flex items-center justify-between font-body-sm text-body-sm">
          <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-primary-container"></span><span className="text-on-surface font-medium">2\u20134 Friends (Duos/Trios)</span></div>
          <span className="font-tabular-mono font-bold text-on-surface">53% (20 applicants)</span>
        </div>
        <div className="flex items-center justify-between font-body-sm text-body-sm">
          <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-tertiary"></span><span className="text-on-surface">Large Group (5+ People)</span></div>
          <span className="font-tabular-mono font-semibold text-on-surface">16% (6 applicants)</span>
        </div>
      </div>
    </div>
  )
}

function AgeCohortsChart() {
  const cohorts = [
    { label: '25 \u2013 34 Years (Core)', percentage: 46, color: 'bg-secondary' },
    { label: '18 \u2013 24 Years (Collegiate)', percentage: 28, color: 'bg-primary-container' },
    { label: '35 \u2013 49 Years (Mastery)', percentage: 20, color: 'bg-tertiary' },
    { label: '50+ Years (Senior Masters)', percentage: 6, color: 'bg-outline-variant' }
  ]

  return (
    <div>
      <h3 className="font-label-lg text-label-lg text-on-surface font-semibold flex items-center gap-2">
        <span className="material-symbols-outlined text-base text-primary">person_outline</span>
        <span>Age Cohorts</span>
      </h3>
      <div className="space-y-2 mt-4">
        {cohorts.map(c => (
          <div key={c.label}>
            <div className="flex justify-between items-center text-label-sm mb-1 font-medium">
              <span className="text-on-surface">{c.label}</span>
              <span className="font-tabular-mono font-bold text-on-surface">{c.percentage}%</span>
            </div>
            <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden">
              <div className={c.color} style={{ width: `${c.percentage}%` }} className="h-full rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ConversionFunnel() {
  const stages = [
    { label: 'Stage 01', count: 38, title: 'Registered', subtitle: '100% of pipeline', color: 'text-primary', bg: 'bg-primary', width: '100%' },
    { label: 'Stage 02', count: 28, title: 'Outreach Sent', subtitle: '73.7% dispatch rate', color: 'text-primary', bg: 'bg-primary-container', width: '73.7%' },
    { label: 'Stage 03', count: 19, title: 'Interest Confirmed', subtitle: '50.0% retention', color: 'text-secondary', bg: 'bg-secondary', width: '50%' },
    { label: 'Stage 04', count: 14, title: 'Opening Day Ready', subtitle: '36.8% locked', color: 'text-secondary', bg: 'bg-secondary', width: '36.8%' }
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mt-6">
      {stages.map((stage, i) => (
        <div key={stage.label} className="bg-surface-container-low p-4 rounded-xl flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">{stage.label}</span>
            <span className={`w-2.5 h-2.5 rounded-full ${i === 0 ? 'bg-primary' : i === 1 ? 'bg-primary-container' : 'bg-secondary'}`}></span>
          </div>
          <div>
            <div className="font-headline-md text-headline-md text-on-surface font-semibold">{stage.count}</div>
            <div className="font-label-md text-label-md text-on-surface font-medium">{stage.title}</div>
            <div className="font-tabular-mono text-label-sm text-on-surface-variant mt-1">{stage.subtitle}</div>
          </div>
          <div className="w-full bg-surface-container h-1.5 rounded-full mt-4 overflow-hidden">
            <div className={stage.bg} style={{ width: stage.width }} className="h-full" />
          </div>
        </div>
      ))}
    </div>
  )
}

function RecommendationCard({ icon, iconColor, title, description }) {
  return (
    <div className="flex items-start gap-3 p-3 bg-surface-container-lowest/80 rounded-lg shadow-sm">
      <span className={`material-symbols-outlined ${iconColor} text-xl flex-shrink-0 mt-0.5`}>{icon}</span>
      <div>
        <div className="font-label-md text-label-md font-semibold text-on-surface">{title}</div>
        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">{description}</p>
      </div>
    </div>
  )
}