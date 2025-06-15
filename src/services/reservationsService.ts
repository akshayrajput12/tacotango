import { supabase } from '../admin/auth/supabaseClient'

// Type definitions for database
export interface ReservationRow {
  id: string
  customer_name: string
  customer_email: string
  customer_phone: string
  reservation_date: string
  reservation_time: string
  number_of_guests: number
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no_show'
  special_requests: string | null
  dietary_restrictions: string | null
  occasion: string | null
  seating_preference: string | null
  preferred_contact_method: 'email' | 'phone' | 'sms'
  marketing_consent: boolean
  table_number: string | null
  staff_notes: string | null
  confirmation_code: string
  attachment_file_path: string | null
  created_at: string
  updated_at: string
  confirmed_at: string | null
  cancelled_at: string | null
  completed_at: string | null
}

export interface ReservationInsert {
  customer_name: string
  customer_email: string
  customer_phone: string
  reservation_date: string
  reservation_time: string
  number_of_guests: number
  status?: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no_show'
  special_requests?: string | null
  dietary_restrictions?: string | null
  occasion?: string | null
  seating_preference?: string | null
  preferred_contact_method?: 'email' | 'phone' | 'sms'
  marketing_consent?: boolean
  table_number?: string | null
  staff_notes?: string | null
  attachment_file_path?: string | null
}

export interface ReservationUpdate {
  customer_name?: string
  customer_email?: string
  customer_phone?: string
  reservation_date?: string
  reservation_time?: string
  number_of_guests?: number
  status?: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no_show'
  special_requests?: string | null
  dietary_restrictions?: string | null
  occasion?: string | null
  seating_preference?: string | null
  preferred_contact_method?: 'email' | 'phone' | 'sms'
  marketing_consent?: boolean
  table_number?: string | null
  staff_notes?: string | null
  attachment_file_path?: string | null
}

// Unified Reservation interface for the application
export interface Reservation {
  id: string
  customerName: string
  customerEmail: string
  customerPhone: string
  date: string
  time: string
  guests: number
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no_show'
  specialRequests?: string
  dietaryRestrictions?: string
  occasion?: string
  seatingPreference?: string
  preferredContactMethod: 'email' | 'phone' | 'sms'
  marketingConsent: boolean
  tableNumber?: string
  staffNotes?: string
  confirmationCode: string
  attachmentFilePath?: string
  createdAt: string
  updatedAt: string
  confirmedAt?: string
  cancelledAt?: string
  completedAt?: string
}

// Time slot availability interface
export interface TimeSlotAvailability {
  timeSlot: string
  availableCapacity: number
  totalCapacity: number
  isAvailable: boolean
}

// Table availability interface
export interface TableAvailability {
  availableTables: number
  totalCapacity: number
  isAvailable: boolean
}

// Transform database row to application Reservation
const transformReservation = (row: ReservationRow): Reservation => {
  return {
    id: row.id,
    customerName: row.customer_name,
    customerEmail: row.customer_email,
    customerPhone: row.customer_phone,
    date: row.reservation_date,
    time: row.reservation_time,
    guests: row.number_of_guests,
    status: row.status,
    specialRequests: row.special_requests || undefined,
    dietaryRestrictions: row.dietary_restrictions || undefined,
    occasion: row.occasion || undefined,
    seatingPreference: row.seating_preference || undefined,
    preferredContactMethod: row.preferred_contact_method,
    marketingConsent: row.marketing_consent,
    tableNumber: row.table_number || undefined,
    staffNotes: row.staff_notes || undefined,
    confirmationCode: row.confirmation_code,
    attachmentFilePath: row.attachment_file_path || undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    confirmedAt: row.confirmed_at || undefined,
    cancelledAt: row.cancelled_at || undefined,
    completedAt: row.completed_at || undefined
  }
}

// Reservations Service Class
export class ReservationsService {
  
  // =====================================================
  // PUBLIC BOOKING OPERATIONS
  // =====================================================

  /**
   * Create new reservation (public booking form)
   */
  static async createReservation(reservation: Omit<Reservation, 'id' | 'confirmationCode' | 'createdAt' | 'updatedAt' | 'confirmedAt' | 'cancelledAt' | 'completedAt'>): Promise<Reservation> {
    try {
      const insertData: ReservationInsert = {
        customer_name: reservation.customerName,
        customer_email: reservation.customerEmail,
        customer_phone: reservation.customerPhone,
        reservation_date: reservation.date,
        reservation_time: reservation.time,
        number_of_guests: reservation.guests,
        status: reservation.status || 'pending',
        special_requests: reservation.specialRequests || null,
        dietary_restrictions: reservation.dietaryRestrictions || null,
        occasion: reservation.occasion || null,
        seating_preference: reservation.seatingPreference || null,
        preferred_contact_method: reservation.preferredContactMethod || 'email',
        marketing_consent: reservation.marketingConsent || false,
        table_number: reservation.tableNumber || null,
        staff_notes: reservation.staffNotes || null,
        attachment_file_path: reservation.attachmentFilePath || null
      }

      const { data, error } = await supabase
        .from('reservations')
        .insert(insertData)
        .select()
        .single()

      if (error) throw error
      return transformReservation(data)
    } catch (error) {
      console.error('Error creating reservation:', error)
      throw error
    }
  }

