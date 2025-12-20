import { useState, useEffect, useCallback } from 'react'
import { fetchFeeData, type FeeData, type FeeType } from '../services/api'

interface UseFeeDataResult {
  data: Record<FeeType, FeeData>
  loading: boolean
  error: Error | null
  refetch: () => void
}

const CACHE_KEY = 'fee_data_cache'
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

interface CachedData {
  data: Record<FeeType, FeeData>
  timestamp: number
}

function getFromCache(): Record<FeeType, FeeData> | null {
  try {
    const cached = localStorage.getItem(CACHE_KEY)
    if (!cached) return null
    
    const parsed: CachedData = JSON.parse(cached)
    const age = Date.now() - parsed.timestamp
    
    if (age > CACHE_TTL) {
      localStorage.removeItem(CACHE_KEY)
      return null
    }
    
    return parsed.data
  } catch {
    return null
  }
}

function saveToCache(data: Record<FeeType, FeeData>): void {
  try {
    const cached: CachedData = {
      data,
      timestamp: Date.now(),
    }
    localStorage.setItem(CACHE_KEY, JSON.stringify(cached))
  } catch {
    // Ignore storage errors
  }
}

export function useFeeData(): UseFeeDataResult {
  const [data, setData] = useState<Record<FeeType, FeeData>>(() => {
    // Initialize with cached data if available
    return getFromCache() || { water: {}, electricity: {}, gas: {} }
  })
  const [loading, setLoading] = useState(() => !getFromCache())
  const [error, setError] = useState<Error | null>(null)

  const fetchAll = useCallback(async (skipCache = false) => {
    // Check cache first unless explicitly skipping
    if (!skipCache) {
      const cached = getFromCache()
      if (cached) {
        setData(cached)
        setLoading(false)
        return
      }
    }

    setLoading(true)
    setError(null)
    try {
      const [water, electricity, gas] = await Promise.all([
        fetchFeeData('water'),
        fetchFeeData('electricity'),
        fetchFeeData('gas'),
      ])
      const newData = { water, electricity, gas }
      setData(newData)
      saveToCache(newData)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch data'))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAll()
  }, [fetchAll])

  const refetch = useCallback(() => {
    localStorage.removeItem(CACHE_KEY)
    fetchAll(true)
  }, [fetchAll])

  return { data, loading, error, refetch }
}
