
export async function predictInactivity(customer) {
  const response = await fetch(
    `${API_BASE_URL}/api/v1/predict/inactivity`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(customer),
    }
  )

  const data = await response.json()

  if (!response.ok) {
    const message = Array.isArray(data.detail)
      ? data.detail.map((item) => item.msg).join(', ')
      : data.detail || 'Prediction request failed'

    throw new Error(message)
  }

  return data
}
