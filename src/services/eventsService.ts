import { supabase } from '../admin/auth/supabaseClient'

// Type definitions for database
export interface EventRow {
  id: string
  title: string
  description: string
  date: string
  time: string
  image_url: string | null
  image_file_path: string | null
  status: 'upcoming' | 'ongoing' | 'completed'
  capacity: number
  registered: number
  price: string
  category: string
  type: string | null
  featured: boolean
  active: boolean
  created_at: string
  updated_at: string
}

export interface EventInsert {
  title: string
  description: string
  date: string
  time: string
  image_url?: string | null
  image_file_path?: string | null
  status?: 'upcoming' | 'ongoing' | 'completed'
  capacity?: number
  registered?: number
  price?: string
  category: string
  type?: string | null
  featured?: boolean
  active?: boolean
}

export interface EventUpdate {
  title?: string
  description?: string
  date?: string
  time?: string
  image_url?: string | null
  image_file_path?: string | null
  status?: 'upcoming' | 'ongoing' | 'completed'
  capacity?: number
  registered?: number
  price?: string
  category?: string
  type?: string | null
  featured?: boolean
  active?: boolean
}

// Unified Event interface for the application
export interface Event {
  id: string
  title: string
  description: string
  date: string
  time: string
  image: string // This will be the final image URL
  status: 'upcoming' | 'ongoing' | 'completed'
  capacity: number
  registered: number
  price: string
  category: string
  type: string
  featured: boolean
  active: boolean
  createdAt?: string
  updatedAt?: string
}

// Transform database row to application Event
const transformEvent = (row: EventRow): Event => {
  // Determine the image URL - prefer uploaded file over external URL
  let imageUrl = row.image_url || ''
  if (row.image_file_path) {
    imageUrl = `${supabase.supabaseUrl}/storage/v1/object/public/event-images/${row.image_file_path}`
  }

  return {
    id: row.id,
    title: row.title,
    description: row.description,
    date: row.date,
    time: row.time,
    image: imageUrl,
    status: row.status,
    capacity: row.capacity,
    registered: row.registered,
    price: row.price,
    category: row.category,
    type: row.type || row.category, // Fallback to category if type is null
    featured: row.featured,
    active: row.active,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  }
}

// Events Service Class
export class EventsService {
  
  // =====================================================
  // READ OPERATIONS
  // =====================================================

