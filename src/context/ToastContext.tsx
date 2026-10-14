import { createContext, useContext, useState, ReactNode } from 'react'

const ToastContext = createContext(undefined)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const showToast = (message, type = 'info', duration = 4000) => {
    const id = Math.random().toString(36).substr(2, 9)
    setToasts(prev => [...prev, { id, message, type, duration }])
    if (duration > 0) {
      setTimeout(() => dismissToast(id), duration)
    }
  }

  const dismissToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }

  return (
    <ToastContext.Provider value={{ toasts, showToast, dismissToast }}>
      {children}
      <div className="fixed bottom-8 right-8 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map(toast => (
          <ToastItem key={toast.id} toast={toast} onDismiss={dismissToast} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

function ToastItem({ toast, onDismiss }) {
  const colors = {
    success: 'bg-secondary text-on-secondary',
    error: 'bg-error text-on-error',
    info: 'bg-primary text-on-primary',
    warning: 'bg-primary-container text-on-primary-container',
  }

  return (
    <div 
      className={`flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl animate-slide-in pointer-events-auto ${colors[toast.type]}`}
      role="alert"
    >
      <span className="text-sm font-medium">{toast.message}</span>
      <button 
        onClick={() => onDismiss(toast.id)}
        className="ml-2 p-1 rounded hover:bg-white/20 transition-colors"
        aria-label="Dismiss"
      >
        <span className="material-symbols-outlined text-lg">close</span>
      </button>
    </div>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) throw new Error('useToast must be used within ToastProvider')
  return context
}