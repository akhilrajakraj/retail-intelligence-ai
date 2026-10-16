import { fetchJSON } from './client'

export function getModelInfo() {
  return fetchJSON('/api/v1/models/inactivity')
}

export function getModelHealth() {
  return fetchJSON('/api/v1/health/models')
}

export function predictInactivity(customer) {
  return fetchJSON('/api/v1/predict/inactivity', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(customer),
  })
}
