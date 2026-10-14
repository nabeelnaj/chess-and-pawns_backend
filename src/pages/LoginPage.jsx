import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { useNavigate } from 'react-router-dom'

export default function LoginPage() {
  const { signIn, loading: authLoading } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !password) {
      setError('Please enter both email and password')
      return
    }
    
    setSubmitting(true)
    setError('')
    try {
      await signIn(email, password)
      showToast('Welcome back!', 'success')
      navigate('/', { replace: true })
    } catch (err) {
      setError(err.message || 'Invalid credentials')
      showToast('Sign in failed', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-surface">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary mb-4">
            <span className="material-symbols-outlined text-on-primary text-3xl">sports_esports</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface">Admin Panel</h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-2">Sign in to manage Pockets & Pawns</p>
        </div>

        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 rounded-lg bg-error-container text-on-error-container flex items-center gap-2">
                <span className="material-symbols-outlined">error</span>
                <span className="font-body-sm text-body-sm">{error}</span>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block font-label-md text-label-md text-on-surface font-semibold mb-1.5">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-11 px-4 rounded-lg bg-surface-container-low text-on-surface font-body-md focus:outline-none focus:ring-2 focus:ring-primary transition-all placeholder:text-on-surface-variant/70"
                placeholder="admin@pocketsandpawns.com"
                autoComplete="email"
                disabled={submitting}
              />
            </div>

            <div>
              <label htmlFor="password" className="block font-label-md text-label-md text-on-surface font-semibold mb-1.5">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-11 px-4 rounded-lg bg-surface-container-low text-on-surface font-body-md focus:outline-none focus:ring-2 focus:ring-primary transition-all placeholder:text-on-surface-variant/70"
                placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"
                autoComplete="current-password"
                disabled={submitting}
              />
            </div>

            <button
              type="submit"
              disabled={submitting || authLoading}
              className="w-full inline-flex items-center justify-center h-12 px-6 rounded-lg bg-primary text-on-primary font-label-md text-label-md tracking-wide shadow-md transition-all hover:bg-primary-container mt-2"
            >
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-on-primary border-t-transparent rounded-full animate-spin"></span>
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="mt-6 p-4 rounded-lg bg-surface-container-high text-center">
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              <strong>Demo Credentials:</strong> Use your Supabase Auth credentials
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}