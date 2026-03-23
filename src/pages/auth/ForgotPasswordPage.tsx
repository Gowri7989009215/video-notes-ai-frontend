import type { FormEvent } from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import { api } from '../../services/api'

export const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setLoading(true)
    try {
      await api.post('/auth/forgot-password', { email })
      setSuccess('If an account exists, we sent a reset code to your email.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to request password reset')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-2">Forgot password</h2>
      <p className="text-sm text-slate-400 mb-6">
        Enter your email and we&apos;ll send you a one-time reset code.
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
        <Button type="submit" loading={loading} className="w-full mt-2">
          Send reset code
        </Button>
      </form>
      <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
        <Link to="/login" className="hover:text-slate-200">
          Back to login
        </Link>
        <Link to="/reset-password" className="text-primary-300 hover:text-primary-200">
          Already have a code?
        </Link>
      </div>
    </div>
  )
}

