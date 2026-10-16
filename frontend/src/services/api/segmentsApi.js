import { fetchJSON } from './client'

export function getSegments() {
  return fetchJSON('/api/v1/segments')
}
