import type { FormEvent } from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'

export const RegisterPage = () => {
  const { register } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await register(name, email, password)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-2">Create your account</h2>
      <p className="text-sm text-slate-400 mb-6">
        Sign up to generate visual notes from any video or YouTube link.
      </p>
      {error && (
        <div className="mb-3 rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-200">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Name"
          type="text"
          autoComplete="name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
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
          autoComplete="new-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="text-xs text-slate-400">
          By signing up you agree to receive transactional emails for verification and job notifications.
        </div>
        <Button type="submit" loading={loading} className="w-full mt-2">
          Create account
        </Button>
        <p className="mt-2 text-xs text-slate-400 text-center">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-300 hover:text-primary-200">
            Log in
          </Link>
        </p>
      </form>
    </div>
  )
}

