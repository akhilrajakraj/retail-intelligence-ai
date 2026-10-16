import { RefreshCw } from 'lucide-react'

export function PageHeader({ loading, onRefresh }) {
  return <header id="top" className="mb-8 flex flex-wrap items-center justify-between gap-4">
    <div>
      <p className="text-sm text-slate-500">Workspace / Overview</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight">Retail analytics</h1>
      <p className="mt-2 text-slate-500">Understand customer behavior and purchasing patterns.</p>
    </div>
    <button type="button" onClick={onRefresh} disabled={loading}
      className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium shadow-sm hover:bg-slate-100 disabled:opacity-60">
      <RefreshCw size={16} className={loading ? 'animate-spin' : ''} aria-hidden="true" />Refresh data
    </button>
  </header>
}
