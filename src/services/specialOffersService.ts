import { supabase } from '../admin/auth/supabaseClient'

// Type definitions for database
export interface SpecialOfferRow {
  id: string
  title: string
  description: string
  discount: string
  image_url: string | null
  image_file_path: string | null
  timing: string | null
  valid_from: string
  valid_until: string
  terms: string[] | null
  popular_items: string[] | null
  bg_color: string
  border_color: string
  text_color: string
  button_color: string
  featured: boolean
  active: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export interface SpecialOfferInsert {
  title: string
  description: string
  discount: string
  image_url?: string | null
  image_file_path?: string | null
  timing?: string | null
  valid_from: string
  valid_until: string
  terms?: string[] | null
  popular_items?: string[] | null
  bg_color?: string
  border_color?: string
  text_color?: string
  button_color?: string
  featured?: boolean
  active?: boolean
  sort_order?: number
}

export interface SpecialOfferUpdate {
  title?: string
  description?: string
  discount?: string
  image_url?: string | null
  image_file_path?: string | null
  timing?: string | null
  valid_from?: string
  valid_until?: string
  terms?: string[] | null
  popular_items?: string[] | null
  bg_color?: string
  border_color?: string
  text_color?: string
  button_color?: string
  featured?: boolean
  active?: boolean
  sort_order?: number
}

// Unified SpecialOffer interface for the application
export interface SpecialOffer {
  id: string
  title: string
  description: string
  discount: string
  image: string // This will be the final image URL
  timing: string
  validFrom: string
  validUntil: string
  terms: string[]
  popularItems: string[]
  bgColor: string
  borderColor: string
  textColor: string
  buttonColor: string
  featured: boolean
  active: boolean
  sortOrder: number
  createdAt?: string
  updatedAt?: string
  // Computed properties
  isExpired?: boolean
  isValid?: boolean
  details?: {
    timing: string
    discount: string
    validUntil: string
    terms: string[]
    popularItems: string[]
  }
}

// Transform database row to application SpecialOffer
const transformSpecialOffer = (row: SpecialOfferRow): SpecialOffer => {
  // Determine the image URL - prefer uploaded file over external URL
  let imageUrl = row.image_url || ''
  if (row.image_file_path) {
    imageUrl = `${supabase.supabaseUrl}/storage/v1/object/public/offer-images/${row.image_file_path}`
  }

  const isExpired = new Date(row.valid_until) < new Date()
  const isValid = new Date() >= new Date(row.valid_from) && new Date() <= new Date(row.valid_until)

  return {
    id: row.id,
    title: row.title,
    description: row.description,
    discount: row.discount,
    image: imageUrl,
    timing: row.timing || '',
    validFrom: row.valid_from,
    validUntil: row.valid_until,
    terms: row.terms || [],
    popularItems: row.popular_items || [],
    bgColor: row.bg_color,
    borderColor: row.border_color,
    textColor: row.text_color,
    buttonColor: row.button_color,
    featured: row.featured,
    active: row.active,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    isExpired,
    isValid,
    details: {
      timing: row.timing || '',
      discount: row.discount,
      validUntil: row.valid_until,
      terms: row.terms || [],
      popularItems: row.popular_items || []
    }
  }
}

// Special Offers Service Class
export class SpecialOffersService {
  
  // =====================================================
  // READ OPERATIONS
  // =====================================================

  /**
   * Get all active special offers for public display
   */
  static async getPublicOffers(): Promise<SpecialOffer[]> {
    try {
      const { data, error } = await supabase
        .from('special_offers')
        .select('*')
        .eq('active', true)
        .gte('valid_until', new Date().toISOString().split('T')[0])
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false })

