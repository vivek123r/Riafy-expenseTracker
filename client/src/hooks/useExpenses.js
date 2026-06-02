import { useState, useEffect, useCallback } from 'react'
import { api } from '../services/api'

export function useExpenses(filters) {
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      setExpenses(await api.expenses.list(filters))
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [JSON.stringify(filters)]) // eslint-disable-line

  useEffect(() => { load() }, [load])

  return { expenses, loading, error, refetch: load }
}

export function useSummary(month, refreshKey = 0) {
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!month) return
    let cancelled = false
    setLoading(true)
    setError(null)
    api.summary.monthly(month)
      .then(data => { if (!cancelled) setSummary(data) })
      .catch(e => { if (!cancelled) setError(e.message) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [month, refreshKey])

  return { summary, loading, error }
}
