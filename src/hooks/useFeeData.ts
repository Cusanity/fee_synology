import { useState, useEffect, useCallback, useRef } from 'react'
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
  // Check cache once during initialization
  const initialCache = useRef(getFromCache())
  
  const [data, setData] = useState<Record<FeeType, FeeData>>(
    initialCache.current || { water: {}, electricity: {}, gas: {} }
  )
  const [loading, setLoading] = useState(!initialCache.current)
  const [error, setError] = useState<Error | null>(null)

  const fetchAll = useCallback(async (skipCache = false) => {
    // If we already have cached data from initialization, skip fetch
    if (!skipCache && initialCache.current) {
      initialCache.current = null // Clear so future calls can fetch
      return
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
    initialCache.current = null
    fetchAll(true)
  }, [fetchAll])

  return { data, loading, error, refetch }
}

