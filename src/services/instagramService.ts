import { supabase } from '../admin/auth/supabaseClient'

// Type definitions for database
export interface InstagramPostRow {
  id: string
  title: string
  caption: string
  description: string | null
  image_url: string | null
  image_file_path: string | null
  instagram_url: string | null
  hashtags: string[] | null
  scheduled_date: string | null
  status: 'published' | 'scheduled' | 'draft'
  likes: number
  comments: number
  featured: boolean
  active: boolean
  created_at: string
  updated_at: string
}

export interface InstagramPostInsert {
  title: string
  caption: string
  description?: string | null
  image_url?: string | null
  image_file_path?: string | null
  instagram_url?: string | null
  hashtags?: string[] | null
  scheduled_date?: string | null
  status?: 'published' | 'scheduled' | 'draft'
  likes?: number
  comments?: number
  featured?: boolean
  active?: boolean
}

export interface InstagramPostUpdate {
  title?: string
  caption?: string
  description?: string | null
  image_url?: string | null
  image_file_path?: string | null
  instagram_url?: string | null
  hashtags?: string[] | null
  scheduled_date?: string | null
  status?: 'published' | 'scheduled' | 'draft'
  likes?: number
  comments?: number
  featured?: boolean
  active?: boolean
}

// Unified InstagramPost interface for the application
export interface InstagramPost {
  id: string
  title: string
  caption: string
  description: string
  image: string // This will be the final image URL
  instagramUrl: string
  hashtags: string[]
  scheduledDate?: string
  status: 'published' | 'scheduled' | 'draft'
  likes: number
  comments: number
  featured: boolean
  active: boolean
  createdAt?: string
  updatedAt?: string
}

// Transform database row to application InstagramPost
const transformInstagramPost = (row: InstagramPostRow): InstagramPost => {
  // Determine the image URL - prefer uploaded file over external URL
  let imageUrl = row.image_url || ''
  if (row.image_file_path) {
    // Use the service method to get the proper public URL
    imageUrl = InstagramService.getImageUrl(row.image_file_path)
  }

  return {
    id: row.id,
    title: row.title,
    caption: row.caption,
    description: row.description || row.caption, // Fallback to caption if no description
    image: imageUrl,
    instagramUrl: row.instagram_url || '#',
    hashtags: row.hashtags || [],
    scheduledDate: row.scheduled_date || undefined,
    status: row.status,
    likes: row.likes,
    comments: row.comments,
    featured: row.featured,
    active: row.active,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  }
}

// Instagram Service Class
export class InstagramService {
  
  // =====================================================
  // READ OPERATIONS
  // =====================================================

  /**
   * Get all active and published Instagram posts for public display
   */
  static async getPublicPosts(): Promise<InstagramPost[]> {
    try {
      const { data, error } = await supabase
        .from('instagram_posts')
        .select('*')
        .eq('active', true)
        .eq('status', 'published')
        .order('created_at', { ascending: false })

      if (error) throw error
      return data.map(transformInstagramPost)
    } catch (error) {
      console.error('Error fetching public Instagram posts:', error)
      throw error
    }
  }

  /**
   * Get featured Instagram posts for home page carousel
   */
  static async getFeaturedPosts(): Promise<InstagramPost[]> {
    try {
      const { data, error } = await supabase
        .from('instagram_posts')
        .select('*')
        .eq('active', true)
        .eq('status', 'published')
        .eq('featured', true)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data.map(transformInstagramPost)
    } catch (error) {
      console.error('Error fetching featured Instagram posts:', error)
      throw error
    }
  }

  /**
   * Get posts by status
   */
  static async getPostsByStatus(status: 'published' | 'scheduled' | 'draft'): Promise<InstagramPost[]> {
    try {
      const { data, error } = await supabase
        .from('instagram_posts')
        .select('*')
        .eq('status', status)
        .eq('active', true)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data.map(transformInstagramPost)
    } catch (error) {
      console.error('Error fetching Instagram posts by status:', error)
      throw error
    }
  }

  /**
   * Get scheduled posts that are ready to publish
   */
  static async getReadyToPublishPosts(): Promise<InstagramPost[]> {
    try {
      const { data, error } = await supabase
        .from('instagram_posts')
        .select('*')
        .eq('status', 'scheduled')
        .eq('active', true)
        .lte('scheduled_date', new Date().toISOString())
        .order('scheduled_date', { ascending: true })

      if (error) throw error
      return data.map(transformInstagramPost)
    } catch (error) {
      console.error('Error fetching ready to publish posts:', error)
      throw error
    }
  }

  /**
   * Get all Instagram posts for admin (including inactive ones)
   */
  static async getAllPosts(): Promise<InstagramPost[]> {
    try {
      const { data, error } = await supabase
        .from('instagram_posts')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      return data.map(transformInstagramPost)
    } catch (error) {
      console.error('Error fetching all Instagram posts:', error)
      throw error
    }
  }

  /**
   * Get single Instagram post by ID
   */
  static async getPostById(id: string): Promise<InstagramPost | null> {
    try {
      const { data, error } = await supabase
        .from('instagram_posts')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      return data ? transformInstagramPost(data) : null
    } catch (error) {
      console.error('Error fetching Instagram post by ID:', error)
      throw error
    }
  }

