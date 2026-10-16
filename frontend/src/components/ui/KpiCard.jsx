export function KpiCard({ title, value, detail, icon }) {
  return <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
    <div className="flex items-center justify-between gap-3">
      <p className="text-sm text-slate-500">{title}</p>
      <span className="rounded-xl bg-indigo-50 p-2 text-indigo-600" aria-hidden="true">{icon}</span>
    </div>
    <p className="mt-4 text-3xl font-bold tracking-tight">{value}</p>
    <p className="mt-2 text-xs text-slate-500">{detail}</p>
  </article>
}