  /**
   * Check availability for a specific date/time/guests
   */
  static async checkAvailability(date: string, time: string, guests: number): Promise<TableAvailability> {
    try {
      const { data, error } = await supabase
        .rpc('check_table_availability', {
          check_date: date,
          check_time: time,
          required_guests: guests
        })

      if (error) throw error
      
      const result = data[0] || { available_tables: 0, total_capacity: 0, is_available: false }
      return {
        availableTables: result.available_tables,
        totalCapacity: result.total_capacity,
        isAvailable: result.is_available
      }
    } catch (error) {
      console.error('Error checking availability:', error)
      throw error
    }
  }

  /**
   * Get available time slots for a specific date
   */
  static async getAvailableTimeSlots(date: string): Promise<TimeSlotAvailability[]> {
    try {
      const { data, error } = await supabase
        .rpc('get_available_time_slots', {
          check_date: date
        })

      if (error) throw error
      
      return data.map((slot: any) => ({
        timeSlot: slot.time_slot,
        availableCapacity: slot.available_capacity,
        totalCapacity: slot.total_capacity,
        isAvailable: slot.available_capacity > 0
      }))
    } catch (error) {
      console.error('Error getting available time slots:', error)
      throw error
    }
  }

  /**
   * Find reservation by confirmation code (public lookup)
   */
  static async findByConfirmationCode(confirmationCode: string): Promise<Reservation | null> {
    try {
      const { data, error } = await supabase
        .from('reservations')
        .select('*')
        .eq('confirmation_code', confirmationCode.toUpperCase())
        .single()

      if (error) {
        if (error.code === 'PGRST116') return null // Not found
        throw error
      }
      
      return data ? transformReservation(data) : null
    } catch (error) {
      console.error('Error finding reservation by confirmation code:', error)
      throw error
    }
  }

  // =====================================================
  // ADMIN OPERATIONS
  // =====================================================

  /**
   * Get all reservations for admin (with filtering)
   */
  static async getAllReservations(filters?: {
    status?: string
    date?: string
    searchTerm?: string
  }): Promise<Reservation[]> {
    try {
      let query = supabase
        .from('reservations')
        .select('*')

      if (filters?.status && filters.status !== 'all') {
        query = query.eq('status', filters.status)
      }

      if (filters?.date) {
        query = query.eq('reservation_date', filters.date)
      }

      if (filters?.searchTerm) {
        query = query.or(`customer_name.ilike.%${filters.searchTerm}%,customer_email.ilike.%${filters.searchTerm}%,customer_phone.ilike.%${filters.searchTerm}%`)
      }

      const { data, error } = await query
        .order('reservation_date', { ascending: true })
        .order('reservation_time', { ascending: true })

      if (error) throw error
      return data.map(transformReservation)
    } catch (error) {
      console.error('Error fetching all reservations:', error)
      throw error
    }
  }

  /**
   * Get today's reservations
   */
  static async getTodaysReservations(): Promise<Reservation[]> {
    try {
      const { data, error } = await supabase
        .from('todays_reservations')
        .select('*')

      if (error) throw error
      return data.map(transformReservation)
    } catch (error) {
      console.error('Error fetching today\'s reservations:', error)
      throw error
    }
  }

  /**
   * Get upcoming reservations (next 7 days)
   */
  static async getUpcomingReservations(): Promise<Reservation[]> {
    try {
      const { data, error } = await supabase
        .from('upcoming_reservations')
        .select('*')

      if (error) throw error
      return data.map(transformReservation)
    } catch (error) {
      console.error('Error fetching upcoming reservations:', error)
      throw error
    }
  }