      if (error) throw error
      return data.map(transformSpecialOffer)
    } catch (error) {
      console.error('Error fetching public special offers:', error)
      throw error
    }
  }

  /**
   * Get featured special offers for events page
   */
  static async getFeaturedOffers(): Promise<SpecialOffer[]> {
    try {
      const { data, error } = await supabase
        .from('special_offers')
        .select('*')
        .eq('active', true)
        .eq('featured', true)
        .gte('valid_until', new Date().toISOString().split('T')[0])
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false })

      if (error) throw error
      return data.map(transformSpecialOffer)
    } catch (error) {
      console.error('Error fetching featured special offers:', error)
      throw error
    }
  }

  /**
   * Get offers by status
   */
  static async getOffersByStatus(status: 'active' | 'inactive' | 'expired'): Promise<SpecialOffer[]> {
    try {
      let query = supabase.from('special_offers').select('*')

      switch (status) {
        case 'active':
          query = query.eq('active', true).gte('valid_until', new Date().toISOString().split('T')[0])
          break
        case 'inactive':
          query = query.eq('active', false)
          break
        case 'expired':
          query = query.lt('valid_until', new Date().toISOString().split('T')[0])
          break
      }

      const { data, error } = await query
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false })

      if (error) throw error
      return data.map(transformSpecialOffer)
    } catch (error) {
      console.error('Error fetching special offers by status:', error)
      throw error
    }
  }

  /**
   * Get all special offers for admin (including inactive and expired ones)
   */
  static async getAllOffers(): Promise<SpecialOffer[]> {
    try {
      const { data, error } = await supabase
        .from('special_offers')
        .select('*')
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false })

      if (error) throw error
      return data.map(transformSpecialOffer)
    } catch (error) {
      console.error('Error fetching all special offers:', error)
      throw error
    }
  }

  /**
   * Get single special offer by ID
   */
  static async getOfferById(id: string): Promise<SpecialOffer | null> {
    try {
      const { data, error } = await supabase
        .from('special_offers')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      return data ? transformSpecialOffer(data) : null
    } catch (error) {
      console.error('Error fetching special offer by ID:', error)
      throw error
    }
  }

  // =====================================================
  // WRITE OPERATIONS (Admin only)
  // =====================================================

  /**
   * Create new special offer
   */
  static async createOffer(offer: Omit<SpecialOffer, 'id' | 'createdAt' | 'updatedAt' | 'isExpired' | 'isValid' | 'details'>): Promise<SpecialOffer> {
    try {
      const insertData: SpecialOfferInsert = {
        title: offer.title,
        description: offer.description,
        discount: offer.discount,
        image_url: offer.image.startsWith('http') ? offer.image : null,
        image_file_path: !offer.image.startsWith('http') ? offer.image : null,
        timing: offer.timing,
        valid_from: offer.validFrom,
        valid_until: offer.validUntil,
        terms: offer.terms,
        popular_items: offer.popularItems,
        bg_color: offer.bgColor,
        border_color: offer.borderColor,
        text_color: offer.textColor,
        button_color: offer.buttonColor,
        featured: offer.featured,
        active: offer.active,
        sort_order: offer.sortOrder
      }

      const { data, error } = await supabase
        .from('special_offers')
        .insert(insertData)
        .select()
        .single()

      if (error) throw error
      return transformSpecialOffer(data)
    } catch (error) {
      console.error('Error creating special offer:', error)
      throw error
    }
  }

  /**
   * Update existing special offer
   */
  static async updateOffer(id: string, updates: Partial<Omit<SpecialOffer, 'id' | 'createdAt' | 'updatedAt' | 'isExpired' | 'isValid' | 'details'>>): Promise<SpecialOffer> {
    try {
      const updateData: SpecialOfferUpdate = {}
      
      if (updates.title !== undefined) updateData.title = updates.title
      if (updates.description !== undefined) updateData.description = updates.description
      if (updates.discount !== undefined) updateData.discount = updates.discount
      if (updates.timing !== undefined) updateData.timing = updates.timing
      if (updates.validFrom !== undefined) updateData.valid_from = updates.validFrom
      if (updates.validUntil !== undefined) updateData.valid_until = updates.validUntil
      if (updates.terms !== undefined) updateData.terms = updates.terms
      if (updates.popularItems !== undefined) updateData.popular_items = updates.popularItems
      if (updates.bgColor !== undefined) updateData.bg_color = updates.bgColor
      if (updates.borderColor !== undefined) updateData.border_color = updates.borderColor
      if (updates.textColor !== undefined) updateData.text_color = updates.textColor
      if (updates.buttonColor !== undefined) updateData.button_color = updates.buttonColor
      if (updates.featured !== undefined) updateData.featured = updates.featured
      if (updates.active !== undefined) updateData.active = updates.active
      if (updates.sortOrder !== undefined) updateData.sort_order = updates.sortOrder
      
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
        .from('special_offers')
        .update(updateData)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return transformSpecialOffer(data)
    } catch (error) {
      console.error('Error updating special offer:', error)
      throw error
    }
  }

  /**
   * Delete special offer
   */
  static async deleteOffer(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('special_offers')
        .delete()
        .eq('id', id)

      if (error) throw error
    } catch (error) {
      console.error('Error deleting special offer:', error)
      throw error
    }
  }

  /**
   * Delete multiple special offers
   */
  static async deleteOffers(ids: string[]): Promise<void> {
    try {
      const { error } = await supabase
        .from('special_offers')
        .delete()
        .in('id', ids)

      if (error) throw error
    } catch (error) {
      console.error('Error deleting special offers:', error)
      throw error
    }
  }

  // =====================================================
  // IMAGE UPLOAD OPERATIONS
  // =====================================================

  /**
   * Upload image to Supabase storage
   */
  static async uploadImage(file: File, offerId?: string): Promise<string> {
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${offerId || Date.now()}.${fileExt}`
      const filePath = `offers/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('offer-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        })

      if (uploadError) throw uploadError

      return filePath
    } catch (error) {
      console.error('Error uploading offer image:', error)
      throw error
    }
  }

  /**
   * Delete image from Supabase storage
   */
  static async deleteImage(filePath: string): Promise<void> {
    try {
      const { error } = await supabase.storage
        .from('offer-images')
        .remove([filePath])

      if (error) throw error
    } catch (error) {
      console.error('Error deleting offer image:', error)
      throw error
    }
  }

  /**
   * Get public URL for uploaded image
   */
  static getImageUrl(filePath: string): string {
    const { data } = supabase.storage
      .from('offer-images')
      .getPublicUrl(filePath)
    
    return data.publicUrl
  }

  // =====================================================
  // UTILITY OPERATIONS
  // =====================================================

  /**
   * Get offers expiring soon (within 7 days)
   */
  static async getExpiringSoonOffers(): Promise<SpecialOffer[]> {
    try {
      const sevenDaysFromNow = new Date()
      sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7)

      const { data, error } = await supabase
        .from('special_offers')
        .select('*')
        .eq('active', true)
        .gte('valid_until', new Date().toISOString().split('T')[0])
        .lte('valid_until', sevenDaysFromNow.toISOString().split('T')[0])
        .order('valid_until', { ascending: true })

      if (error) throw error
      return data.map(transformSpecialOffer)
    } catch (error) {
      console.error('Error fetching expiring soon offers:', error)
      throw error
    }
  }

  /**
   * Get offers statistics
   */
  static async getOffersStats(): Promise<{
    totalOffers: number
    activeOffers: number
    expiredOffers: number
    featuredOffers: number
    expiringSoon: number
  }> {
    try {
      const { data, error } = await supabase
        .from('special_offers')
        .select('active, featured, valid_until')

      if (error) throw error

      const today = new Date().toISOString().split('T')[0]
      const sevenDaysFromNow = new Date()
      sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7)
      const sevenDaysFromNowStr = sevenDaysFromNow.toISOString().split('T')[0]

      const totalOffers = data.length
      const activeOffers = data.filter(offer => offer.active && offer.valid_until >= today).length
      const expiredOffers = data.filter(offer => offer.valid_until < today).length
      const featuredOffers = data.filter(offer => offer.featured && offer.active && offer.valid_until >= today).length
      const expiringSoon = data.filter(offer => 
        offer.active && 
        offer.valid_until >= today && 
        offer.valid_until <= sevenDaysFromNowStr
      ).length

      return {
        totalOffers,
        activeOffers,
        expiredOffers,
        featuredOffers,
        expiringSoon
      }
    } catch (error) {
      console.error('Error fetching offers stats:', error)
      throw error
    }
  }
}
