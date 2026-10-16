import { MetricRow } from '../../../components/ui/MetricRow'

export function ModelPerformance({ modelInfo }) {
  return <section className="rounded-2xl border border-slate-200 bg-white p-6 xl:col-span-2" aria-labelledby="model-performance-title">
    <h2 id="model-performance-title" className="text-lg font-semibold">Model performance</h2>
    <p className="mt-1 text-sm text-slate-500">Inactivity prediction evaluation</p>
    <div className="mt-5 space-y-4">
      <MetricRow label="Validation ROC-AUC" value={modelInfo.validation_metrics.roc_auc} />
      <MetricRow label="Validation average precision" value={modelInfo.validation_metrics.average_precision} />
      <MetricRow label="Test ROC-AUC" value={modelInfo.test_metrics.roc_auc} />
      <MetricRow label="Test precision" value={modelInfo.test_metrics.precision} />
      <MetricRow label="Test recall" value={modelInfo.test_metrics.recall} />
    </div>
    <div className="mt-6 rounded-xl bg-amber-50 p-4 text-sm text-amber-900">
      <p className="font-semibold">Interpret results carefully</p>
      <p className="mt-1">The model predicts 90-day inactivity, not permanent churn. Test precision is about 48.6%, and probability calibration has not been evaluated.</p>
    </div>
  </section>
}
