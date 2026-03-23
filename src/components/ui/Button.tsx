import type { ButtonHTMLAttributes } from 'react'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean
  variant?: 'primary' | 'ghost'
}

export const Button = ({ children, loading, disabled, variant = 'primary', className, ...rest }: Props) => {
  const isDisabled = disabled || loading
  const base =
    'inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-950'
  const variants: Record<string, string> = {
    primary:
      'bg-primary-600 text-white hover:bg-primary-500 focus:ring-primary-500 disabled:bg-primary-800 disabled:text-slate-300',
    ghost: 'border border-slate-700 text-slate-100 hover:bg-slate-900 disabled:text-slate-500'
  }

  return (
    <button
      className={[base, variants[variant], className].filter(Boolean).join(' ')}
      disabled={isDisabled}
      {...rest}
    >
      {loading && (
        <span className="mr-2 inline-block h-3 w-3 animate-spin rounded-full border-2 border-slate-200 border-t-transparent" />
      )}
      {children}
    </button>
  )
}