  // =====================================================
  // WRITE OPERATIONS (Admin only)
  // =====================================================

  /**
   * Create new Instagram post
   */
  static async createPost(post: Omit<InstagramPost, 'id' | 'createdAt' | 'updatedAt'>): Promise<InstagramPost> {
    try {
      const insertData: InstagramPostInsert = {
        title: post.title,
        caption: post.caption,
        description: post.description,
        image_url: post.image.startsWith('http') ? post.image : null,
        image_file_path: !post.image.startsWith('http') ? post.image : null,
        instagram_url: post.instagramUrl,
        hashtags: post.hashtags,
        scheduled_date: post.scheduledDate && post.scheduledDate.trim() !== '' ? post.scheduledDate : null,
        status: post.status,
        likes: post.likes,
        comments: post.comments,
        featured: post.featured,
        active: post.active
      }

      const { data, error } = await supabase
        .from('instagram_posts')
        .insert(insertData)
        .select()
        .single()

      if (error) throw error
      return transformInstagramPost(data)
    } catch (error) {
      console.error('Error creating Instagram post:', error)
      throw error
    }
  }

  /**
   * Update existing Instagram post
   */
  static async updatePost(id: string, updates: Partial<Omit<InstagramPost, 'id' | 'createdAt' | 'updatedAt'>>): Promise<InstagramPost> {
    try {
      const updateData: InstagramPostUpdate = {}
      
      if (updates.title !== undefined) updateData.title = updates.title
      if (updates.caption !== undefined) updateData.caption = updates.caption
      if (updates.description !== undefined) updateData.description = updates.description
      if (updates.instagramUrl !== undefined) updateData.instagram_url = updates.instagramUrl
      if (updates.hashtags !== undefined) updateData.hashtags = updates.hashtags
      if (updates.scheduledDate !== undefined) updateData.scheduled_date = updates.scheduledDate && updates.scheduledDate.trim() !== '' ? updates.scheduledDate : null
      if (updates.status !== undefined) updateData.status = updates.status
      if (updates.likes !== undefined) updateData.likes = updates.likes
      if (updates.comments !== undefined) updateData.comments = updates.comments
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
        .from('instagram_posts')
        .update(updateData)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return transformInstagramPost(data)
    } catch (error) {
      console.error('Error updating Instagram post:', error)
      throw error
    }
  }

  /**
   * Delete Instagram post
   */
  static async deletePost(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('instagram_posts')
        .delete()
        .eq('id', id)

      if (error) throw error
    } catch (error) {
      console.error('Error deleting Instagram post:', error)
      throw error
    }
  }

  // =====================================================
  // IMAGE UPLOAD OPERATIONS
  // =====================================================

  /**
   * Upload image to Supabase storage
   */
  static async uploadImage(file: File, postId?: string): Promise<string> {
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${postId || Date.now()}.${fileExt}`
      const filePath = `instagram/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('instagram-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        })

      if (uploadError) throw uploadError

      return filePath
    } catch (error) {
      console.error('Error uploading Instagram image:', error)
      throw error
    }
  }

  /**
   * Delete image from Supabase storage
   */
  static async deleteImage(filePath: string): Promise<void> {
    try {
      const { error } = await supabase.storage
        .from('instagram-images')
        .remove([filePath])

      if (error) throw error
    } catch (error) {
      console.error('Error deleting Instagram image:', error)
      throw error
    }
  }

  /**
   * Get public URL for uploaded image
   */
  static getImageUrl(filePath: string): string {
    const { data } = supabase.storage
      .from('instagram-images')
      .getPublicUrl(filePath)
    
    return data.publicUrl
  }

  // =====================================================
  // UTILITY OPERATIONS
  // =====================================================

  /**
   * Publish scheduled posts that are ready
   */
  static async publishScheduledPosts(): Promise<InstagramPost[]> {
    try {
      const readyPosts = await this.getReadyToPublishPosts()
      const publishedPosts: InstagramPost[] = []

      for (const post of readyPosts) {
        const updatedPost = await this.updatePost(post.id, { status: 'published' })
        publishedPosts.push(updatedPost)
      }

      return publishedPosts
    } catch (error) {
      console.error('Error publishing scheduled posts:', error)
      throw error
    }
  }

  /**
   * Get engagement stats
   */
  static async getEngagementStats(): Promise<{
    totalLikes: number
    totalComments: number
    averageLikes: number
    averageComments: number
    totalPosts: number
  }> {
    try {
      const { data, error } = await supabase
        .from('instagram_posts')
        .select('likes, comments')
        .eq('status', 'published')
        .eq('active', true)

      if (error) throw error

      const totalLikes = data.reduce((sum, post) => sum + post.likes, 0)
      const totalComments = data.reduce((sum, post) => sum + post.comments, 0)
      const totalPosts = data.length

      return {
        totalLikes,
        totalComments,
        averageLikes: totalPosts > 0 ? Math.round(totalLikes / totalPosts) : 0,
        averageComments: totalPosts > 0 ? Math.round(totalComments / totalPosts) : 0,
        totalPosts
      }
    } catch (error) {
      console.error('Error fetching engagement stats:', error)
      throw error
    }
  }
}
