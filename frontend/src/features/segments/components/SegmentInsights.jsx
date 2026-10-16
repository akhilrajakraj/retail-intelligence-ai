import { SmallMetric } from '../../../components/ui/SmallMetric'
import { formatCurrency } from '../../../utils/formatCurrency'

export function SegmentInsights({ segments }) {
  return <section className="rounded-2xl border border-slate-200 bg-white p-6" aria-labelledby="segment-insights-title">
    <div className="mb-5">
      <h2 id="segment-insights-title" className="text-lg font-semibold">Customer segment insights</h2>
      <p className="mt-1 text-sm text-slate-500">Historical purchase behavior over the selected RFM window.</p>
    </div>
    <div className="grid gap-4 md:grid-cols-2">
      {segments.segments.map((segment) => <article key={segment.cluster_id} className="rounded-xl border border-slate-200 p-5">
        <div className="flex items-start justify-between gap-3">
          <div><p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">Segment {segment.cluster_id}</p><h3 className="mt-2 font-semibold">{segment.segment_name}</h3></div>
          <span className="rounded-lg bg-indigo-50 px-3 py-2 text-sm font-semibold text-indigo-700">{segment.customer_percentage}%</span>
        </div>
        <p className="mt-4 text-2xl font-bold">{segment.customer_count.toLocaleString()}<span className="ml-2 text-sm font-normal text-slate-500">customers</span></p>
        <div className="mt-4 grid grid-cols-3 gap-2 border-t border-slate-100 pt-4">
          <SmallMetric label="Median recency" value={String(segment.median_recency_days) + ' d'} />
          <SmallMetric label="Median frequency" value={segment.median_frequency} />
          <SmallMetric label="Median spend" value={formatCurrency(segment.median_monetary)} />
        </div>
      </article>)}
    </div>
  </section>
}
