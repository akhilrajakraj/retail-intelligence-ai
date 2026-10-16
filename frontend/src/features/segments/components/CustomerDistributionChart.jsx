import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

export function CustomerDistributionChart({ segments }) {
  const chartData = segments.segments.map((segment) => ({
    name: 'Segment ' + segment.cluster_id,
    customers: segment.customer_count,
    segmentName: segment.segment_name,
  }))
  return <section className="rounded-2xl border border-slate-200 bg-white p-6 xl:col-span-3" aria-labelledby="customer-distribution-title">
    <div className="mb-6">
      <h2 id="customer-distribution-title" className="text-lg font-semibold">Customer distribution</h2>
      <p className="mt-1 text-sm text-slate-500">Customers assigned to each historical RFM segment.</p>
    </div>
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 5, right: 10, left: -15, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} /><YAxis allowDecimals={false} />
          <Tooltip formatter={(value) => [Number(value).toLocaleString(), 'Customers']} labelFormatter={(label, payload) => payload?.[0]?.payload?.segmentName || label} />
          <Bar dataKey="customers" fill="#4f46e5" radius={[6, 6, 0, 0]} maxBarSize={68} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </section>
}
