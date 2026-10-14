import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export function Header() {
  const [dateRangeOpen, setDateRangeOpen] = useState(false)
  const [selectedRange, setSelectedRange] = useState('Last 30 days')
  const dropdownRef = useRef(null)
  const buttonRef = useRef(null)
  const navigate = useNavigate()

  const dateOptions = ['Last 7 days', 'Last 30 days', 'Last 90 days', 'All time']

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDateRangeOpen(false)
      }
      if (buttonRef.current && !buttonRef.current.contains(event.target)) {
        setDateRangeOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleDateSelect = (range) => {
    setSelectedRange(range)
    setDateRangeOpen(false)
  }

  return (
    <header className="fixed top-0 left-72 right-0 h-16 bg-surface/80 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-40 flex items-center justify-between px-6 transition-all duration-300">
      <div className="flex items-center gap-2 font-label-md text-label-md text-on-surface-variant">
        <span>Pockets & Pawns</span>
        <span>/</span>
        <span className="text-on-surface font-semibold">Admin</span>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative inline-block text-left">
          <button
            ref={buttonRef}
            onClick={() => setDateRangeOpen(!dateRangeOpen)}
            className="flex items-center gap-2 bg-surface-container px-4 py-2 rounded-lg text-on-surface font-label-md text-label-md hover:bg-surface-container-high transition-colors shadow-sm"
            type="button"
          >
            <span className="material-symbols-outlined text-base text-primary">calendar_today</span>
            <span>{selectedRange}</span>
            <span className="material-symbols-outlined text-base text-on-surface-variant">expand_more</span>
          </button>
          {dateRangeOpen && (
            <div ref={dropdownRef} className="absolute right-0 mt-2 w-48 rounded-lg bg-surface-container-lowest shadow-xl z-30 py-1">
              {dateOptions.map((option) => (
                <a
                  key={option}
                  onClick={(e) => { e.preventDefault(); handleDateSelect(option); }}
                  className={`date-option block px-4 py-2 text-on-surface font-label-md text-label-md transition-colors ${selectedRange === option ? 'font-semibold bg-surface-container' : 'hover:bg-surface-container-high'}`}
                  href="#"
                >
                  {option}
                </a>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 bg-surface-container px-4 py-2 rounded-lg text-on-surface-variant w-64 justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-lg">search</span>
            <span className="font-body-sm text-body-sm text-on-surface-variant">Search applicants, games...</span>
          </div>
          <kbd className="bg-surface-container-high px-2 py-0.5 rounded text-label-sm font-label-sm text-on-surface-variant font-mono">\u2318K</kbd>
        </div>

        <button className="p-2 rounded-full text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors relative" type="button">
          <span className="material-symbols-outlined text-xl">notifications</span>
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-error"></span>
        </button>

        <Link to="/" className="flex items-center gap-2 px-3 py-2 rounded-lg bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors font-label-md text-label-md">
          <span className="font-label-md text-label-md">View Website</span>
          <span className="material-symbols-outlined text-base">open_in_new</span>
        </Link>

        <div className="flex items-center gap-2 pl-2">
          <img 
            alt="Profile" 
            className="w-8 h-8 rounded-full object-cover" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBDhEBJg6IeIfpW8cW5qWwQBxjz6RIxeI9YNSRiqUG4wvEbzqPnQ-2lean5jAzxIOmDcz2rkBFy9SpbVpw46huy7yUI-G5-dPlI3HErFm_0e_X0F_pol6pKgXuHGlJH01GYTYVFEuCkzm2cRdyWd0Pn7VD_lb3OTEwdyeX_s8oppK_5Xx4Wt0FKHqKEIvgOs4jVavbjARQmvjgM9R6mx6JSMS_HhcJ4joHC5nMsyVu3HQr1eZTX3xw77A"
          />
        </div>
      </div>
    </header>
  )
}