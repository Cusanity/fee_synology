import { useState, useEffect, useCallback } from 'react'
import { fetchFeeData, type FeeData, type FeeType } from '../services/api'

interface UseFeeDataResult {
  data: Record<FeeType, FeeData>
  loading: boolean
  error: Error | null
  refetch: () => void
}

export function useFeeData(): UseFeeDataResult {
  const [data, setData] = useState<Record<FeeType, FeeData>>({
    water: {},
    electricity: {},
    gas: {},
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchAll = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [water, electricity, gas] = await Promise.all([
        fetchFeeData('water'),
        fetchFeeData('electricity'),
        fetchFeeData('gas'),
      ])
      setData({ water, electricity, gas })
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch data'))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAll()
  }, [fetchAll])

  return { data, loading, error, refetch: fetchAll }
}
