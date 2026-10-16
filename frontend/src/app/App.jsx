import { useDashboardData } from '../features/overview/hooks/useDashboardData'
import { useInactivityPrediction } from '../features/inactivity/hooks/useInactivityPrediction'
import { AppLayout } from '../components/layout/AppLayout'
import { PageHeader } from '../components/layout/PageHeader'
import { ErrorMessage } from '../components/ui/ErrorMessage'
import { LoadingState } from '../components/ui/LoadingState'
import { OverviewStats } from '../features/overview/components/OverviewStats'
import { ModelPerformance } from '../features/overview/components/ModelPerformance'
import { CustomerDistributionChart } from '../features/segments/components/CustomerDistributionChart'
import { SegmentInsights } from '../features/segments/components/SegmentInsights'
import { InactivityForm } from '../features/inactivity/components/InactivityForm'

export default function App() {
  const { segments, modelInfo, modelHealth, error, loading, refresh } = useDashboardData()
  const prediction = useInactivityPrediction()
  const allModelsHealthy = Boolean(modelHealth) &&
    Object.values(modelHealth).length > 0 && Object.values(modelHealth).every(Boolean)

  return (
    <AppLayout allModelsHealthy={allModelsHealthy}>
      <PageHeader loading={loading} onRefresh={refresh} />
      {error && <ErrorMessage title="Could not load dashboard data" message={error} />}
      {loading && !segments && <LoadingState message="Loading customer analytics…" />}
      {segments && modelInfo && <>
        <OverviewStats segments={segments} modelInfo={modelInfo} />
        <section className="mt-6 grid gap-6 xl:grid-cols-5">
          <CustomerDistributionChart segments={segments} />
          <ModelPerformance modelInfo={modelInfo} />
        </section>
        <section id="inactivity" className="mt-6 scroll-mt-6"><InactivityForm {...prediction} /></section>
        <section id="segments" className="mt-6 scroll-mt-6"><SegmentInsights segments={segments} /></section>
        <footer className="mt-8 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
          <p>Retail Intelligence AI · Model {modelInfo.model_version}</p>
          <p>{allModelsHealthy ? 'API connected · Models loaded' : 'API responding · Check model health'}</p>
        </footer>
      </>}
    </AppLayout>
  )
}
