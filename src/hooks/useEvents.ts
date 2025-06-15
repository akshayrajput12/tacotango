import { useState, useEffect, useCallback } from 'react'
import { EventsService, type Event } from '../services/eventsService'

// Hook for public events data (home page and events page)
export const usePublicEvents = () => {
  const [events, setEvents] = useState<Event[]>([])
  const [featuredEvents, setFeaturedEvents] = useState<Event[]>([])
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const [allEvents, featured, upcoming, cats] = await Promise.all([
        EventsService.getPublicEvents(),
        EventsService.getFeaturedEvents(),
        EventsService.getUpcomingEvents(),
        EventsService.getCategories()
      ])

      setEvents(allEvents)
      setFeaturedEvents(featured)
      setUpcomingEvents(upcoming)
      setCategories(cats)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch events data')
      console.error('Error fetching public events data:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const getEventsByCategory = useCallback((category: string) => {
    return events.filter(event => event.category === category)
  }, [events])

  const getEventsByDateRange = useCallback(async (startDate: string, endDate: string) => {
    try {
      setError(null)
      return await EventsService.getEventsByDateRange(startDate, endDate)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch events by date range')
      throw err
    }
  }, [])

  const refetch = useCallback(() => {
    fetchData()
  }, [fetchData])

  return {
    events,
    featuredEvents,
    upcomingEvents,
    categories,
    loading,
    error,
    getEventsByCategory,
    getEventsByDateRange,
    refetch
  }
}

// Hook for admin events management
export const useAdminEvents = () => {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const allEvents = await EventsService.getAllEvents()
      setEvents(allEvents)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch events')
      console.error('Error fetching admin events data:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchEvents()
  }, [fetchEvents])

  const createEvent = useCallback(async (event: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setError(null)
      const newEvent = await EventsService.createEvent(event)
      setEvents(prev => [newEvent, ...prev])
      return newEvent
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create event'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const updateEvent = useCallback(async (id: string, updates: Partial<Omit<Event, 'id' | 'createdAt' | 'updatedAt'>>) => {
    try {
      setError(null)
      const updatedEvent = await EventsService.updateEvent(id, updates)
      setEvents(prev => prev.map(event => event.id === id ? updatedEvent : event))
      return updatedEvent
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update event'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const deleteEvent = useCallback(async (id: string) => {
    try {
      setError(null)
      await EventsService.deleteEvent(id)
      setEvents(prev => prev.filter(event => event.id !== id))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete event'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const uploadImage = useCallback(async (file: File, eventId?: string) => {
    try {
      setError(null)
      return await EventsService.uploadImage(file, eventId)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload image'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const deleteImage = useCallback(async (filePath: string) => {
    try {
      setError(null)
      await EventsService.deleteImage(filePath)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete image'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const getImageUrl = useCallback((filePath: string) => {
    return EventsService.getImageUrl(filePath)
  }, [])

  const refetch = useCallback(() => {
    fetchEvents()
  }, [fetchEvents])

  const getEventsByStatus = useCallback((status: 'upcoming' | 'ongoing' | 'completed' | 'all') => {
    if (status === 'all') return events
    return events.filter(event => event.status === status)
  }, [events])

  const getEventsByCategory = useCallback((category: string) => {
    return events.filter(event => event.category === category)
  }, [events])

  const getAvailableCategories = useCallback(() => {
    const categories = [...new Set(events.map(event => event.category))]
    return categories.sort()
  }, [events])

  const getAvailableStatuses = useCallback(() => {
    const statuses = [...new Set(events.map(event => event.status))]
    return statuses.sort()
  }, [events])

  return {
    events,
    loading,
    error,
    createEvent,
    updateEvent,
    deleteEvent,
    uploadImage,
    deleteImage,
    getImageUrl,
    refetch,
    getEventsByStatus,
    getEventsByCategory,
    getAvailableCategories,
    getAvailableStatuses
  }
}

// Hook for events by specific category
export const useEventsByCategory = (category: string) => {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCategoryEvents = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const categoryEvents = await EventsService.getEventsByCategory(category)
      setEvents(categoryEvents)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch events')
      console.error('Error fetching events by category:', err)
    } finally {
      setLoading(false)
    }
  }, [category])

  useEffect(() => {
    if (category) {
      fetchCategoryEvents()
    }
  }, [fetchCategoryEvents, category])

  const refetch = useCallback(() => {
    fetchCategoryEvents()
  }, [fetchCategoryEvents])

  return {
    events,
    loading,
    error,
    refetch
  }
}

// Hook for events by date range
export const useEventsByDateRange = (startDate?: string, endDate?: string) => {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchDateRangeEvents = useCallback(async () => {
    if (!startDate || !endDate) return

    try {
      setLoading(true)
      setError(null)
      const rangeEvents = await EventsService.getEventsByDateRange(startDate, endDate)
      setEvents(rangeEvents)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch events')
      console.error('Error fetching events by date range:', err)
    } finally {
      setLoading(false)
    }
  }, [startDate, endDate])

  useEffect(() => {
    fetchDateRangeEvents()
  }, [fetchDateRangeEvents])

  const refetch = useCallback(() => {
    fetchDateRangeEvents()
  }, [fetchDateRangeEvents])

  return {
    events,
    loading,
    error,
    refetch
  }
}
