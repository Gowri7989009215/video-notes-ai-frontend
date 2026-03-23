import { Navigate, useLocation } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useAuth } from '../../hooks/useAuth'

interface Props {
  children: ReactNode
}

export const ProtectedRoute = ({ children }: Props) => {
  const { token, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-50">
        <div className="animate-pulse text-slate-300">Loading workspace...</div>
      </div>
    )
  }

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return <>{children}</>
}

