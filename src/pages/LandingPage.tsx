import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { Button } from '../components/ui/Button'

export const LandingPage = () => {
  const { token } = useAuth()

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col">
      <header className="border-b border-slate-800">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary-600 text-white font-semibold">
              VN
            </span>
            <span className="font-semibold">VideoNotes AI</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            {token ? (
              <Link to="/app">
                <Button variant="ghost" className="px-3 py-1 text-xs">
                  Go to dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/login" className="text-slate-300 hover:text-white">
                  Login
                </Link>
                <Link to="/register">
                  <Button className="px-3 py-1 text-xs">Get started</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="mx-auto max-w-6xl px-4 py-16 grid gap-12 lg:grid-cols-[1.3fr,1fr] items-center">
          <div>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
              Turn videos into <span className="text-primary-400">visual notes</span> in minutes.
            </h1>
            <p className="text-slate-300 mb-8 max-w-xl">
              Upload videos or paste YouTube links, then get clean PDF note packs with key frames and transcripts for
              fast review and sharing.
            </p>
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <Link to={token ? '/app/upload' : '/register'}>
                <Button className="text-sm px-5 py-2">Start for free</Button>
              </Link>
              <Link
                to="/login"
                className="text-sm text-slate-300 hover:text-white underline-offset-4 hover:underline"
              >
                Already have an account?
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-3 text-sm text-slate-300">
              <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-3">
                <div className="font-semibold mb-1">Smart frame extraction</div>
                <div>Choose 1s, 3s, or 5s intervals to balance detail vs. file size.</div>
              </div>
              <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-3">
                <div className="font-semibold mb-1">Optional transcripts</div>
                <div>Use AI-powered transcripts with precise timestamps per frame.</div>
              </div>
              <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-3">
                <div className="font-semibold mb-1">PDF exports</div>
                <div>Download polished PDF note packs ready for study or sharing.</div>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-xl">
            <div className="mb-4 text-xs font-medium uppercase tracking-wide text-primary-300">
              How it works
            </div>
            <ol className="space-y-3 text-sm text-slate-200">
              <li>1. Upload a video file or paste a YouTube link.</li>
              <li>2. Choose frame-only or frame + transcript mode.</li>
              <li>3. Select the screenshot interval that fits your needs.</li>
              <li>4. We process the video in the background.</li>
              <li>5. Download your visual notes PDF with key frames and text.</li>
            </ol>
          </div>
        </section>
      </main>
    </div>
  )
}

