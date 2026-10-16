export function PredictionResult({ prediction }) {
  if (!prediction) return null
  const result = prediction.prediction
  const percentage = result.inactivity_probability * 100

  return <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5" aria-live="polite">
    <p className="text-sm text-slate-500">Prediction result</p>
    <h3 className="mt-2 text-xl font-bold">{result.risk_label}</h3>
    <p className="mt-3 text-3xl font-bold text-indigo-700">{percentage.toFixed(1)}%</p>
    <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200" role="progressbar" aria-label="Estimated inactivity probability" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(percentage)}>
      <div className="h-full rounded-full bg-indigo-600 transition-all" style={{ width: String(percentage) + '%' }} />
    </div>
    <p className="mt-3 text-sm text-slate-600">Decision threshold: {(result.decision_threshold * 100).toFixed(2)}% · {result.prediction_horizon_days}-day horizon</p>
    <p className="mt-3 text-sm text-slate-500">{prediction.interpretation}</p>
    <p className="mt-3 text-xs text-slate-500">This is a model estimate, not a guarantee that the customer will become inactive. Model probabilities have not been calibrated.</p>
  </div>
}
