import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../services/api'

export interface JobOutput {
  id: string
  pdfUrl: string
  frameCount: number
  createdAt: string
}

export interface Job {
  id: string
  mode: 'frames' | 'frames+transcript'
  intervalSeconds: number
  status: 'pending' | 'processing' | 'completed' | 'failed'
  createdAt: string
  videoId: string
  output?: JobOutput | null
}

export const DashboardPage = () => {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get('/jobs', { params: { limit: 5 } })
        setJobs(res.data.jobs ?? res.data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load recent jobs')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold mb-1">Dashboard</h1>
          <p className="text-sm text-slate-400">
            Start a new job or review your latest video note generations.
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            to="/app/upload"
            className="inline-flex items-center rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-500"
          >
            New job
          </Link>
          <Link
            to="/app/history"
            className="inline-flex items-center rounded-md border border-slate-700 px-4 py-2 text-sm font-medium text-slate-100 hover:bg-slate-900"
          >
            View history
          </Link>
        </div>
      </div>

      <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
        <h2 className="text-sm font-semibold mb-3">Recent jobs</h2>
        {loading && <div className="text-xs text-slate-400">Loading jobs...</div>}
        {error && <div className="text-xs text-red-400">{error}</div>}
        {!loading && !error && jobs.length === 0 && (
          <div className="text-xs text-slate-400">
            No jobs yet.{' '}
            <Link to="/app/upload" className="text-primary-300 hover:text-primary-200">
              Start by uploading a video.
            </Link>
          </div>
        )}
        {!loading && !error && jobs.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full text-xs">
              <thead className="border-b border-slate-800 text-slate-400">
                <tr>
                  <th className="py-2 pr-4 text-left font-medium">Job</th>
                  <th className="py-2 px-4 text-left font-medium">Mode</th>
                  <th className="py-2 px-4 text-left font-medium">Interval</th>
                  <th className="py-2 px-4 text-left font-medium">Status</th>
                  <th className="py-2 pl-4 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr key={job.id} className="border-b border-slate-900/60 last:border-none">
                    <td className="py-2 pr-4">
                      <div className="font-medium text-slate-100">#{job.id.slice(0, 8)}</div>
                      <div className="text-[11px] text-slate-500">
                        {new Date(job.createdAt).toLocaleString()}
                      </div>
                    </td>
                    <td className="py-2 px-4">
                      <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[11px] capitalize">
                        {job.mode === 'frames' ? 'Frames only' : 'Frames + transcript'}
                      </span>
                    </td>
                    <td className="py-2 px-4 text-[11px] text-slate-300">{job.intervalSeconds}s</td>
                    <td className="py-2 px-4">
                      <JobStatusBadge status={job.status} />
                    </td>
                    <td className="py-2 pl-4 text-right">
                      <Link
                        to={`/app/jobs/${job.id}`}
                        className="text-primary-300 hover:text-primary-200 underline-offset-2 hover:underline"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}

export const JobStatusBadge = ({ status }: { status: Job['status'] }) => {
  const base = 'inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium'
  const variants: Record<Job['status'], string> = {
    pending: 'bg-slate-800 text-slate-200',
    processing: 'bg-blue-900/60 text-blue-200',
    completed: 'bg-emerald-900/60 text-emerald-200',
    failed: 'bg-red-900/60 text-red-200'
  }
  const labels: Record<Job['status'], string> = {
    pending: 'Pending',
    processing: 'Processing',
    completed: 'Completed',
    failed: 'Failed'
  }

  return <span className={[base, variants[status]].join(' ')}>{labels[status]}</span>
}

