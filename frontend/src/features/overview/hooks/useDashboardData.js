import { useCallback, useEffect, useState } from 'react'
import { getModelHealth, getModelInfo } from '../../../services/api/inactivityApi'
import { getSegments } from '../../../services/api/segmentsApi'

export function useDashboardData() {
  const [segments, setSegments] = useState(null)
  const [modelInfo, setModelInfo] = useState(null)
  const [modelHealth, setModelHealth] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const [segmentData, modelData, healthData] = await Promise.all([
        getSegments(), getModelInfo(), getModelHealth(),
      ])
      setSegments(segmentData)
      setModelInfo(modelData)
      setModelHealth(healthData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load dashboard data.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { refresh() }, [refresh])
  return { segments, modelInfo, modelHealth, error, loading, refresh }
}
