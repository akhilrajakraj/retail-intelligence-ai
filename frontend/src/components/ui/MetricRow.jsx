export function MetricRow({ label, value }) {
  const numericValue = Number(value)
  const percentage = Math.max(0, Math.min(100, numericValue * 100))
  return <div>
    <div className="mb-2 flex items-center justify-between gap-3 text-sm">
      <span className="text-slate-600">{label}</span><span className="font-semibold tabular-nums">{numericValue.toFixed(3)}</span>
    </div>
    <div className="h-2 overflow-hidden rounded-full bg-slate-100" role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(percentage)}>
      <div className="h-full rounded-full bg-indigo-600" style={{ width: String(percentage) + '%' }} />
    </div>
  </div>
}
