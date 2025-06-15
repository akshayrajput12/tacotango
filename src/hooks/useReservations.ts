import { useState, useEffect, useCallback } from 'react'
import { ReservationsService, type Reservation, type TimeSlotAvailability, type TableAvailability } from '../services/reservationsService'

// =====================================================
// PUBLIC HOOKS (for reservation page)
// =====================================================

/**
 * Hook for creating new reservations (public booking form)
 */
export const useCreateReservation = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createReservation = useCallback(async (reservation: Omit<Reservation, 'id' | 'confirmationCode' | 'createdAt' | 'updatedAt' | 'confirmedAt' | 'cancelledAt' | 'completedAt'>) => {
    try {
      setLoading(true)
      setError(null)
      const newReservation = await ReservationsService.createReservation(reservation)
      return newReservation
    } catch (err) {
      console.error('Error creating reservation:', err)
      setError('Failed to create reservation')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    createReservation,
    loading,
    error
  }
}

/**
 * Hook for checking table availability
 */
export const useTableAvailability = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const checkAvailability = useCallback(async (date: string, time: string, guests: number): Promise<TableAvailability | null> => {
    try {
      setLoading(true)
      setError(null)
      const availability = await ReservationsService.checkAvailability(date, time, guests)
      return availability
    } catch (err) {
      console.error('Error checking availability:', err)
      setError('Failed to check availability')
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    checkAvailability,
    loading,
    error
  }
}

/**
 * Hook for getting available time slots for a date
 */
export const useAvailableTimeSlots = (date: string | null) => {
  const [timeSlots, setTimeSlots] = useState<TimeSlotAvailability[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchTimeSlots = useCallback(async (selectedDate: string) => {
    try {
      setLoading(true)
      setError(null)
      const slots = await ReservationsService.getAvailableTimeSlots(selectedDate)
      setTimeSlots(slots)
    } catch (err) {
      console.error('Error fetching time slots:', err)
      setError('Failed to load available time slots')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (date) {
      fetchTimeSlots(date)
    } else {
      setTimeSlots([])
      setError(null)
    }
  }, [date, fetchTimeSlots])

  return {
    timeSlots,
    loading,
    error,
    refetch: date ? () => fetchTimeSlots(date) : () => {}
  }
}

/**
 * Hook for finding reservation by confirmation code
 */
export const useFindReservation = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const findByConfirmationCode = useCallback(async (confirmationCode: string): Promise<Reservation | null> => {
    try {
      setLoading(true)
      setError(null)
      const reservation = await ReservationsService.findByConfirmationCode(confirmationCode)
      return reservation
    } catch (err) {
      console.error('Error finding reservation:', err)
      setError('Failed to find reservation')
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    findByConfirmationCode,
    loading,
    error
  }
}

// =====================================================
// ADMIN HOOKS (for admin panel)
// =====================================================

/**
 * Hook for admin reservations management
 */
export const useAdminReservations = () => {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchReservations = useCallback(async (filters?: {
    status?: string
    date?: string
    searchTerm?: string
  }) => {
    try {
      setLoading(true)
      setError(null)
      const data = await ReservationsService.getAllReservations(filters)
      setReservations(data)
    } catch (err) {
      console.error('Error fetching admin reservations:', err)
      setError('Failed to load reservations')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchReservations()
  }, [fetchReservations])

  // Create new reservation
  const createReservation = useCallback(async (reservation: Omit<Reservation, 'id' | 'confirmationCode' | 'createdAt' | 'updatedAt' | 'confirmedAt' | 'cancelledAt' | 'completedAt'>) => {
    try {
      const newReservation = await ReservationsService.createReservation(reservation)
      setReservations(prev => [newReservation, ...prev])
      return newReservation
    } catch (err) {
      console.error('Error creating reservation:', err)
      throw new Error('Failed to create reservation')
    }
  }, [])

  // Update existing reservation
  const updateReservation = useCallback(async (id: string, updates: Partial<Omit<Reservation, 'id' | 'confirmationCode' | 'createdAt' | 'updatedAt' | 'confirmedAt' | 'cancelledAt' | 'completedAt'>>) => {
    try {
      const updatedReservation = await ReservationsService.updateReservation(id, updates)
      setReservations(prev => prev.map(reservation => reservation.id === id ? updatedReservation : reservation))
      return updatedReservation
    } catch (err) {
      console.error('Error updating reservation:', err)
      throw new Error('Failed to update reservation')
    }
  }, [])

  // Delete reservation
  const deleteReservation = useCallback(async (id: string) => {
    try {
      await ReservationsService.deleteReservation(id)
      setReservations(prev => prev.filter(reservation => reservation.id !== id))
    } catch (err) {
      console.error('Error deleting reservation:', err)
      throw new Error('Failed to delete reservation')
    }
  }, [])

  // Delete multiple reservations
  const deleteReservations = useCallback(async (ids: string[]) => {
    try {
      await ReservationsService.deleteReservations(ids)
      setReservations(prev => prev.filter(reservation => !ids.includes(reservation.id)))
    } catch (err) {
      console.error('Error deleting reservations:', err)
      throw new Error('Failed to delete reservations')
    }
  }, [])

  // Get reservations by status
  const getReservationsByStatus = useCallback((status: string) => {
    if (status === 'all') return reservations
    return reservations.filter(reservation => reservation.status === status)
  }, [reservations])

  // Get reservations by date
  const getReservationsByDate = useCallback((date: string) => {
    return reservations.filter(reservation => reservation.date === date)
  }, [reservations])

  return {
    reservations,
    loading,
    error,
    refetch: fetchReservations,
    createReservation,
    updateReservation,
    deleteReservation,
    deleteReservations,
    getReservationsByStatus,
    getReservationsByDate
  }
}

/**
 * Hook for today's reservations
 */
export const useTodaysReservations = () => {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchReservations = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await ReservationsService.getTodaysReservations()
      setReservations(data)
    } catch (err) {
      console.error('Error fetching today\'s reservations:', err)
      setError('Failed to load today\'s reservations')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchReservations()
  }, [fetchReservations])

  return {
    reservations,
    loading,
    error,
    refetch: fetchReservations
  }
}

/**
 * Hook for upcoming reservations
 */
export const useUpcomingReservations = () => {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchReservations = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await ReservationsService.getUpcomingReservations()
      setReservations(data)
    } catch (err) {
      console.error('Error fetching upcoming reservations:', err)
      setError('Failed to load upcoming reservations')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchReservations()
  }, [fetchReservations])

  return {
    reservations,
    loading,
    error,
    refetch: fetchReservations
  }
}

/**
 * Hook for reservation statistics
 */
export const useReservationStats = () => {
  const [stats, setStats] = useState({
    totalReservations: 0,
    confirmedReservations: 0,
    pendingReservations: 0,
    cancelledReservations: 0,
    completedReservations: 0,
    noShowReservations: 0,
    avgPartySize: 0,
    todaysReservations: 0,
    upcomingReservations: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await ReservationsService.getReservationStats()
      setStats(data)
    } catch (err) {
      console.error('Error fetching reservation stats:', err)
      setError('Failed to load statistics')
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
 * Hook for popular time slots analytics
 */
export const usePopularTimeSlots = () => {
  const [timeSlots, setTimeSlots] = useState<Array<{
    timeSlot: string
    bookingCount: number
    avgPartySize: number
    confirmedCount: number
  }>>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTimeSlots = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await ReservationsService.getPopularTimeSlots()
      setTimeSlots(data)
    } catch (err) {
      console.error('Error fetching popular time slots:', err)
      setError('Failed to load time slot analytics')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTimeSlots()
  }, [fetchTimeSlots])

  return {
    timeSlots,
    loading,
    error,
    refetch: fetchTimeSlots
  }
}

/**
 * Hook for single reservation
 */
export const useReservation = (id: string | null) => {
  const [reservation, setReservation] = useState<Reservation | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchReservation = useCallback(async (reservationId: string) => {
    try {
      setLoading(true)
      setError(null)
      // Note: We would need to add a getById method to the service
      // For now, this is a placeholder
      setReservation(null)
    } catch (err) {
      console.error('Error fetching reservation:', err)
      setError('Failed to load reservation')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (id) {
      fetchReservation(id)
    } else {
      setReservation(null)
      setLoading(false)
      setError(null)
    }
  }, [id, fetchReservation])

  return {
    reservation,
    loading,
    error,
    refetch: id ? () => fetchReservation(id) : () => {}
  }
}
