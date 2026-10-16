const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'

export async function fetchJSON(path, options = {}) {
  let response
  try {
    response = await fetch(API_BASE_URL + path, options)
  } catch {
    throw new Error('Cannot connect to the API. Make sure the FastAPI backend is running on http://127.0.0.1:8000.')
  }
  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    const message = Array.isArray(data.detail)
      ? data.detail.map((item) => item.msg).join(', ')
      : data.detail || 'API request failed (' + response.status + ')'
    throw new Error(message)
  }
  return data
}
