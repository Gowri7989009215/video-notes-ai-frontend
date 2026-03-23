import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

const navItems = [
  { to: '/app', label: 'Dashboard' },
  { to: '/app/upload', label: 'Upload' },
  { to: '/app/history', label: 'History' },
  { to: '/app/profile', label: 'Profile' }
]

export const DashboardLayout = () => {
  const { user, logout } = useAuth()
  const location = useLocation()

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col">
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <Link to="/app" className="flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600 text-white font-semibold">
              VN
            </span>
            <span className="font-semibold">VideoNotes AI</span>
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  [
                    'px-2 py-1 rounded-md transition-colors',
                    isActive
                      ? 'bg-primary-600 text-white'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  ].join(' ')
                }
                end={item.to === '/app'}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="flex items-center gap-3 text-sm">
            {user && (
              <div className="text-right hidden sm:block">
                <div className="font-medium">{user.name}</div>
                <div className="text-xs text-slate-400">{user.email}</div>
              </div>
            )}
            <button
              onClick={logout}
              className="text-xs px-3 py-1 rounded-md border border-slate-700 hover:border-slate-500 hover:bg-slate-900"
            >
              Logout
            </button>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-6">
          <Outlet />
        </div>
      </main>
      <footer className="border-t border-slate-800 py-4 text-xs text-center text-slate-500">
        {location.pathname.startsWith('/app') ? 'Secure workspace for your video notes.' : 'VideoNotes AI'}
      </footer>
    </div>
  )
}

