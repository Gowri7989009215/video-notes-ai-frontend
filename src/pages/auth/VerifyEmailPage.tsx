import type { FormEvent } from 'react'
import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import { api } from '../../services/api'

interface LocationState {
  email?: string
}

export const VerifyEmailPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const state = (location.state || {}) as LocationState
  const [email, setEmail] = useState(state.email || '')
  const [code, setCode] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setLoading(true)
    try {
      await api.post('/auth/verify-email', { email, code })
      setSuccess('Email verified. You can now log in.')
      setTimeout(() => navigate('/login', { replace: true }), 1000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verification failed')
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    setError(null)
    setSuccess(null)
    try {
      await api.post('/auth/resend-verification', { email })
      setSuccess('Verification code resent to your email.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to resend verification email')
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-2">Verify your email</h2>
      <p className="text-sm text-slate-400 mb-6">
        Enter the 6-digit code we sent to your inbox to activate your account.
      </p>
      {error && (
        <div className="mb-3 rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-200">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-3 rounded-md border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-200">
          {success}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          label="Verification code"
          type="text"
          inputMode="numeric"
          required
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <Button type="submit" loading={loading} className="w-full mt-2">
          Verify email
        </Button>
      </form>
      <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
        <button type="button" onClick={handleResend} className="text-primary-300 hover:text-primary-200">
          Resend verification code
        </button>
        <Link to="/login" className="hover:text-slate-200">
          Back to login
        </Link>
      </div>
    </div>
  )
}

