import type { FormEvent } from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../../components/ui/Button'
import { api } from '../../services/api'

type Mode = 'frames' | 'frames+transcript'

export const UploadPage = () => {
  const navigate = useNavigate()
  const [mode, setMode] = useState<Mode>('frames')
  const [interval, setInterval] = useState(3)
  const [sourceType, setSourceType] = useState<'upload' | 'youtube'>('upload')
  const [file, setFile] = useState<File | null>(null)
  const [youtubeUrl, setYoutubeUrl] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)

    if (sourceType === 'upload' && !file) {
      setError('Please select a video file to upload.')
      return
    }
    if (sourceType === 'youtube' && !youtubeUrl) {
      setError('Please paste a YouTube URL.')
      return
    }

    setLoading(true)
    try {
      let jobId: string

      if (sourceType === 'upload') {
        const formData = new FormData()
        formData.append('file', file as File)
        formData.append('mode', mode)
        formData.append('intervalSeconds', String(interval))
        const res = await api.post('/videos/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        jobId = res.data.jobId ?? res.data.id
      } else {
        const res = await api.post('/videos/youtube', {
          youtubeUrl,
          mode,
          intervalSeconds: interval
        })
        jobId = res.data.jobId ?? res.data.id
      }

      navigate(`/app/jobs/${jobId}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create processing job')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold mb-1">New video notes job</h1>
        <p className="text-sm text-slate-400">
          Upload a video or paste a YouTube link, then choose how detailed you want your notes to be.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 rounded-xl border border-slate-800 bg-slate-900/60 p-4">
        <div className="text-sm font-medium mb-1">Source</div>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setSourceType('upload')}
            className={[
              'rounded-lg border px-3 py-2 text-xs text-left',
              sourceType === 'upload'
                ? 'border-primary-500 bg-primary-500/10'
                : 'border-slate-700 bg-slate-900 hover:bg-slate-800'
            ].join(' ')}
          >
            <div className="font-semibold mb-0.5">Upload file</div>
            <div className="text-[11px] text-slate-400">MP4, MOV, MKV up to backend limits.</div>
          </button>
          <button
            type="button"
            onClick={() => setSourceType('youtube')}
            className={[
              'rounded-lg border px-3 py-2 text-xs text-left',
              sourceType === 'youtube'
                ? 'border-primary-500 bg-primary-500/10'
                : 'border-slate-700 bg-slate-900 hover:bg-slate-800'
            ].join(' ')}
          >
            <div className="font-semibold mb-0.5">YouTube link</div>
            <div className="text-[11px] text-slate-400">We&apos;ll download and process it for you.</div>
          </button>
        </div>

        {sourceType === 'upload' ? (
          <div className="space-y-2 text-xs" key="upload-input">
            <label className="block text-sm text-slate-200">Video file</label>
            <input
              type="file"
              accept="video/*"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="block w-full text-xs text-slate-200 file:mr-3 file:rounded-md file:border-0 file:bg-primary-600 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-white hover:file:bg-primary-500"
            />
            <p className="text-[11px] text-slate-500">
              For production, enforce file size and duration limits at the backend.
            </p>
          </div>
        ) : (
          <div className="space-y-2 text-xs" key="youtube-input">
            <label className="block text-sm text-slate-200">YouTube URL</label>
            <input
              type="url"
              required
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-50 placeholder-slate-500 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 text-xs">
            <div className="text-sm text-slate-200">Mode</div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setMode('frames')}
                className={[
                  'flex-1 rounded-lg border px-3 py-2 text-left',
                  mode === 'frames'
                    ? 'border-primary-500 bg-primary-500/10'
                    : 'border-slate-700 bg-slate-900 hover:bg-slate-800'
                ].join(' ')}
              >
                <div className="font-semibold text-xs">Frames only</div>
                <div className="text-[11px] text-slate-400">Lightweight visual summary, no transcript.</div>
              </button>
              <button
                type="button"
                onClick={() => setMode('frames+transcript')}
                className={[
                  'flex-1 rounded-lg border px-3 py-2 text-left',
                  mode === 'frames+transcript'
                    ? 'border-primary-500 bg-primary-500/10'
                    : 'border-slate-700 bg-slate-900 hover:bg-slate-800'
                ].join(' ')}
              >
                <div className="font-semibold text-xs">Frames + transcript</div>
                <div className="text-[11px] text-slate-400">Visuals plus AI-generated text per frame.</div>
              </button>
            </div>
          </div>
          <div className="space-y-2 text-xs">
            <label className="block text-sm text-slate-200">Screenshot interval</label>
            <select
              value={interval}
              onChange={(e) => setInterval(Number(e.target.value))}
              className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-50 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            >
              <option value={1}>Every 1 second (most detailed)</option>
              <option value={3}>Every 3 seconds (balanced)</option>
              <option value={5}>Every 5 seconds (lightweight)</option>
            </select>
            <p className="text-[11px] text-slate-500">
              Short intervals produce more pages and larger PDFs.
            </p>
          </div>
        </div>

        {error && <div className="text-xs text-red-400">{error}</div>}

        <div className="pt-2">
          <Button type="submit" loading={loading}>
            Create job
          </Button>
        </div>
      </form>
    </div>
  )
}