  /**
   * Update existing reservation
   */
  static async updateReservation(id: string, updates: Partial<Omit<Reservation, 'id' | 'confirmationCode' | 'createdAt' | 'updatedAt' | 'confirmedAt' | 'cancelledAt' | 'completedAt'>>): Promise<Reservation> {
    try {
      const updateData: ReservationUpdate = {}
      
      if (updates.customerName !== undefined) updateData.customer_name = updates.customerName
      if (updates.customerEmail !== undefined) updateData.customer_email = updates.customerEmail
      if (updates.customerPhone !== undefined) updateData.customer_phone = updates.customerPhone
      if (updates.date !== undefined) updateData.reservation_date = updates.date
      if (updates.time !== undefined) updateData.reservation_time = updates.time
      if (updates.guests !== undefined) updateData.number_of_guests = updates.guests
      if (updates.status !== undefined) updateData.status = updates.status
      if (updates.specialRequests !== undefined) updateData.special_requests = updates.specialRequests || null
      if (updates.dietaryRestrictions !== undefined) updateData.dietary_restrictions = updates.dietaryRestrictions || null
      if (updates.occasion !== undefined) updateData.occasion = updates.occasion || null
      if (updates.seatingPreference !== undefined) updateData.seating_preference = updates.seatingPreference || null
      if (updates.preferredContactMethod !== undefined) updateData.preferred_contact_method = updates.preferredContactMethod
      if (updates.marketingConsent !== undefined) updateData.marketing_consent = updates.marketingConsent
      if (updates.tableNumber !== undefined) updateData.table_number = updates.tableNumber || null
      if (updates.staffNotes !== undefined) updateData.staff_notes = updates.staffNotes || null
      if (updates.attachmentFilePath !== undefined) updateData.attachment_file_path = updates.attachmentFilePath || null

      const { data, error } = await supabase
        .from('reservations')
        .update(updateData)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return transformReservation(data)
    } catch (error) {
      console.error('Error updating reservation:', error)
      throw error
    }
  }

  /**
   * Delete reservation
   */
  static async deleteReservation(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('reservations')
        .delete()
        .eq('id', id)

      if (error) throw error
    } catch (error) {
      console.error('Error deleting reservation:', error)
      throw error
    }
  }

  /**
   * Delete multiple reservations
   */
  static async deleteReservations(ids: string[]): Promise<void> {
    try {
      const { error } = await supabase
        .from('reservations')
        .delete()
        .in('id', ids)

      if (error) throw error
    } catch (error) {
      console.error('Error deleting reservations:', error)
      throw error
    }
  }

  // =====================================================
  // DOCUMENT UPLOAD OPERATIONS
  // =====================================================

  /**
   * Upload document to Supabase storage
   */
  static async uploadDocument(file: File, reservationId?: string): Promise<string> {
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${reservationId || Date.now()}.${fileExt}`
      const filePath = `reservations/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('reservation-documents')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        })

      if (uploadError) throw uploadError

      return filePath
    } catch (error) {
      console.error('Error uploading reservation document:', error)
      throw error
    }
  }

  /**
   * Delete document from Supabase storage
   */
  static async deleteDocument(filePath: string): Promise<void> {
    try {
      const { error } = await supabase.storage
        .from('reservation-documents')
        .remove([filePath])

      if (error) throw error
    } catch (error) {
      console.error('Error deleting reservation document:', error)
      throw error
    }
  }

  /**
   * Get private URL for uploaded document (admin only)
   */
  static async getDocumentUrl(filePath: string): Promise<string> {
    try {
      const { data, error } = await supabase.storage
        .from('reservation-documents')
        .createSignedUrl(filePath, 3600) // 1 hour expiry

      if (error) throw error
      return data.signedUrl
    } catch (error) {
      console.error('Error getting document URL:', error)
      throw error
    }
  }

  // =====================================================
  // STATISTICS AND ANALYTICS
  // =====================================================

  /**
   * Get reservation statistics
   */
  static async getReservationStats(): Promise<{
    totalReservations: number
    confirmedReservations: number
    pendingReservations: number
    cancelledReservations: number
    completedReservations: number
    noShowReservations: number
    avgPartySize: number
    todaysReservations: number
    upcomingReservations: number
  }> {
    try {
      const { data, error } = await supabase
        .from('reservation_stats')
        .select('*')
        .single()

      if (error) throw error

      return {
        totalReservations: data.total_reservations || 0,
        confirmedReservations: data.confirmed_reservations || 0,
        pendingReservations: data.pending_reservations || 0,
        cancelledReservations: data.cancelled_reservations || 0,
        completedReservations: data.completed_reservations || 0,
        noShowReservations: data.no_show_reservations || 0,
        avgPartySize: parseFloat(data.avg_party_size) || 0,
        todaysReservations: data.todays_reservations || 0,
        upcomingReservations: data.upcoming_reservations || 0
      }
    } catch (error) {
      console.error('Error fetching reservation stats:', error)
      throw error
    }
  }

  /**
   * Get popular time slots
   */
  static async getPopularTimeSlots(): Promise<Array<{
    timeSlot: string
    bookingCount: number
    avgPartySize: number
    confirmedCount: number
  }>> {
    try {
      const { data, error } = await supabase
        .from('popular_time_slots')
        .select('*')

      if (error) throw error

      return data.map((slot: any) => ({
        timeSlot: slot.reservation_time,
        bookingCount: slot.booking_count,
        avgPartySize: parseFloat(slot.avg_party_size),
        confirmedCount: slot.confirmed_count
      }))
    } catch (error) {
      console.error('Error fetching popular time slots:', error)
      throw error
    }
  }
}
