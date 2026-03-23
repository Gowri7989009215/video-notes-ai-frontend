import { Link, Outlet } from 'react-router-dom'

export const AuthLayout = () => {
  return (
    <div className="min-h-screen flex bg-slate-950 text-slate-50">
      <div className="hidden lg:flex flex-1 items-center justify-center bg-gradient-to-br from-primary-700 via-slate-900 to-slate-950">
        <div className="max-w-md px-10">
          <h1 className="text-4xl font-bold mb-4">VideoNotes AI</h1>
          <p className="text-slate-100/80 mb-6">
            Turn long videos into concise, visual PDFs with key frames and transcripts. Perfect for study notes,
            meeting summaries, and content research.
          </p>
          <ul className="space-y-2 text-sm text-slate-100/80">
            <li>• Smart frame extraction with configurable intervals</li>
            <li>• Optional AI-powered transcripts with timestamps</li>
            <li>• Downloadable, shareable PDF note packs</li>
          </ul>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center justify-between">
            <Link to="/" className="inline-flex items-center gap-2">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary-600 text-white font-semibold">
                VN
              </span>
              <span className="text-lg font-semibold">VideoNotes AI</span>
            </Link>
            <Link to="/login" className="text-sm text-slate-300 hover:text-white">
              Back to login
            </Link>
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  )
}

