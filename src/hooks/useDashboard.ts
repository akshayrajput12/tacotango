import { useState, useEffect, useCallback } from 'react'
import { DashboardService, type DashboardStats, type RecentActivity, type QuickActionData } from '../services/dashboardService'

/**
 * Hook for dashboard statistics
 */
export const useDashboardStats = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await DashboardService.getDashboardStats()
      setStats(data)
    } catch (err) {
      console.error('Error fetching dashboard stats:', err)
      setError('Failed to load dashboard statistics')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  return {
    stats,
    loading,
    error,
    refetch: fetchStats
  }
}

/**
 * Hook for recent activity
 */
export const useRecentActivity = () => {
  const [activity, setActivity] = useState<RecentActivity | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchActivity = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await DashboardService.getRecentActivity()
      setActivity(data)
    } catch (err) {
      console.error('Error fetching recent activity:', err)
      setError('Failed to load recent activity')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchActivity()
  }, [fetchActivity])

  return {
    activity,
    loading,
    error,
    refetch: fetchActivity
  }
}

/**
 * Hook for quick action data (badges and notifications)
 */
export const useQuickActionData = () => {
  const [data, setData] = useState<QuickActionData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const actionData = await DashboardService.getQuickActionData()
      setData(actionData)
    } catch (err) {
      console.error('Error fetching quick action data:', err)
      setError('Failed to load quick action data')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return {
    data,
    loading,
    error,
    refetch: fetchData
  }
}

/**
 * Hook for sidebar quick overview
 */
export const useQuickOverview = () => {
  const [overview, setOverview] = useState<{
    activeEvents: number
    menuItems: number
    pendingReservations: number
    totalReviews: number
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchOverview = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await DashboardService.getQuickOverview()
      setOverview(data)
    } catch (err) {
      console.error('Error fetching quick overview:', err)
      setError('Failed to load quick overview')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchOverview()
  }, [fetchOverview])

  return {
    overview,
    loading,
    error,
    refetch: fetchOverview
  }
}

/**
 * Combined dashboard hook for complete dashboard data
 */
export const useDashboard = () => {
  const statsHook = useDashboardStats()
  const activityHook = useRecentActivity()
  const quickActionHook = useQuickActionData()

  const loading = statsHook.loading || activityHook.loading || quickActionHook.loading
  const error = statsHook.error || activityHook.error || quickActionHook.error

  const refetchAll = useCallback(() => {
    statsHook.refetch()
    activityHook.refetch()
    quickActionHook.refetch()
  }, [statsHook, activityHook, quickActionHook])

  return {
    stats: statsHook.stats,
    activity: activityHook.activity,
    quickActionData: quickActionHook.data,
    loading,
    error,
    refetch: refetchAll
  }
}
