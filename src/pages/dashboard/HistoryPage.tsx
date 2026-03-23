import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../services/api'
import type { Job } from './DashboardPage'
import { JobStatusBadge } from './DashboardPage'

type HistoryJob = Job

export const HistoryPage = () => {
  const [jobs, setJobs] = useState<HistoryJob[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get('/jobs')
        setJobs(res.data.jobs ?? res.data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load jobs')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const handleDownload = (job: HistoryJob) => {
    if (!job.output?.pdfUrl) return
    const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api'
    const origin = apiBase.replace(/\/api\/?$/, '')
    const url = job.output.pdfUrl.startsWith('http')
      ? job.output.pdfUrl
      : `${origin}${job.output.pdfUrl}`
    window.open(url, '_blank')
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold mb-1">Processing history</h1>
        <p className="text-sm text-slate-400">
          Review all your jobs and re-download PDF exports at any time.
        </p>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-xs">
        {loading && <div className="text-slate-400">Loading jobs...</div>}
        {error && <div className="text-red-400">{error}</div>}
        {!loading && !error && jobs.length === 0 && (
          <div className="text-slate-400">
            No jobs yet.{' '}
            <Link to="/app/upload" className="text-primary-300 hover:text-primary-200">
              Create your first one.
            </Link>
          </div>
        )}
        {!loading && !error && jobs.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="border-b border-slate-800 text-slate-400">
                <tr>
                  <th className="py-2 pr-4 text-left font-medium">Job</th>
                  <th className="py-2 px-4 text-left font-medium">Mode</th>
                  <th className="py-2 px-4 text-left font-medium">Interval</th>
                  <th className="py-2 px-4 text-left font-medium">Status</th>
                  <th className="py-2 px-4 text-left font-medium">Created</th>
                  <th className="py-2 pl-4 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr key={job.id} className="border-b border-slate-900/60 last:border-none">
                    <td className="py-2 pr-4 align-top">
                      <div className="font-mono text-slate-100 text-xs break-all">#{job.id}</div>
                    </td>
                    <td className="py-2 px-4 align-top">
                      <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[11px] capitalize">
                        {job.mode === 'frames' ? 'Frames only' : 'Frames + transcript'}
                      </span>
                    </td>
                    <td className="py-2 px-4 align-top text-slate-200">{job.intervalSeconds}s</td>
                    <td className="py-2 px-4 align-top">
                      <JobStatusBadge status={job.status} />
                    </td>
                    <td className="py-2 px-4 align-top text-slate-200">
                      {new Date(job.createdAt).toLocaleString()}
                    </td>
                    <td className="py-2 pl-4 align-top text-right">
                      <div className="flex justify-end gap-2">
                        <Link
                          to={`/app/jobs/${job.id}`}
                          className="text-primary-300 hover:text-primary-200 underline-offset-2 hover:underline"
                        >
                          View
                        </Link>
                        {job.status === 'completed' && job.output?.pdfUrl && (
                          <button
                            type="button"
                            onClick={() => handleDownload(job)}
                            className="text-emerald-300 hover:text-emerald-200 underline-offset-2 hover:underline"
                          >
                            Download
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

