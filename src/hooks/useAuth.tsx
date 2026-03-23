import React, { createContext, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../services/api'

export interface User {
  id: string
  name: string
  email: string
  isVerified: boolean
}

interface AuthContextValue {
  user: User | null
  token: string | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

const TOKEN_KEY = 'videonotesai_token'

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_KEY)
    if (storedToken) {
      setToken(storedToken)
      api.setToken(storedToken)
      refreshProfile().finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const login = async (email: string, password: string) => {
    const res = await api.post('/auth/login', { email, password })
    const { token: jwt, user: userData } = res.data
    localStorage.setItem(TOKEN_KEY, jwt)
    api.setToken(jwt)
    setToken(jwt)
    setUser(userData)
    navigate('/app', { replace: true })
  }

  const register = async (name: string, email: string, password: string) => {
    await api.post('/auth/register', { name, email, password })
    navigate('/verify-email', { state: { email }, replace: true })
  }

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY)
    api.setToken(null)
    setToken(null)
    setUser(null)
    navigate('/login', { replace: true })
  }

  const refreshProfile = async () => {
    if (!token) return
    try {
      const res = await api.get('/users/me')
      setUser(res.data)
    } catch {
      logout()
    }
  }

  const value: AuthContextValue = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    refreshProfile
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return ctx
}

