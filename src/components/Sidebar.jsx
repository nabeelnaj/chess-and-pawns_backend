import { useState, useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { cn } from '../lib/utils'

const navItems = [
  { path: '/', label: 'Dashboard', icon: 'dashboard' },
  { path: '/registrations', label: 'Registrations', icon: 'how_to_reg', badge: '14' },
  { path: '/analytics', label: 'Analytics', icon: 'insights' },
  { path: '/games-interests', label: 'Games & Interests', icon: 'sports_esports' },
  { path: '/website-content', label: 'Website Content', icon: 'article' },
  { path: '/settings', label: 'Settings', icon: 'settings' }
]

export function Sidebar() {
  const location = useLocation()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside className={cn(
      'fixed left-0 top-0 h-full bg-surface-container-low z-50 flex flex-col justify-between shadow-[0_1px_8px_rgba(0,0,0,0.04)] transition-all duration-300',
      collapsed ? 'w-20' : 'w-72'
    )}>
      <div className="flex flex-col h-full">
        {/* Logo & Brand */}
        <div className={cn('h-16 px-4 flex items-center gap-3 bg-surface-container-low transition-all', collapsed && 'justify-center')}>
          {!collapsed && (
            <div className="flex flex-col min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="font-headline-sm text-headline-sm text-on-surface font-semibold tracking-tight">Pockets & Pawns</span>
              </div>
              <span className="font-label-sm text-label-sm text-on-primary-container bg-primary-container/20 px-2 py-0.5 rounded font-bold uppercase w-fit">Admin Panel</span>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors flex-shrink-0"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <span className="material-symbols-outlined text-lg">
              {collapsed ? 'chevron_right' : 'chevron_left'}
            </span>
          </button>
        </div>

        {/* Navigation */}
        {!collapsed && (
          <nav className="flex-1 px-3 py-2 overflow-y-auto" data-active-classes="bg-primary-container text-on-primary-container font-semibold rounded-lg">
            <div className="text-label-sm font-label-sm text-on-surface-variant uppercase px-3 py-2 tracking-wider">Navigation</div>
            <div className="flex flex-col gap-1">
              {navItems.map(item => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) => cn(
                    'sidebar-link',
                    isActive ? 'sidebar-link-active' : 'sidebar-link-inactive'
                  )}
                  title={item.label}
                >
                  <span className="material-symbols-outlined text-lg flex-shrink-0">{item.icon}</span>
                  {!collapsed && <span className="truncate">{item.label}</span>}
                  {item.badge && !collapsed && (
                    <span className="ml-auto bg-secondary text-on-secondary font-label-sm text-label-sm px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              ))}
            </div>
          </nav>
        )}

        {/* Bottom Section */}
        <div className={cn('p-4 flex flex-col gap-2 transition-all', collapsed && 'items-center')}>
          <div className={cn('flex items-center justify-between px-3 py-1 text-on-surface-variant', collapsed && 'justify-center')}>
            <a className="flex items-center gap-2 text-label-md font-label-md transition-colors" href="#" title="Documentation">
              <span className="material-symbols-outlined text-base">help</span>
              {!collapsed && <span>Documentation</span>}
            </a>
            <a className="flex items-center gap-2 text-label-md font-label-md transition-colors text-error" href="#" title="Exit">
              <span className="material-symbols-outlined text-base">logout</span>
              {!collapsed && <span>Exit</span>}
            </a>
          </div>
          
          {!collapsed && (
            <div className="flex items-center gap-3 p-3 rounded-lg bg-surface-container-highest/60">
              <img 
                alt="Profile" 
                className="w-8 h-8 rounded-full object-cover" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBDhEBJg6IeIfpW8cW5qWwQBxjz6RIxeI9YNSRiqUG4wvEbzqPnQ-2lean5jAzxIOmDcz2rkBFy9SpbVpw46huy7yUI-G5-dPlI3HErFm_0e_X0F_pol6pKgXuHGlJH01GYTYVFEuCkzm2cRdyWd0Pn7VD_lb3OTEwdyeX_s8oppK_5Xx4Wt0FKHqKEIvgOs4jVavbjARQmvjgM9R6mx6JSMS_HhcJ4joHC5nMsyVu3HQr1eZTX3xw77A"
              />
              <div className="flex flex-col min-w-0 flex-1">
                <span className="font-label-lg text-label-lg text-on-surface truncate">Marcus Sterling</span>
                <span className="font-label-sm text-label-sm text-on-surface-variant truncate">Administrator</span>
              </div>
              <span className="material-symbols-outlined text-on-surface-variant text-base">unfold_more</span>
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}