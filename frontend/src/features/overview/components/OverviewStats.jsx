import { Activity, BrainCircuit, Layers3, Users } from 'lucide-react'
import { KpiCard } from '../../../components/ui/KpiCard'

export function OverviewStats({ segments, modelInfo }) {
  return <section aria-label="Overview statistics" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
    <KpiCard title="Identified customers" value={segments.total_customers.toLocaleString()} detail="Customers in the RFM analysis" icon={<Users size={20} />} />
    <KpiCard title="Customer segments" value={segments.number_of_segments} detail="K-Means clustering groups" icon={<Layers3 size={20} />} />
    <KpiCard title="Prediction horizon" value={String(modelInfo.prediction_window_days) + ' days'} detail="Future inactivity window" icon={<Activity size={20} />} />
    <KpiCard title="Decision threshold" value={String((modelInfo.decision_threshold * 100).toFixed(1)) + '%'} detail="Validation-selected threshold" icon={<BrainCircuit size={20} />} />
  </section>
}
