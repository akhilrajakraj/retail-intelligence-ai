export function SmallMetric({ label, value }) {
  return <div className="min-w-0">
    <p className="text-xs text-slate-500">{label}</p>
    <p className="mt-1 break-words text-sm font-semibold">{value}</p>
  </div>
}
