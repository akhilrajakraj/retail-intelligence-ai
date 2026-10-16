import { PredictionResult } from './PredictionResult'

const fields = [
  ['frequency', 'Purchase frequency'], ['purchase_lines', 'Purchase lines'],
  ['monetary', 'Total monetary value'], ['average_line_value', 'Average line value'],
  ['unique_products', 'Unique products'], ['average_quantity', 'Average quantity'],
  ['recency_days', 'Recency (days)'], ['average_order_value', 'Average order value'],
]

export function InactivityForm({ customer, updateCustomerField, prediction, predictionError, predicting, handlePrediction, resetForm }) {
  return <section className="rounded-2xl border border-slate-200 bg-white p-6" aria-labelledby="inactivity-form-title">
    <div className="mb-6">
      <p className="text-sm font-semibold text-indigo-600">MACHINE LEARNING</p>
      <h2 id="inactivity-form-title" className="mt-2 text-xl font-semibold">Customer inactivity predictor</h2>
      <p className="mt-2 text-sm text-slate-500">Enter historical customer metrics to estimate the likelihood of no qualifying purchase in the next 90 days.</p>
    </div>
    <form onSubmit={handlePrediction}>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {fields.map(([key, label]) => <label key={key} className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">{label}</span>
          <input type="number" min="0" step="any" required value={customer[key]}
            onChange={(event) => updateCustomerField(key, event.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
        </label>)}
      </div>
      <div className="mt-6 flex flex-wrap gap-3">
        <button type="submit" disabled={predicting} className="rounded-xl bg-indigo-600 px-5 py-3 font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60">
          {predicting ? 'Predicting…' : 'Predict inactivity risk'}
        </button>
        <button type="button" onClick={resetForm} className="rounded-xl border border-slate-200 bg-white px-5 py-3 font-medium text-slate-700 hover:bg-slate-50">Reset values</button>
      </div>
    </form>
    {predictionError && <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700" role="alert">{predictionError}</div>}
    <PredictionResult prediction={prediction} />
  </section>
}
