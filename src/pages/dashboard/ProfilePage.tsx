import { useAuth } from '../../hooks/useAuth'

export const ProfilePage = () => {
  const { user } = useAuth()

  return (
    <div className="space-y-5 max-w-md">
      <div>
        <h1 className="text-2xl font-semibold mb-1">Profile</h1>
        <p className="text-sm text-slate-400">
          Manage your account details. For security, password changes are handled via the reset flow.
        </p>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-sm">
        {user ? (
          <dl className="space-y-3">
            <div>
              <dt className="text-xs uppercase tracking-wide text-slate-400 mb-0.5">Name</dt>
              <dd className="text-slate-100">{user.name}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-slate-400 mb-0.5">Email</dt>
              <dd className="text-slate-100 break-all">{user.email}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-slate-400 mb-0.5">Email verification</dt>
              <dd className="text-slate-100">
                {user.isVerified ? (
                  <span className="rounded-full bg-emerald-900/60 px-2 py-0.5 text-[11px] text-emerald-200">
                    Verified
                  </span>
                ) : (
                  <span className="rounded-full bg-amber-900/60 px-2 py-0.5 text-[11px] text-amber-200">
                    Pending
                  </span>
                )}
              </dd>
            </div>
          </dl>
        ) : (
          <div className="text-xs text-slate-400">No user loaded.</div>
        )}
      </div>
    </div>
  )
}

