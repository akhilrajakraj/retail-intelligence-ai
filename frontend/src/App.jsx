import { useEffect, useState } from 'react'
import {
  Activity,
  BrainCircuit,
  Users,
  Layers3,
  RefreshCw,
  AlertCircle,
  TrendingUp,
} from 'lucide-react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts'
import {
  getSegments,
  getModelInfo,
  getModelHealth,
  predictInactivity,
} from './api'

const currency = (value) =>
  new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    maximumFractionDigits: 0,
  }).format(Number(value) || 0)

const initialCustomer = {
  frequency: '2',
  purchase_lines: '10',
  monetary: '500',
  average_line_value: '50',
  unique_products: '8',
  average_quantity: '2',
  recency_days: '45',
  average_order_value: '250',
}

function App() {
  const [segments, setSegments] = useState(null)
  const [modelInfo, setModelInfo] = useState(null)
  const [modelHealth, setModelHealth] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  const [customer, setCustomer] = useState(initialCustomer)
  const [prediction, setPrediction] = useState(null)
  const [predictionError, setPredictionError] = useState('')
  const [predicting, setPredicting] = useState(false)

  async function handlePrediction(event) {
    event.preventDefault()
    setPredicting(true)
    setPrediction(null)
    setPredictionError('')

    try {
      const numericCustomer = Object.fromEntries(
        Object.entries(customer).map(([key, value]) => [key, Number(value)])
      )
      const result = await predictInactivity(numericCustomer)
      setPrediction(result)
    } catch (err) {
      setPredictionError(err.message || 'Prediction failed.')
    } finally {
      setPredicting(false)
    }
  }

  async function loadDashboard() {
    setLoading(true)
    setError('')

    try {
      const [segmentData, modelData, healthData] = await Promise.all([
        getSegments(),
        getModelInfo(),
        getModelHealth(),
      ])
      setSegments(segmentData)
      setModelInfo(modelData)
      setModelHealth(healthData)
    } catch (err) {
      setError(err.message || 'Unable to load dashboard data.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDashboard()
  }, [])

  const allModelsHealthy =
    modelHealth &&
    Object.values(modelHealth).length > 0 &&
    Object.values(modelHealth).every(Boolean)

  const chartData =
    segments?.segments.map((segment) => ({
      name: `Segment ${segment.cluster_id}`,
      customers: segment.customer_count,
      segmentName: segment.segment_name,
    })) ?? []

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-slate-200 bg-white p-6 lg:block">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-indigo-600 p-2 text-white">
            <BrainCircuit size={24} />
          </div>
          <div>
            <h1 className="font-bold">Retail Intelligence</h1>
            <p className="text-xs text-slate-500">AI Analytics Platform</p>
          </div>
        </div>

        <p className="mb-3 mt-10 text-xs font-semibold uppercase tracking-wider text-slate-400">
          Workspace
        </p>
        <div className="flex items-center gap-3 rounded-xl bg-indigo-50 px-4 py-3 font-medium text-indigo-700">
          <Activity size={18} />
          Overview
        </div>
        <div className="mt-3 flex items-center gap-3 px-4 py-3 text-slate-500">
          <Users size={18} />
          Customer segments
        </div>
        <div className="mt-3 flex items-center gap-3 px-4 py-3 text-slate-500">
          <TrendingUp size={18} />
          Inactivity model
        </div>

        <div className="absolute bottom-6 left-6 right-6 rounded-xl bg-slate-50 p-4">
          <div className="flex items-center gap-2 text-sm font-medium">
            <span
              className={`h-2 w-2 rounded-full ${
                allModelsHealthy ? 'bg-emerald-500' : 'bg-amber-500'
              }`}
            />
            {allModelsHealthy ? 'Models operational' : 'Checking models'}
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Local development environment
          </p>
        </div>
      </aside>

      <main className="mx-auto max-w-7xl p-5 sm:p-8 lg:ml-64 lg:p-10">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm text-slate-500">Workspace / Overview</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight">
              Retail analytics
            </h2>
            <p className="mt-2 text-slate-500">
              Understand customer behavior and purchasing patterns.
            </p>
          </div>
          <button
            onClick={loadDashboard}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium shadow-sm hover:bg-slate-100 disabled:opacity-60"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            Refresh data
          </button>
        </header>

        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
            <AlertCircle className="mt-0.5" size={20} />
            <div>
              <p className="font-semibold">Could not load dashboard data</p>
              <p className="mt-1 text-sm">{error}</p>
              <p className="mt-1 text-sm">
                Check that the FastAPI server is running on port 8000.
              </p>
            </div>
          </div>
        )}

        {loading && !segments && (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-slate-500">
            Loading customer analytics…
          </div>
        )}

        {segments && modelInfo && (
          <>
            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <KpiCard
                title="Identified customers"
                value={segments.total_customers.toLocaleString()}
                detail="Customers in the RFM analysis"
                icon={<Users size={20} />}
              />
              <KpiCard
                title="Customer segments"
                value={segments.number_of_segments}
                detail="K-Means clustering groups"
                icon={<Layers3 size={20} />}
              />
              <KpiCard
                title="Prediction horizon"
                value={`${modelInfo.prediction_window_days} days`}
                detail="Future inactivity window"
                icon={<Activity size={20} />}
              />
              <KpiCard
                title="Decision threshold"
                value={`${(modelInfo.decision_threshold * 100).toFixed(1)}%`}
                detail="Validation-selected threshold"
                icon={<BrainCircuit size={20} />}
              />
            </section>

            <section className="mt-6 grid gap-6 xl:grid-cols-5">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 xl:col-span-3">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold">Customer distribution</h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Customers assigned to each historical RFM segment.
                  </p>
                </div>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={chartData}
                      margin={{ top: 5, right: 10, left: -15, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                      <YAxis allowDecimals={false} />
                      <Tooltip
                        formatter={(value) => [
                          Number(value).toLocaleString(),
                          'Customers',
                        ]}
                        labelFormatter={(label, payload) =>
                          payload?.[0]?.payload?.segmentName || label
                        }
                      />
                      <Bar
                        dataKey="customers"
                        fill="#4f46e5"
                        radius={[6, 6, 0, 0]}
                        maxBarSize={68}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 xl:col-span-2">
                <h3 className="text-lg font-semibold">Model performance</h3>
                <p className="mt-1 text-sm text-slate-500">
                  Inactivity prediction evaluation
                </p>
                <div className="mt-5 space-y-4">
                  <MetricRow
                    label="Validation ROC-AUC"
                    value={modelInfo.validation_metrics.roc_auc}
                  />
                  <MetricRow
                    label="Validation average precision"
                    value={modelInfo.validation_metrics.average_precision}
                  />
                  <MetricRow
                    label="Test ROC-AUC"
                    value={modelInfo.test_metrics.roc_auc}
                  />
                  <MetricRow
                    label="Test precision"
                    value={modelInfo.test_metrics.precision}
                  />
                  <MetricRow
                    label="Test recall"
                    value={modelInfo.test_metrics.recall}
                  />
                </div>
                <div className="mt-6 rounded-xl bg-amber-50 p-4 text-sm text-amber-900">
                  <p className="font-semibold">Interpret results carefully</p>
                  <p className="mt-1">
                    The model predicts 90-day inactivity, not permanent churn.
                    Test precision is about 48.6%, and probability calibration
                    has not been evaluated.
                  </p>
                </div>
              </div>
            </section>

            {/* Interactive machine-learning prediction form */}
            <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
              <div className="mb-6">
                <p className="text-sm font-semibold text-indigo-600">
                  MACHINE LEARNING
                </p>
                <h3 className="mt-2 text-xl font-semibold">
                  Customer inactivity predictor
                </h3>
                <p className="mt-2 text-sm text-slate-500">
                  Enter historical customer metrics to estimate the likelihood
                  of no qualifying purchase in the next 90 days.
                </p>
              </div>

              <form onSubmit={handlePrediction}>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {[
                    ['frequency', 'Purchase frequency'],
                    ['purchase_lines', 'Purchase lines'],
                    ['monetary', 'Total monetary value'],
                    ['average_line_value', 'Average line value'],
                    ['unique_products', 'Unique products'],
                    ['average_quantity', 'Average quantity'],
                    ['recency_days', 'Recency (days)'],
                    ['average_order_value', 'Average order value'],
                  ].map(([key, label]) => (
                    <label key={key} className="block">
                      <span className="mb-2 block text-sm font-medium text-slate-700">
                        {label}
                      </span>
                      <input
                        type="number"
                        min="0"
                        step="any"
                        required
                        value={customer[key]}
                        onChange={(event) =>
                          setCustomer((previous) => ({
                            ...previous,
                            [key]: event.target.value,
                          }))
                        }
                        className="w-full rounded-xl border border-slate-300 bg-white px-3 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                      />
                    </label>
                  ))}
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    type="submit"
                    disabled={predicting}
                    className="rounded-xl bg-indigo-600 px-5 py-3 font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {predicting ? 'Predicting…' : 'Predict inactivity risk'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCustomer(initialCustomer)
                      setPrediction(null)
                      setPredictionError('')
                    }}
                    className="rounded-xl border border-slate-200 bg-white px-5 py-3 font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Reset values
                  </button>
                </div>
              </form>

              {predictionError && (
                <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                  {predictionError}
                </div>
              )}

              {prediction && (
                <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <p className="text-sm text-slate-500">Prediction result</p>
                  <h4 className="mt-2 text-xl font-bold">
                    {prediction.prediction.risk_label}
                  </h4>
                  <p className="mt-3 text-3xl font-bold text-indigo-700">
                    {(
                      prediction.prediction.inactivity_probability * 100
                    ).toFixed(1)}
                    %
                  </p>
                  <div
                    className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200"
                    role="progressbar"
                    aria-label="Estimated inactivity probability"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={Math.round(
                      prediction.prediction.inactivity_probability * 100
                    )}
                  >
                    <div
                      className="h-full rounded-full bg-indigo-600 transition-all"
                      style={{
                        width: `${
                          prediction.prediction.inactivity_probability * 100
                        }%`,
                      }}
                    />
                  </div>
                  <p className="mt-3 text-sm text-slate-600">
                    Decision threshold:{' '}
                    {(
                      prediction.prediction.decision_threshold * 100
                    ).toFixed(2)}
                    % · {prediction.prediction.prediction_horizon_days}-day
                    horizon
                  </p>
                  <p className="mt-3 text-sm text-slate-500">
                    {prediction.interpretation}
                  </p>
                  <p className="mt-3 text-xs text-slate-500">
                    This is a model estimate, not a guarantee that the customer
                    will become inactive. Model probabilities have not been
                    calibrated.
                  </p>
                </div>
              )}
            </section>

            <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
              <div className="mb-5">
                <h3 className="text-lg font-semibold">
                  Customer segment insights
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Historical purchase behavior over the selected RFM window.
                </p>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {segments.segments.map((segment) => (
                  <article
                    key={segment.cluster_id}
                    className="rounded-xl border border-slate-200 p-5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
                          Segment {segment.cluster_id}
                        </p>
                        <h4 className="mt-2 font-semibold">
                          {segment.segment_name}
                        </h4>
                      </div>
                      <span className="rounded-lg bg-indigo-50 px-3 py-2 text-sm font-semibold text-indigo-700">
                        {segment.customer_percentage}%
                      </span>
                    </div>
                    <p className="mt-4 text-2xl font-bold">
                      {segment.customer_count.toLocaleString()}
                      <span className="ml-2 text-sm font-normal text-slate-500">
                        customers
                      </span>
                    </p>
                    <div className="mt-4 grid grid-cols-3 gap-2 border-t border-slate-100 pt-4">
                      <SmallMetric
                        label="Median recency"
                        value={`${segment.median_recency_days} d`}
                      />
                      <SmallMetric
                        label="Median frequency"
                        value={segment.median_frequency}
                      />
                      <SmallMetric
                        label="Median spend"
                        value={currency(segment.median_monetary)}
                      />
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <footer className="mt-8 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
              <p>Retail Intelligence AI · Model {modelInfo.model_version}</p>
              <p>
                {allModelsHealthy
                  ? 'API connected · Models loaded'
                  : 'API responding · Check model health'}
              </p>
            </footer>
          </>
        )}
      </main>
    </div>
  )
}

function KpiCard({ title, value, detail, icon }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">{title}</p>
        <span className="rounded-xl bg-indigo-50 p-2 text-indigo-600">
          {icon}
        </span>
      </div>
      <p className="mt-4 text-3xl font-bold tracking-tight">{value}</p>
      <p className="mt-2 text-xs text-slate-500">{detail}</p>
    </div>
  )
}

function MetricRow({ label, value }) {
  const percentage = Math.max(0, Math.min(100, Number(value) * 100))

  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3 text-sm">
        <span className="text-slate-600">{label}</span>
        <span className="font-semibold tabular-nums">
          {Number(value).toFixed(3)}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-indigo-600"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

function SmallMetric({ label, value }) {
  return (
    <div className="min-w-0">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 break-words text-sm font-semibold">{value}</p>
    </div>
  )
}

export default App
