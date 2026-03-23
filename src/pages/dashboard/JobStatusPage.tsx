import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api } from '../../services/api'
import type { Job } from './DashboardPage'
import { JobStatusBadge } from './DashboardPage'

type DetailedJob = Job

export const JobStatusPage = () => {
  const { jobId } = useParams<{ jobId: string }>()
  const [job, setJob] = useState<DetailedJob | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!jobId) return
    let timer: number | undefined
    const load = async () => {
      try {
        const res = await api.get(`/jobs/${jobId}`)
        setJob(res.data)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load job')
      } finally {
        setLoading(false)
      }
    }

    load()

    timer = window.setInterval(() => {
      if (job && (job.status === 'completed' || job.status === 'failed')) {
        if (timer) window.clearInterval(timer)
        return
      }
      load()
    }, 5000)

    return () => {
      if (timer) window.clearInterval(timer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobId])

  const handleDownload = () => {
    if (!job || !job.output?.pdfUrl) return
    const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api'
    const origin = apiBase.replace(/\/api\/?$/, '')
    const url = job.output.pdfUrl.startsWith('http')
      ? job.output.pdfUrl
      : `${origin}${job.output.pdfUrl}`
    window.open(url, '_blank')
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold mb-1">Job status</h1>
          <p className="text-sm text-slate-400">
            Track processing progress and download your PDF notes when ready.
          </p>
        </div>
        <Link
          to="/app/history"
          className="text-xs text-slate-300 underline-offset-2 hover:text-slate-100 hover:underline"
        >
          View all jobs
        </Link>
      </div>

      {loading && <div className="text-xs text-slate-400">Loading job details...</div>}
      {error && <div className="text-xs text-red-400">{error}</div>}

      {job && (
        <div className="space-y-4 rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-xs text-slate-400 mb-0.5">Job ID</div>
              <div className="font-mono text-slate-100 text-xs">#{job.id}</div>
            </div>
            <div>
              <div className="text-xs text-slate-400 mb-0.5">Status</div>
              <JobStatusBadge status={job.status} />
            </div>
            <div>
              <div className="text-xs text-slate-400 mb-0.5">Created</div>
              <div className="text-xs text-slate-200">
                {new Date(job.createdAt).toLocaleString()}
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 text-xs">
            <div>
              <div className="text-slate-400 mb-0.5">Mode</div>
              <div className="text-slate-100">
                {job.mode === 'frames' ? 'Frames only' : 'Frames + transcript'}
              </div>
            </div>
            <div>
              <div className="text-slate-400 mb-0.5">Interval</div>
              <div className="text-slate-100">{job.intervalSeconds}s</div>
            </div>
            {job.output && (
              <div>
                <div className="text-slate-400 mb-0.5">Frames in PDF</div>
                <div className="text-slate-100">{job.output.frameCount}</div>
              </div>
            )}
          </div>

          {job.status === 'processing' && (
            <div className="rounded-md border border-blue-500/40 bg-blue-500/10 px-3 py-2 text-xs text-blue-100">
              We&apos;re extracting frames, generating transcripts (if selected), and building your PDF. This may take
              several minutes for long videos.
            </div>
          )}
          {job.status === 'pending' && (
            <div className="rounded-md border border-slate-500/40 bg-slate-800 px-3 py-2 text-xs text-slate-100">
              Your job is queued and will start processing shortly.
            </div>
          )}
          {job.status === 'failed' && (
            <div className="rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-100">
              Processing failed. Please try again with a different video or contact support.
            </div>
          )}

          {job.status === 'completed' && job.output?.pdfUrl && (
            <div className="pt-2">
              <button
                type="button"
                onClick={handleDownload}
                className="inline-flex items-center rounded-md bg-primary-600 px-4 py-2 text-xs font-medium text-white hover:bg-primary-500"
              >
                Download PDF
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

