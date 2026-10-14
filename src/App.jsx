import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ToastProvider } from './context/ToastContext'
import Dashboard from './pages/Dashboard'
import Registrations from './pages/Registrations'
import Analytics from './pages/Analytics'
import GamesInterests from './pages/GamesInterests'
import WebsiteContent from './pages/WebsiteContent'
import Settings from './pages/Settings'
import LoginPage from './pages/LoginPage'
import { Sidebar } from './components/Sidebar'
import { Header } from './components/Header'
import { useAuth } from './context/AuthContext'
import './index.css'

function ProtectedRoutes() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="pl-72">
      <Header />
      <main className="relative pt-16 bg-surface w-full px-6 min-h-screen">
        <div className="flex flex-col w-full pb-12">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/registrations" element={<Registrations />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/games-interests" element={<GamesInterests />} />
            <Route path="/website-content" element={<WebsiteContent />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </main>
      <Sidebar />
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/*" element={<ProtectedRoutes />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  )
}

export default App