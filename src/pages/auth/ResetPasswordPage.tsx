import type { FormEvent } from 'react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import { api } from '../../services/api'

export const ResetPasswordPage = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)
    try {
      await api.post('/auth/reset-password', { email, code, password })
      setSuccess('Password updated. You can now log in.')
      setTimeout(() => navigate('/login', { replace: true }), 1000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reset password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-2">Reset password</h2>
      <p className="text-sm text-slate-400 mb-6">
        Enter the reset code from your email and choose a new password.
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
          label="Reset code"
          type="text"
          inputMode="numeric"
          required
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <Input
          label="New password"
          type="password"
          autoComplete="new-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Input
          label="Confirm new password"
          type="password"
          autoComplete="new-password"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <Button type="submit" loading={loading} className="w-full mt-2">
          Update password
        </Button>
      </form>
      <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
        <Link to="/forgot-password" className="hover:text-slate-200">
          Didn&apos;t receive a code?
        </Link>
        <Link to="/login" className="hover:text-slate-200">
          Back to login
        </Link>
      </div>
    </div>
  )
}