  /**
   * Get all active events for public display
   */
  static async getPublicEvents(): Promise<Event[]> {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('active', true)
        .order('date', { ascending: true })

      if (error) throw error
      return data.map(transformEvent)
    } catch (error) {
      console.error('Error fetching public events:', error)
      throw error
    }
  }

  /**
   * Get featured events for home page
   */
  static async getFeaturedEvents(): Promise<Event[]> {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('active', true)
        .eq('featured', true)
        .order('date', { ascending: true })

      if (error) throw error
      return data.map(transformEvent)
    } catch (error) {
      console.error('Error fetching featured events:', error)
      throw error
    }
  }

  /**
   * Get upcoming events
   */
  static async getUpcomingEvents(): Promise<Event[]> {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('active', true)
        .eq('status', 'upcoming')
        .order('date', { ascending: true })

      if (error) throw error
      return data.map(transformEvent)
    } catch (error) {
      console.error('Error fetching upcoming events:', error)
      throw error
    }
  }

  /**
   * Get events by category
   */
  static async getEventsByCategory(category: string): Promise<Event[]> {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('category', category)
        .eq('active', true)
        .order('date', { ascending: true })

      if (error) throw error
      return data.map(transformEvent)
    } catch (error) {
      console.error('Error fetching events by category:', error)
      throw error
    }
  }

  /**
   * Get events by date range
   */
  static async getEventsByDateRange(startDate: string, endDate: string): Promise<Event[]> {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('active', true)
        .gte('date', startDate)
        .lte('date', endDate)
        .order('date', { ascending: true })

      if (error) throw error
      return data.map(transformEvent)
    } catch (error) {
      console.error('Error fetching events by date range:', error)
      throw error
    }
  }

  /**
   * Get all events for admin (including inactive ones)
   */
  static async getAllEvents(): Promise<Event[]> {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      return data.map(transformEvent)
    } catch (error) {
      console.error('Error fetching all events:', error)
      throw error
    }
  }

  /**
   * Get single event by ID
   */
  static async getEventById(id: string): Promise<Event | null> {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      return data ? transformEvent(data) : null
    } catch (error) {
      console.error('Error fetching event by ID:', error)
      throw error
    }
  }

  /**
   * Get unique categories
   */
  static async getCategories(): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('category')
        .eq('active', true)

      if (error) throw error
      
      const categories = [...new Set(data.map(item => item.category))]
      return categories.sort()
    } catch (error) {
      console.error('Error fetching categories:', error)
      throw error
    }
  }

  // =====================================================
  // WRITE OPERATIONS (Admin only)
  // =====================================================

  /**
   * Create new event
   */
  static async createEvent(event: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>): Promise<Event> {
    try {
      const insertData: EventInsert = {
        title: event.title,
        description: event.description,
        date: event.date,
        time: event.time,
        image_url: event.image.startsWith('http') ? event.image : null,
        image_file_path: !event.image.startsWith('http') ? event.image : null,
        status: event.status,
        capacity: event.capacity,
        registered: event.registered,
        price: event.price,
        category: event.category,
        type: event.type,
        featured: event.featured,
        active: event.active
      }

      const { data, error } = await supabase
        .from('events')
        .insert(insertData)
        .select()
        .single()

      if (error) throw error
      return transformEvent(data)
    } catch (error) {
      console.error('Error creating event:', error)
      throw error
    }
  }

  /**
   * Update existing event
   */
  static async updateEvent(id: string, updates: Partial<Omit<Event, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Event> {
    try {
      const updateData: EventUpdate = {}
      
      if (updates.title !== undefined) updateData.title = updates.title
      if (updates.description !== undefined) updateData.description = updates.description
      if (updates.date !== undefined) updateData.date = updates.date
      if (updates.time !== undefined) updateData.time = updates.time
      if (updates.status !== undefined) updateData.status = updates.status
      if (updates.capacity !== undefined) updateData.capacity = updates.capacity
      if (updates.registered !== undefined) updateData.registered = updates.registered
      if (updates.price !== undefined) updateData.price = updates.price
      if (updates.category !== undefined) updateData.category = updates.category
      if (updates.type !== undefined) updateData.type = updates.type
      if (updates.featured !== undefined) updateData.featured = updates.featured
      if (updates.active !== undefined) updateData.active = updates.active
      
      if (updates.image !== undefined) {
        if (updates.image.startsWith('http')) {
          updateData.image_url = updates.image
          updateData.image_file_path = null
        } else {
          updateData.image_url = null
          updateData.image_file_path = updates.image
        }
      }

      const { data, error } = await supabase
        .from('events')
        .update(updateData)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return transformEvent(data)
    } catch (error) {
      console.error('Error updating event:', error)
      throw error
    }
  }

  /**
   * Delete event
   */
  static async deleteEvent(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id)

      if (error) throw error
    } catch (error) {
      console.error('Error deleting event:', error)
      throw error
    }
  }

  // =====================================================
  // IMAGE UPLOAD OPERATIONS
  // =====================================================

  /**
   * Upload image to Supabase storage
   */
  static async uploadImage(file: File, eventId?: string): Promise<string> {
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${eventId || Date.now()}.${fileExt}`
      const filePath = `events/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('event-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        })

      if (uploadError) throw uploadError

      return filePath
    } catch (error) {
      console.error('Error uploading event image:', error)
      throw error
    }
  }

  /**
   * Delete image from Supabase storage
   */
  static async deleteImage(filePath: string): Promise<void> {
    try {
      const { error } = await supabase.storage
        .from('event-images')
        .remove([filePath])

      if (error) throw error
    } catch (error) {
      console.error('Error deleting event image:', error)
      throw error
    }
  }

  /**
   * Get public URL for uploaded image
   */
  static getImageUrl(filePath: string): string {
    const { data } = supabase.storage
      .from('event-images')
      .getPublicUrl(filePath)
    
    return data.publicUrl
  }
}
