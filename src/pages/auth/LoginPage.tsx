import type { FormEvent } from 'react'
import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'

export const LoginPage = () => {
  const { login } = useAuth()
  const location = useLocation() as { state?: { from?: Location } }
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await login(email, password)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-2">Welcome back</h2>
      <p className="text-sm text-slate-400 mb-6">
        Sign in to access your dashboard and video note history.
      </p>
      {location.state?.from && (
        <div className="mb-3 rounded-md border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-xs text-amber-200">
          Please log in to access that page.
        </div>
      )}
      {error && (
        <div className="mb-3 rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-200">
          {error}
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
          label="Password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="flex items-center justify-between text-xs">
          <Link to="/forgot-password" className="text-primary-300 hover:text-primary-200">
            Forgot password?
          </Link>
          <span className="text-slate-400">
            No account?{' '}
            <Link to="/register" className="text-primary-300 hover:text-primary-200">
              Sign up
            </Link>
          </span>
        </div>
        <Button type="submit" loading={loading} className="w-full mt-2">
          Log in
        </Button>
      </form>
    </div>
  )
}

