import type { InputHTMLAttributes } from 'react'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

export const Input = ({ label, error, className, ...rest }: Props) => {
  return (
    <label className="block text-sm">
      <span className="mb-1 block text-slate-200">{label}</span>
      <input
        className={[
          'w-full rounded-md border bg-slate-900 px-3 py-2 text-sm text-slate-50 placeholder-slate-500',
          'border-slate-700 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500',
          error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : '',
          className
        ]
          .filter(Boolean)
          .join(' ')}
        {...rest}
      />
      {error && <span className="mt-1 block text-xs text-red-400">{error}</span>}
    </label>
  )
}

