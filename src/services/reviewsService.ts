import { supabase } from '../admin/auth/supabaseClient'

// Type definitions for database
export interface ReviewRow {
  id: string
  customer_name: string
  customer_email: string | null
  review_text: string
  rating: number
  status: 'pending' | 'approved' | 'rejected'
  admin_notes: string | null
  moderated_by: string | null
  moderated_at: string | null
  featured: boolean
  display_order: number
  ip_address: string | null
  user_agent: string | null
  created_at: string
  updated_at: string
}

export interface ReviewInsert {
  customer_name: string
  customer_email?: string | null
  review_text: string
  rating: number
  status?: 'pending' | 'approved' | 'rejected'
  admin_notes?: string | null
  featured?: boolean
  display_order?: number
  ip_address?: string | null
  user_agent?: string | null
}

export interface ReviewUpdate {
  customer_name?: string
  customer_email?: string | null
  review_text?: string
  rating?: number
  status?: 'pending' | 'approved' | 'rejected'
  admin_notes?: string | null
  featured?: boolean
  display_order?: number
}

// Unified Review interface for the application
export interface Review {
  id: string
  customerName: string
  customerEmail?: string
  reviewText: string
  rating: number
  status: 'pending' | 'approved' | 'rejected'
  adminNotes?: string
  moderatedBy?: string
  moderatedAt?: string
  featured: boolean
  displayOrder: number
  createdAt: string
  updatedAt: string
  // Avatar properties (computed)
  avatarInitials: string
  avatarColor: string
}

// Avatar generation utilities
export const generateAvatarInitials = (name: string): string => {
  const words = name.trim().split(' ').filter(Boolean)
  if (words.length === 0) return 'U'
  if (words.length === 1) return words[0][0].toUpperCase()
  return (words[0][0] + words[words.length - 1][0]).toUpperCase()
}

export const generateAvatarColor = (name: string): string => {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
    '#F8C471', '#82E0AA', '#F1948A', '#85C1E9', '#D7BDE2'
  ]
  
  const firstChar = name.trim()[0]?.toUpperCase() || 'U'
  const charCode = firstChar.charCodeAt(0)
  return colors[charCode % colors.length]
}

// Transform database row to application Review
const transformReview = (row: ReviewRow): Review => {
  return {
    id: row.id,
    customerName: row.customer_name,
    customerEmail: row.customer_email || undefined,
    reviewText: row.review_text,
    rating: row.rating,
    status: row.status,
    adminNotes: row.admin_notes || undefined,
    moderatedBy: row.moderated_by || undefined,
    moderatedAt: row.moderated_at || undefined,
    featured: row.featured,
    displayOrder: row.display_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    // Generate avatar properties
    avatarInitials: generateAvatarInitials(row.customer_name),
    avatarColor: generateAvatarColor(row.customer_name)
  }
}

// Reviews Service Class
export class ReviewsService {
  
  // =====================================================
  // PUBLIC OPERATIONS (for website visitors)
  // =====================================================

  /**
   * Get approved reviews for public display
   */
  static async getApprovedReviews(): Promise<Review[]> {
    try {
      const { data, error } = await supabase
        .from('customer_reviews')
        .select('*')
        .eq('status', 'approved')
        .order('featured', { ascending: false })
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false })

