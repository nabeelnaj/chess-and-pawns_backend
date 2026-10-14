import { useState, useEffect } from 'react'
import { cn } from '../lib/utils'

const initialGames = [
  { id: 1, name: 'Chess', category: 'Board & Classic', status: 'active', registrations: 94, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBPZqGFbGTPVgHBadhzZiAwK06DyMaYY9b3HW88X7s4gZLXFJ4I400ze58di6cIR8XHsCGDhzKGaZu4BgiL9xxT8RWrK97cHUs8g4J6N05B2J_YzblpxMv0nAAmV_XVT2Mxx4ZqU4DhUeplcOOZpcxXcauVg51FdxRZu1uZ6RptNTsUcjKQPA2j6XRFao-hBuHkcKQnUVW82W8gwmcMEk9Wh7BROI8u26XoT9z7UF2oryPmrG-TvzeCeQ', teaser: 'Handcrafted tournament wooden boards, timed blitz setups, and casual lounge sets.', order: 1 },
  { id: 2, name: 'Carrom', category: 'Board & Classic', status: 'active', registrations: 47, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAJkmf2Hiizmb91gp3Rp_1vDUd7ev6a6aedxjsOMIABRZt0ftaZftnVas1E6q-p8JLoHU2ezsGMprv1ynrJgecgc-wxuDiM9eWz2TDzubyPbNpbVEkdWby7cLC334QKbPNArG_zzIwQ1-mIn0UTgGV2EKa4xZ5ZluuJBlv3CHmxgIh3sAZrSxtPar9TjKQDxY-1Mo3SSkiOHxA7gi0Q6szTys9QJWS_wMRSuAipHgqM5a-jo1c3CjHa-g', teaser: 'Championship-grade plywood carrom arenas with tournament smooth powder and ivory strikers.', order: 2 },
  { id: 3, name: 'American Pool / Billiards', category: 'Cue Sports', status: 'active', registrations: 71, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAiwkgg3Z81ZH4so3X5yiiACs-LJt5Ip2D_VlMZF6oYbKqCEYUsIUdtJtylY7QhYaL6tYWjFS66APDc9HhkXP6o-iQczvsi2yAa7SZzr9wzAZ-NTYCpGVupCf5GNBkkMcQWXJ_gjemywFIyIwzBuVw_fJCF6b4w9BWuPtV8aYKLW-ijgaF26jkaeBm3SriksLTcljLYyMjNJ8za1Z8cKhlpqVZgcmHbn8Rbbe5tyKlTYBLo5RquuvGmOA', teaser: 'Precision 9ft slate tables, Simonis speed cloth, and hand-selected maple cues for serious pool.', order: 3 },
  { id: 4, name: 'Strategic Board Games', category: 'Board & Classic', status: 'active', registrations: 53, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCTHPXOwyLmgT7mMy7zzJqwHFRlUKq5KmHy--xhc2QgUiqlcCrco9HNqs_mw8CXDDTU4McYgptVqZIh-mtjHQUkAPFIDcJ9GVjNsLZ-Ow1BqUW3SfPvejvbIjfcalOHK2BOGzRV14MXNEcEuWYD9bRrPgb7BXs123M-zgc_laqIxDALs3k0gXAVgyw-dZ0W8Xs35WHqkdWEYn_sxMoFP8H0Hh77ULnvlKPv2UPGM4PlwKNjfqf41lB38w', teaser: 'Extensive curated library spanning Catan, Scythe, Brass: Birmingham, and boutique tabletop classics.', order: 4 },
  { id: 5, name: 'Table Tennis', category: 'Table Sports', status: 'active', registrations: 39, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAF-dtMJlAqXKwK-s8i3lAunPJfWxUHMGX6fUTiMTidbqTFvsKd8jUFcdDwNne4ZndBJq4zRH7QTo55sIkEOei1uHTMkNuH5txaWASu4AEa46oL1lffppBeBU1BvOfQZCnBJbAdTbzBDh8Z4iseZtUtJGusCfYMeV_NZHikhjohRbNDwkOZoZkD6lJZ1QUGaW6uLMC0l8Jz8y3eVA7Zy66ybfS1R3xblZfAKxhlBNcLJnnsY8yA2WSZkQ', teaser: 'ITTF-approved competition tables featuring non-slip flooring and dynamic club ladders.', order: 5 },
  { id: 6, name: 'Snooker', category: 'Cue Sports', status: 'active', registrations: 26, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDqeuX1SxBEclq7XuiVvnR85iD8DLk09wemQSHRkmotvtJPtlgkhc6xImrogl0HrfVulHD9NkSnm5uAZ9moc_pKxRdUjjU03q2nsTTK7a9hXujGnxi1VqfYlANJL7WSGCK1ZpBjl_0suuCBuO0JSEw1X6A71Tg28mCDROY8Pkhv9J3DNJZivHzuHJXYgtN5S5fDVsHt3k7ZY11C96mmRIYBidrEpJxXpglpZeE3D_kEesYEwSZO6Lmo3Q', teaser: 'Full 12ft English slate masterpiece fitted with Strachan 6811 baize and precision scoreboards.', order: 6 },
  { id: 7, name: 'Darts', category: 'Table Sports', status: 'draft', registrations: 7, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBDcbFDguLqn-XQezDHvlqvYNrl9AdQSlN03pFyAf-HgKxMWkcwggejDK8Y4wDAdhxiHyMgPF1woJCVK9crUJ-d2xYVtmp_MXrbbalG6WpoMb-IZeufwUAYq3i198yTTZZhGbEcSg4VZFqnuWlZBCKK1Umst1dIO-4hmKH3EHjnOfYUFRux7XqEd2YVBpaFAu5OF6bz1ilfBykBgkhe9BfFNLiPbofoKwaeLm9w6naqbYwnrb1QzuGVnA', teaser: 'Blade-wire bristle arenas with digital scorekeeping and laser oche lines.', order: 7 },
  { id: 8, name: 'Mahjong', category: 'Board & Classic', status: 'draft', registrations: 5, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB_Zii81aEyVAX1nFxgW6HyP_ESuupz9UhJv8rckkYgHKjoL9_nzrSEoDBle96Kgc5G7vGMi-F-5ItszTG5LOv-FgCypDvRIivXaM-qoySwu0rF7n_CUeK7i1S1CJhJVaWMbuOUF8_S31OC-UCKsiyjT_JkoOSTr_5bIHbzA46lLqgej5Sn-Hz-t9i_Ag6ho0V-I-lyeDWFbaPB8XxIUtxCLkobBb7xkvUsjzxkukTHeZ5_J3VoYeyw3w', teaser: 'Private salon suites with four automated motorized shuffling tables and bone-tile sets.', order: 8 }
]

const categories = ['All', 'Board & Classic', 'Cue Sports', 'Table Sports', 'Electronic & Arcades']

export default function GamesInterests() {
  const [games, setGames] = useState(initialGames)
  const [activeFilter, setActiveFilter] = useState('All')
  const [search, setSearch] = useState('')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editingGame, setEditingGame] = useState(null)
  const [deleteModal, setDeleteModal] = useState({ game: null, show: false })
  const [toast, setToast] = useState(null)

  const showToast = (message) => {
    setToast({ message })
    setTimeout(() => setToast(null), 2800)
  }

  const filteredGames = games.filter(g => {
    if (activeFilter !== 'All' && g.category !== activeFilter) return false
    if (search && !g.name.toLowerCase().includes(search.toLowerCase()) && !g.category.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const activeCount = games.filter(g => g.status === 'active').length
  const draftCount = games.filter(g => g.status === 'draft').length

  const toggleStatus = (game) => {
    setGames(prev => prev.map(g => g.id === game.id ? { ...g, status: g.status === 'active' ? 'draft' : 'active' } : g))
    showToast(`${game.name} ${game.status === 'active' ? 'hidden from' : 'now live on'} public form.`)
  }

  const openDrawer = (game) => {
    setEditingGame(game ? { ...game } : {
      id: Date.now(),
      name: '',
      category: 'Board & Classic',
      status: 'draft',
      registrations: 0,
      image: '',
      teaser: '',
      order: games.length + 1
    })
    setDrawerOpen(true)
  }

  const closeDrawer = () => {
    setDrawerOpen(false)
    setEditingGame(null)
  }

  const saveGame = () => {
    if (!editingGame.name || !editingGame.category) {
      showToast('Please fill in required fields')
      return
    }
    setGames(prev => {
      const exists = prev.some(g => g.id === editingGame.id)
      if (exists) {
        return prev.map(g => g.id === editingGame.id ? editingGame : g)
      } else {
        return [...prev, { ...editingGame, registrations: 0 }]
      }
    })
    closeDrawer()
    showToast('Game saved successfully')
  }

  const confirmDelete = () => {
    if (deleteModal.game) {
      setGames(prev => prev.filter(g => g.id !== deleteModal.game.id))
      setDeleteModal({ game: null, show: false })
      showToast('Game archived')
    }
  }

  const handleReorder = (fromIndex, toIndex) => {
    const newGames = [...games]
    const [removed] = newGames.splice(fromIndex, 1)
    newGames.splice(toIndex, 0, removed)
    newGames.forEach((g, i) => g.order = i + 1)
    setGames(newGames)
  }

  return (
    <div className="space-y-6">
      <div className="pb-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-on-surface-variant">
              <span className="inline-block w-2 h-2 rounded-full bg-secondary"></span>
              <span className="font-label-sm text-label-sm uppercase tracking-wider">Venue Inventory & Experience Roster</span>
              <span>\u2022</span>
              <span className="font-tabular-mono text-primary font-bold">2025 Matchmaking Season</span>
            </div>
            <h1 className="font-headline-lg text-headline-lg text-on-surface font-semibold tracking-tight">Games & Interests Catalog</h1>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">Manage games offered at Pockets & Pawns and options available on the public pre-registration form.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2 bg-surface-container-high px-4 py-2 rounded-lg shadow-sm">
              <span className="material-symbols-outlined text-secondary text-lg">check_circle</span>
              <div className="flex flex-col">
                <span className="font-label-sm text-label-sm uppercase text-on-surface-variant">Live Roster</span>
                <span className="font-label-md text-label-md text-on-surface font-semibold">{activeCount} active, {draftCount} draft</span>
              </div>
            </div>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg pointer-events-none">search</span>
              <input value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 pr-4 py-2 bg-surface-container-lowest text-on-surface rounded-lg shadow-sm font-body-sm text-body-sm w-64 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all" placeholder="Search disciplines, categories..." type="text" />
            </div>
            <button onClick={() => openDrawer()} className="flex items-center gap-2 bg-secondary hover:bg-on-secondary-fixed-variant text-on-secondary px-5 py-2 rounded-lg font-label-md text-label-md shadow-md hover:shadow-lg transition-all">
              <span className="material-symbols-outlined text-lg">add</span>
              <span>+ Add New Game</span>
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <StatCard title="Total Applicant Interest" value="342" trend="+18.4% this week" icon="group" iconBg="bg-secondary-container" iconColor="text-on-secondary-container" />
          <StatCard title="Highest Demand" value="Tournament Chess" subtitle="94 selections" icon="military_tech" iconBg="bg-primary-fixed" iconColor="text-on-primary-fixed" />
          <StatCard title="Pre-Registration Fill" value="85.2%" subtitle="85% filled" progress={85} icon="checklist" iconBg="bg-surface-container" iconColor="text-on-surface-variant" />
          <StatCard title="Form Conversion Rate" value="64.8%" subtitle="Active Salon Standard" icon="insights" iconBg="bg-secondary-fixed" iconColor="text-on-secondary-fixed" />
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="px-5 py-4 bg-surface-container-low flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2 font-label-md text-label-md">
            <span className="text-on-surface font-bold">Disciplines Matrix</span>
            <span className="text-on-surface-variant font-normal">\u2022 Order reflects public signup sequence</span>
          </div>
          <div className="flex items-center gap-1">
            {categories.map(cat => {
              const count = games.filter(g => cat === 'All' || g.category === cat).length
              return (
                <button
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  className={cn('px-3 py-1.5 rounded-full font-label-sm text-label-sm transition-all', activeFilter === cat ? 'bg-surface-container-high text-on-surface font-semibold shadow-[0_0_0_1px_rgba(0,0,0,0.04)]' : 'text-on-surface-variant hover:text-on-surface')}
                >
                  {cat} ({count})
                </button>
              )
            })}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse" id="games-table">
            <thead>
              <tr className="bg-surface-container text-on-surface-variant font-label-md text-label-md uppercase tracking-wider">
                <th className="py-3 px-4 w-16 text-center" scope="col">Order</th>
                <th className="py-3 px-5 min-w-[280px]" scope="col">Discipline & Visual</th>
                <th className="py-3 px-4" scope="col">Category</th>
                <th className="py-3 px-4 hidden xl:table-cell max-w-sm" scope="col">Public Teaser</th>
                <th className="py-3 px-4 text-right" scope="col">Registrations</th>
                <th className="py-3 px-5 text-center" scope="col">Website Status</th>
                <th className="py-3 px-4 text-right" scope="col">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-high font-body-sm text-body-sm text-on-surface">
              {filteredGames.map((game, index) => (
                <tr key={game.id} className={cn('hover:bg-surface-container-low transition-colors', game.status === 'draft' && 'bg-surface-container-low/40 opacity-90')}>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-1 text-on-surface-variant font-tabular-mono font-bold">
                      <span className="material-symbols-outlined text-base cursor-grab opacity-40 hover:opacity-100 transition-opacity">drag_indicator</span>
                      <span>#{game.order}</span>
                    </div>
                  </td>
                  <td className="py-3 px-5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-surface-container overflow-hidden flex-shrink-0 relative shadow-inner">
                        {game.image ? <img className="w-full h-full object-cover" src={game.image} alt="" /> : <div className="w-full h-full flex items-center justify-center text-on-surface-variant"><span className="material-symbols-outlined text-3xl">sports_esports</span></div>}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-headline-sm text-headline-sm text-on-surface font-semibold truncate">{game.name}</span>
                        <span className={cn('font-label-sm text-label-sm font-medium', game.status === 'active' ? 'text-primary' : 'text-on-surface-variant')}>
                          {game.status === 'active' ? 'Flagship Discipline' : 'Standard Club Spec'}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={cn('inline-flex items-center px-3 py-1 rounded-full font-label-sm text-label-sm font-semibold', game.category === 'Board & Classic' ? 'bg-secondary-container text-on-secondary-container' : game.category === 'Cue Sports' ? 'bg-primary-fixed text-on-primary-fixed' : 'bg-tertiary-fixed text-on-tertiary-fixed')}>
                      {game.category}
                    </span>
                  </td>
                  <td className="py-3 px-4 hidden xl:table-cell text-on-surface-variant max-w-sm">
                    <p className="truncate">{game.teaser}</p>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex flex-col items-end">
                      <span className="font-tabular-mono text-body-md font-bold text-on-surface">{game.registrations}</span>
                      <span className="font-label-sm text-label-sm text-secondary font-medium">applicants</span>
                    </div>
                  </td>
                  <td className="py-3 px-5 text-center">
                    <button
                      onClick={() => toggleStatus(game)}
                      className={cn('inline-flex items-center gap-2 px-3 py-1.5 rounded-full font-label-sm text-label-sm font-semibold shadow-xs transition-all', game.status === 'active' ? 'bg-secondary text-on-secondary hover:opacity-90' : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest')}
                    >
                      <span className={`w-2 h-2 rounded-full ${game.status === 'active' ? 'bg-on-secondary animate-pulse' : 'bg-outline'}`}></span>
                      <span>{game.status === 'active' ? 'Visible on Website' : 'Hidden from Form'}</span>
                    </button>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openDrawer(game)} className="p-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high rounded transition-colors" title="Edit Game"><span className="material-symbols-outlined text-lg">edit</span></button>
                      <button onClick={() => openDrawer({ ...game, id: Date.now(), name: game.name + ' (Copy)', order: games.length + 1 })} className="p-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high rounded transition-colors" title="Duplicate"><span className="material-symbols-outlined text-lg">content_copy</span></button>
                      <button onClick={() => setDeleteModal({ game, show: true })} className="p-2 text-on-surface-variant hover:text-error hover:bg-error-container rounded transition-colors" title="Delete"><span className="material-symbols-outlined text-lg">delete</span></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-5 py-4 bg-surface-container-low flex flex-col sm:flex-row items-center justify-between text-on-surface-variant font-label-sm text-label-sm gap-2">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-base text-secondary">info</span>
            <span>Drag handles to re-sequence presentation on public landing pre-registration cards.</span>
          </div>
          <div className="flex items-center gap-4">
            <span>Showing {filteredGames.length} of {games.length} catalog entries</span>
            <button className="text-primary hover:text-on-primary-fixed-variant font-bold transition-colors">Export Registry CSV</button>
          </div>
        </div>
      </div>

      {drawerOpen && editingGame && (
        <Drawer
          game={editingGame}
          onClose={closeDrawer}
          onSave={saveGame}
          categories={categories.slice(1)}
        />
      )}

      {deleteModal.show && deleteModal.game && (
        <DeleteModal
          game={deleteModal.game}
          onClose={() => setDeleteModal({ game: null, show: false })}
          onConfirm={confirmDelete}
        />
      )}

      {toast && (
        <div className="fixed bottom-8 right-8 z-50 bg-inverse-surface text-inverse-on-surface px-6 py-3 rounded-xl shadow-xl flex items-center gap-2 animate-slide-in">
          <span className="material-symbols-outlined text-primary-fixed text-lg">check_circle</span>
          <span className="font-label-md text-label-md">{toast.message}</span>
        </div>
      )}
    </div>
  )
}

function StatCard({ title, value, subtitle, trend, progress, icon, iconBg, iconColor }) {
  return (
    <div className="card p-5 flex items-center justify-between">
      <div className="flex flex-col">
        <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">{title}</span>
        <span className="font-headline-md text-headline-md text-on-surface font-bold mt-1">{value}</span>
        {subtitle && <span className="font-label-sm text-label-sm text-on-surface-variant mt-1">{subtitle}</span>}
        {trend && <span className="font-label-sm text-label-sm text-secondary mt-1 font-semibold">{trend}</span>}
      </div>
      <div className={`w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center ${iconColor}`}>
        <span className="material-symbols-outlined text-2xl">{icon}</span>
      </div>
    </div>
  )
}

function Drawer({ game, onClose, onSave, categories }) {
  const [form, setForm] = useState({
    name: game.name,
    category: game.category,
    teaser: game.teaser,
    description: '',
    order: game.order,
    active: game.status === 'active'
  })

  return (
    <>
      <div className="fixed inset-0 bg-on-surface/40 backdrop-blur-xs z-50 transition-opacity" onClick={onClose} />
      <div className="fixed top-0 right-0 h-full w-full max-w-xl bg-surface-container-lowest shadow-2xl z-50 transform transition-transform duration-300 flex flex-col overflow-y-auto">
        <div className="p-5 bg-surface-container-low flex items-center justify-between sticky top-0 z-10">
          <div className="flex flex-col">
            <span className="font-label-sm text-label-sm text-primary uppercase font-bold tracking-wider">Discipline Configuration</span>
            <h2 className="font-headline-md text-headline-md text-on-surface font-semibold">{game.id > 1000 ? 'Add New Game' : 'Edit Game'}</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface transition-colors"><span className="material-symbols-outlined text-2xl">close</span></button>
        </div>
        <div className="p-6 flex flex-col gap-5 flex-1">
          <div className="p-4 rounded-lg bg-primary-fixed/20 text-on-primary-fixed-variant flex items-start gap-3">
            <span className="material-symbols-outlined text-primary text-xl flex-shrink-0 mt-0.5">policy</span>
            <div className="flex flex-col">
              <span className="font-label-md text-label-md font-bold text-on-surface">Integrity Guard Active</span>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Hiding a game preserves all past registration records that selected it. Disabling does not drop historical analytics or tournament matchmaking profiles.</p>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <label className="font-label-md text-label-md text-on-surface font-semibold">Game Title <span className="text-error">*</span></label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="px-4 py-2 rounded-lg bg-surface-container text-on-surface font-body-md focus:outline-none focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all" placeholder="e.g. Vintage Pinball & Arcades" type="text" />
            <span className="font-label-sm text-label-sm text-on-surface-variant">The official discipline identifier used in venue announcements.</span>
          </div>
          <div className="flex flex-col gap-1">
            <label className="font-label-md text-label-md text-on-surface font-semibold">Category <span className="text-error">*</span></label>
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="px-4 py-2 rounded-lg bg-surface-container text-on-surface font-body-md focus:outline-none focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all">
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="font-label-md text-label-md text-on-surface font-semibold">Checklist Form Label <span className="text-error">*</span></label>
            <input value={form.teaser} onChange={(e) => setForm({ ...form, teaser: e.target.value })} className="px-4 py-2 rounded-lg bg-surface-container text-on-surface font-body-md focus:outline-none focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all" placeholder="e.g. Pinball (Match Play, Retro Replicas)" type="text" />
            <span className="font-label-sm text-label-sm text-on-surface-variant">Exact label rendered on the public pre-registration card choice chip.</span>
          </div>
          <div className="flex flex-col gap-1">
            <label className="font-label-md text-label-md text-on-surface font-semibold">Short Public Description <span className="text-error">*</span></label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="px-4 py-2 rounded-lg bg-surface-container text-on-surface font-body-md focus:outline-none focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all resize-none" placeholder="Concise overview of hardware, rulesets, and salon ambiance..." rows="3" />
            <span className="font-label-sm text-label-sm text-on-surface-variant">Max 140 characters recommended for mobile layouts.</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <div className="flex flex-col gap-1">
              <label className="font-label-md text-label-md text-on-surface font-semibold">Display Sequence #</label>
              <input value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} className="px-4 py-2 rounded-lg bg-surface-container text-on-surface font-tabular-mono font-body-md focus:outline-none focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all" type="number" min="1" max="20" />
            </div>
            <div className="flex items-center gap-3 mt-4 sm:mt-0 p-3 rounded-lg bg-surface-container">
              <input checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} className="w-5 h-5 rounded text-secondary focus:ring-primary cursor-pointer" id="form-active-toggle" type="checkbox" />
              <label className="font-label-md text-label-md text-on-surface cursor-pointer select-none" for="form-active-toggle">Display on pre-registration form</label>
            </div>
          </div>
        </div>
        <div className="p-5 bg-surface-container-low flex items-center justify-end gap-2 sticky bottom-0 z-10">
          <button onClick={onClose} className="px-5 py-2 rounded-lg font-label-md text-label-md text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors">Cancel</button>
          <button onClick={onSave} className="flex items-center gap-2 bg-secondary hover:bg-on-secondary-fixed-variant text-on-secondary px-6 py-2 rounded-lg font-label-md text-label-md shadow-md hover:shadow-lg transition-all"><span className="material-symbols-outlined text-lg">save</span><span>Save Changes</span></button>
        </div>
      </div>
    </>
  )
}

function DeleteModal({ game, onClose, onConfirm }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/40 backdrop-blur-xs">
      <div className="bg-surface-container-lowest max-w-md w-full rounded-2xl shadow-2xl p-6 flex flex-col gap-4">
        <div className="w-12 h-12 rounded-full bg-error-container text-on-error-container flex items-center justify-center"><span className="material-symbols-outlined text-2xl">warning</span></div>
        <div className="flex flex-col">
          <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">Safeguard Warning: Linked Data</h3>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">This game currently has <strong>{game.registrations}</strong> registered applicants. Deleting it completely will sever applicant interest tags and historical scoring.</p>
        </div>
        <div className="p-3 rounded-lg bg-surface-container-high flex items-center gap-3">
          <span className="material-symbols-outlined text-on-surface-variant text-lg">recommend</span>
          <span className="font-label-sm text-label-sm text-on-surface-variant">Recommended: Switch visibility to <strong>Hidden from Form</strong> instead.</span>
        </div>
        <div className="flex items-center justify-end gap-2 pt-1">
          <button onClick={onClose} className="px-4 py-2 rounded-lg font-label-md text-label-md text-on-surface-variant hover:bg-surface-container-high transition-colors">Cancel</button>
          <button onClick={onConfirm} className="px-4 py-2 rounded-lg font-label-md text-label-md bg-error text-on-error hover:bg-error/90 transition-colors shadow-sm">Force Archive</button>
        </div>
      </div>
    </div>
  )
}