import { useState } from 'react'
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

const views = {
  overview: {
    title: 'Retail analytics',
    subtitle: 'Understand customer behavior and purchasing patterns.',
  },
  segments: {
    title: 'Customer segments',
    subtitle: 'Explore customer groups and compare their historical purchase behavior.',
  },
  inactivity: {
    title: 'Inactivity prediction',
    subtitle: 'Estimate the likelihood of a customer making no qualifying purchase in the next 90 days.',
  },
}

export default function App() {
  const [activeView, setActiveView] = useState('overview')
  const {
    segments,
    modelInfo,
    modelHealth,
    error,
    loading,
    refresh,
  } = useDashboardData()
  const prediction = useInactivityPrediction()
  const allModelsHealthy =
    Boolean(modelHealth) &&
    Object.values(modelHealth).length > 0 &&
    Object.values(modelHealth).every(Boolean)

  const page = views[activeView] || views.overview
  const dataReady = Boolean(segments && modelInfo)

  return (
    <AppLayout
      activeView={activeView}
      onNavigate={setActiveView}
      allModelsHealthy={allModelsHealthy}
    >
      <PageHeader
        title={page.title}
        subtitle={page.subtitle}
        loading={loading}
        onRefresh={refresh}
      />

      {error && (
        <ErrorMessage
          title="Could not load dashboard data"
          message={error}
        />
      )}

      {loading && !dataReady && (
        <LoadingState message="Loading customer analytics and model information…" />
      )}

      {!loading && !dataReady && !error && (
        <ErrorMessage
          title="Dashboard data is unavailable"
          message="The API responded without the expected dashboard data. Check the backend logs and API response schemas."
        />
      )}

      {dataReady && activeView === 'overview' && (
        <>
          <OverviewStats segments={segments} modelInfo={modelInfo} />
          <section className="mt-6 grid gap-6 xl:grid-cols-5">
            <CustomerDistributionChart segments={segments} />
            <ModelPerformance modelInfo={modelInfo} />
          </section>
          <section className="mt-6 rounded-2xl border border-indigo-100 bg-indigo-50/70 p-5">
            <h2 className="font-semibold text-slate-900">Explore your data</h2>
            <p className="mt-1 text-sm text-slate-600">
              Open Customer segments to compare groups, or Inactivity prediction to try the live model.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <button type="button" onClick={() => setActiveView('segments')} className="rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-indigo-700 shadow-sm ring-1 ring-indigo-100 hover:bg-indigo-100">
                Explore segments
              </button>
              <button type="button" onClick={() => setActiveView('inactivity')} className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700">
                Try inactivity predictor
              </button>
            </div>
          </section>
        </>
      )}

      {dataReady && activeView === 'segments' && (
        <>
          <section className="mb-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <p className="text-sm text-slate-500">Customers analysed</p>
              <p className="mt-2 text-2xl font-bold">{segments.total_customers.toLocaleString()}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <p className="text-sm text-slate-500">Segments identified</p>
              <p className="mt-2 text-2xl font-bold">{segments.number_of_segments}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <p className="text-sm text-slate-500">Segmentation method</p>
              <p className="mt-2 text-2xl font-bold">K-Means</p>
            </div>
          </section>
          <CustomerDistributionChart segments={segments} />
          <section className="mt-6">
            <SegmentInsights segments={segments} />
          </section>
        </>
      )}

      {dataReady && activeView === 'inactivity' && (
        <>
          <section className="mb-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <p className="text-sm text-slate-500">Observation window</p>
              <p className="mt-2 text-2xl font-bold">{modelInfo.observation_window_days} days</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <p className="text-sm text-slate-500">Prediction horizon</p>
              <p className="mt-2 text-2xl font-bold">{modelInfo.prediction_window_days} days</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <p className="text-sm text-slate-500">Test ROC-AUC</p>
              <p className="mt-2 text-2xl font-bold">{Number(modelInfo.test_metrics.roc_auc).toFixed(3)}</p>
            </div>
          </section>
          <InactivityForm {...prediction} />
          <section className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-950">
            <h2 className="font-semibold">How to interpret the result</h2>
            <p className="mt-2">
              This model estimates a defined 90-day inactivity outcome, not permanent customer churn. Its test precision is approximately 48.6%, and its predicted probabilities have not been calibrated. Use results as a prioritisation signal, not a certainty.
            </p>
          </section>
        </>
      )}

      {dataReady && (
        <footer className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-5 text-xs text-slate-500">
          <p>Retail Intelligence AI · Model {modelInfo.model_version}</p>
          <p>{allModelsHealthy ? 'API connected · Models loaded' : 'API responding · Check model health'}</p>
        </footer>
      )}
    </AppLayout>
  )
}
