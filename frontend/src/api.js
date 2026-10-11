
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'

async function fetchJSON(path, options = {}) {
  let response

  try {
    response = await fetch(`${API_BASE_URL}${path}`, options)
  } catch {
    throw new Error(
      'Cannot connect to the API. Make sure the FastAPI backend is running on http://127.0.0.1:8000.'
    )
  }

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    const message = Array.isArray(data.detail)
      ? data.detail.map((item) => item.msg).join(', ')
      : data.detail || `API request failed (${response.status})`

    throw new Error(message)
  }

  return data
}

export function getSegments() {
  return fetchJSON('/api/v1/segments')
}

export function getModelInfo() {
  return fetchJSON('/api/v1/models/inactivity')
}

export function getModelHealth() {
  return fetchJSON('/api/v1/health/models')
}

export function predictInactivity(customer) {
  return fetchJSON('/api/v1/predict/inactivity', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(customer),
  })
}