      if (error) throw error
      return data.map(transformReview)
    } catch (error) {
      console.error('Error fetching approved reviews:', error)
      throw error
    }
  }

  /**
   * Get featured reviews for homepage
   */
  static async getFeaturedReviews(): Promise<Review[]> {
    try {
      const { data, error } = await supabase
        .from('customer_reviews')
        .select('*')
        .eq('status', 'approved')
        .eq('featured', true)
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false })
        .limit(6) // Limit for homepage display

      if (error) throw error
      return data.map(transformReview)
    } catch (error) {
      console.error('Error fetching featured reviews:', error)
      throw error
    }
  }

  /**
   * Submit new review (public form)
   */
  static async submitReview(review: {
    customerName: string
    customerEmail?: string
    reviewText: string
    rating: number
  }): Promise<Review> {
    try {
      // Get client info for spam prevention
      const userAgent = navigator.userAgent
      
      const insertData: ReviewInsert = {
        customer_name: review.customerName,
        customer_email: review.customerEmail || null,
        review_text: review.reviewText,
        rating: review.rating,
        status: 'pending', // All public submissions start as pending
        user_agent: userAgent
      }

      const { data, error } = await supabase
        .from('customer_reviews')
        .insert(insertData)
        .select()
        .single()

      if (error) throw error
      return transformReview(data)
    } catch (error) {
      console.error('Error submitting review:', error)
      throw error
    }
  }

  // =====================================================
  // ADMIN OPERATIONS
  // =====================================================

  /**
   * Get all reviews for admin management
   */
  static async getAllReviews(filters?: {
    status?: string
    searchTerm?: string
  }): Promise<Review[]> {
    try {
      let query = supabase
        .from('customer_reviews')
        .select('*')

      if (filters?.status && filters.status !== 'all') {
        query = query.eq('status', filters.status)
      }

      if (filters?.searchTerm) {
        query = query.or(`customer_name.ilike.%${filters.searchTerm}%,review_text.ilike.%${filters.searchTerm}%`)
      }

      const { data, error } = await query
        .order('created_at', { ascending: false })

      if (error) throw error
      return data.map(transformReview)
    } catch (error) {
      console.error('Error fetching all reviews:', error)
      throw error
    }
  }

  /**
   * Create new review (admin)
   */
  static async createReview(review: Omit<Review, 'id' | 'createdAt' | 'updatedAt' | 'avatarInitials' | 'avatarColor' | 'moderatedBy' | 'moderatedAt'>): Promise<Review> {
    try {
      const insertData: ReviewInsert = {
        customer_name: review.customerName,
        customer_email: review.customerEmail || null,
        review_text: review.reviewText,
        rating: review.rating,
        status: review.status || 'approved',
        admin_notes: review.adminNotes || null,
        featured: review.featured || false,
        display_order: review.displayOrder || 0
      }

      const { data, error } = await supabase
        .from('customer_reviews')
        .insert(insertData)
        .select()
        .single()

      if (error) throw error
      return transformReview(data)
    } catch (error) {
      console.error('Error creating review:', error)
      throw error
    }
  }

  /**
   * Update existing review
   */
  static async updateReview(id: string, updates: Partial<Omit<Review, 'id' | 'createdAt' | 'updatedAt' | 'avatarInitials' | 'avatarColor'>>): Promise<Review> {
    try {
      const updateData: ReviewUpdate = {}
      
      if (updates.customerName !== undefined) updateData.customer_name = updates.customerName
      if (updates.customerEmail !== undefined) updateData.customer_email = updates.customerEmail || null
      if (updates.reviewText !== undefined) updateData.review_text = updates.reviewText
      if (updates.rating !== undefined) updateData.rating = updates.rating
      if (updates.status !== undefined) updateData.status = updates.status
      if (updates.adminNotes !== undefined) updateData.admin_notes = updates.adminNotes || null
      if (updates.featured !== undefined) updateData.featured = updates.featured
      if (updates.displayOrder !== undefined) updateData.display_order = updates.displayOrder

      const { data, error } = await supabase
        .from('customer_reviews')
        .update(updateData)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return transformReview(data)
    } catch (error) {
      console.error('Error updating review:', error)
      throw error
    }
  }

  /**
   * Delete review
   */
  static async deleteReview(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('customer_reviews')
        .delete()
        .eq('id', id)

      if (error) throw error
    } catch (error) {
      console.error('Error deleting review:', error)
      throw error
    }
  }

  /**
   * Delete multiple reviews
   */
  static async deleteReviews(ids: string[]): Promise<void> {
    try {
      const { error } = await supabase
        .from('customer_reviews')
        .delete()
        .in('id', ids)

      if (error) throw error
    } catch (error) {
      console.error('Error deleting reviews:', error)
      throw error
    }
  }

  /**
   * Approve review
   */
  static async approveReview(id: string): Promise<Review> {
    return this.updateReview(id, { status: 'approved' })
  }

  /**
   * Reject review
   */
  static async rejectReview(id: string, adminNotes?: string): Promise<Review> {
    return this.updateReview(id, { status: 'rejected', adminNotes })
  }

  /**
   * Toggle featured status
   */
  static async toggleFeatured(id: string, featured: boolean): Promise<Review> {
    return this.updateReview(id, { featured })
  }

  // =====================================================
  // STATISTICS AND ANALYTICS
  // =====================================================

  /**
   * Get review statistics
   */
  static async getReviewStats(): Promise<{
    totalReviews: number
    approvedReviews: number
    pendingReviews: number
    rejectedReviews: number
    averageRating: number
    featuredReviews: number
    recentReviews: number
  }> {
    try {
      const { data, error } = await supabase
        .from('review_stats')
        .select('*')
        .single()

      if (error) throw error

      return {
        totalReviews: data.total_reviews || 0,
        approvedReviews: data.approved_reviews || 0,
        pendingReviews: data.pending_reviews || 0,
        rejectedReviews: data.rejected_reviews || 0,
        averageRating: parseFloat(data.average_rating) || 0,
        featuredReviews: data.featured_reviews || 0,
        recentReviews: data.recent_reviews || 0
      }
    } catch (error) {
      console.error('Error fetching review stats:', error)
      throw error
    }
  }

  /**
   * Get rating distribution
   */
  static async getRatingDistribution(): Promise<Array<{
    rating: number
    count: number
    percentage: number
  }>> {
    try {
      const { data, error } = await supabase
        .from('rating_distribution')
        .select('*')

      if (error) throw error

      return data.map((item: any) => ({
        rating: item.rating,
        count: item.count,
        percentage: parseFloat(item.percentage)
      }))
    } catch (error) {
      console.error('Error fetching rating distribution:', error)
      throw error
    }
  }
}
