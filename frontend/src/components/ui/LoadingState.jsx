export function LoadingState({ message = 'Loading…' }) {
  return <div className="rounded-2xl border border-slate-200 bg-white p-8 text-slate-500" role="status" aria-live="polite">{message}</div>
}
