import { RefreshCw } from 'lucide-react'

export function PageHeader({ title, subtitle, loading, onRefresh }) {
  return (
    <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
      <div>
        <p className="text-sm text-slate-500">Workspace / {title}</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">{title}</h1>
        <p className="mt-2 max-w-2xl text-slate-500">{subtitle}</p>
      </div>
      <button
        type="button"
        onClick={onRefresh}
        disabled={loading}
        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium shadow-sm hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <RefreshCw size={16} className={loading ? 'animate-spin' : ''} aria-hidden="true" />
        {loading ? 'Refreshing…' : 'Refresh data'}
      </button>
    </header>
  )
}
