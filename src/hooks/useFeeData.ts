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
  // Check cache once via useState lazy initializer (no refs needed)
  const [initial] = useState(() => {
    const cached = getFromCache()
    return {
      data: (cached || { water: {}, electricity: {}, gas: {} }) as Record<FeeType, FeeData>,
      hadCache: cached !== null,
    }
  })

  const [data, setData] = useState<Record<FeeType, FeeData>>(initial.data)
  const [loading, setLoading] = useState(!initial.hadCache)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (initial.hadCache) return

    let cancelled = false
    const fetchData = async () => {
      try {
        const [water, electricity, gas] = await Promise.all([
          fetchFeeData('water'),
          fetchFeeData('electricity'),
          fetchFeeData('gas'),
        ])
        if (!cancelled) {
          const newData = { water, electricity, gas }
          setData(newData)
          saveToCache(newData)
          setLoading(false)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error('Failed to fetch data'))
          setLoading(false)
        }
      }
    }
    void fetchData()
    return () => { cancelled = true }
  }, [initial.hadCache])

  const refetch = useCallback(() => {
    localStorage.removeItem(CACHE_KEY)
    setLoading(true)
    setError(null)
    const fetchData = async () => {
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
    }
    void fetchData()
  }, [])

  return { data, loading, error, refetch }
}

