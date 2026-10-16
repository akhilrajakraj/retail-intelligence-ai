import { AlertCircle } from 'lucide-react'

export function ErrorMessage({ title = 'Something went wrong', message }) {
  return <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700" role="alert">
    <AlertCircle className="mt-0.5 shrink-0" size={20} aria-hidden="true" />
    <div><p className="font-semibold">{title}</p><p className="mt-1 text-sm">{message}</p>
      <p className="mt-1 text-sm">Check that the FastAPI server is running on port 8000.</p>
    </div>
  </div>
}
