import { supabase } from '../admin/auth/supabaseClient'

// Type definitions for database
export interface GalleryImageRow {
  id: string
  title: string
  alt_text: string | null
  description: string | null
  image_url: string | null
  image_file_path: string | null
  category: string
  tags: string[] | null
  featured: boolean
  active: boolean
  sort_order: number
  upload_date: string
  created_at: string
  updated_at: string
}

export interface GalleryImageInsert {
  title: string
  alt_text?: string | null
  description?: string | null
  image_url?: string | null
  image_file_path?: string | null
  category?: string
  tags?: string[] | null
  featured?: boolean
  active?: boolean
  sort_order?: number
  upload_date?: string
}

export interface GalleryImageUpdate {
  title?: string
  alt_text?: string | null
  description?: string | null
  image_url?: string | null
  image_file_path?: string | null
  category?: string
  tags?: string[] | null
  featured?: boolean
  active?: boolean
  sort_order?: number
  upload_date?: string
}

// Unified GalleryImage interface for the application
export interface GalleryImage {
  id: string
  title: string
  alt: string // For public display
  description: string
  url: string // This will be the final image URL
  category: string
  tags: string[]
  featured: boolean
  active: boolean
  sortOrder: number
  uploadDate: string
  createdAt?: string
  updatedAt?: string
}

// Transform database row to application GalleryImage
const transformGalleryImage = (row: GalleryImageRow): GalleryImage => {
  // Determine the image URL - prefer uploaded file over external URL
  let imageUrl = row.image_url || ''
  if (row.image_file_path) {
    imageUrl = `${supabase.supabaseUrl}/storage/v1/object/public/gallery-images/${row.image_file_path}`
  }

  return {
    id: row.id,
    title: row.title,
    alt: row.alt_text || row.title, // Fallback to title if no alt text
    description: row.description || row.title, // Fallback to title if no description
    url: imageUrl,
    category: row.category,
    tags: row.tags || [],
    featured: row.featured,
    active: row.active,
    sortOrder: row.sort_order,
    uploadDate: row.upload_date,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  }
}

// Gallery Service Class
export class GalleryService {
  
  // =====================================================
  // READ OPERATIONS
  // =====================================================

  /**
   * Get all active gallery images for public display
   */
  static async getPublicImages(): Promise<GalleryImage[]> {
    try {
      const { data, error } = await supabase
        .from('gallery_images')
        .select('*')
        .eq('active', true)
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false })

      if (error) throw error
      return data.map(transformGalleryImage)
    } catch (error) {
      console.error('Error fetching public gallery images:', error)
      throw error
    }
  }

  /**
   * Get featured gallery images for home page
   */
  static async getFeaturedImages(): Promise<GalleryImage[]> {
    try {
      const { data, error } = await supabase
        .from('gallery_images')
        .select('*')
        .eq('active', true)
        .eq('featured', true)
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false })

      if (error) throw error
      return data.map(transformGalleryImage)
    } catch (error) {
      console.error('Error fetching featured gallery images:', error)
      throw error
    }
  }

  /**
   * Get images by category
   */
  static async getImagesByCategory(category: string): Promise<GalleryImage[]> {
    try {
      const { data, error } = await supabase
        .from('gallery_images')
        .select('*')
        .eq('category', category)
        .eq('active', true)
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false })

      if (error) throw error
      return data.map(transformGalleryImage)
    } catch (error) {
      console.error('Error fetching gallery images by category:', error)
      throw error
    }
  }

  /**
   * Get all categories with image counts
   */
  static async getCategories(): Promise<{ category: string; count: number }[]> {
    try {
      const { data, error } = await supabase
        .from('gallery_images')
        .select('category')
        .eq('active', true)

      if (error) throw error

      // Count images per category
      const categoryCount = data.reduce((acc, item) => {
        acc[item.category] = (acc[item.category] || 0) + 1
        return acc
      }, {} as Record<string, number>)

      return Object.entries(categoryCount).map(([category, count]) => ({
        category,
        count
      }))
    } catch (error) {
      console.error('Error fetching gallery categories:', error)
      throw error
    }
  }

  /**
   * Get all gallery images for admin (including inactive ones)
   */
  static async getAllImages(): Promise<GalleryImage[]> {
    try {
      const { data, error } = await supabase
        .from('gallery_images')
        .select('*')
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false })

      if (error) throw error
      return data.map(transformGalleryImage)
    } catch (error) {
      console.error('Error fetching all gallery images:', error)
      throw error
    }
  }

  /**
   * Get single gallery image by ID
   */
  static async getImageById(id: string): Promise<GalleryImage | null> {
    try {
      const { data, error } = await supabase
        .from('gallery_images')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      return data ? transformGalleryImage(data) : null
    } catch (error) {
      console.error('Error fetching gallery image by ID:', error)
      throw error
    }
  }

  // =====================================================
  // WRITE OPERATIONS (Admin only)
  // =====================================================

  /**
   * Create new gallery image
   */
  static async createImage(image: Omit<GalleryImage, 'id' | 'createdAt' | 'updatedAt'>): Promise<GalleryImage> {
    try {
      const insertData: GalleryImageInsert = {
        title: image.title,
        alt_text: image.alt,
        description: image.description,
        image_url: image.url.startsWith('http') ? image.url : null,
        image_file_path: !image.url.startsWith('http') ? image.url : null,
        category: image.category,
        tags: image.tags,
        featured: image.featured,
        active: image.active,
        sort_order: image.sortOrder,
        upload_date: image.uploadDate
      }

      const { data, error } = await supabase
        .from('gallery_images')
        .insert(insertData)
        .select()
        .single()

      if (error) throw error
      return transformGalleryImage(data)
    } catch (error) {
      console.error('Error creating gallery image:', error)
      throw error
    }
  }

  /**
   * Update existing gallery image
   */
  static async updateImage(id: string, updates: Partial<Omit<GalleryImage, 'id' | 'createdAt' | 'updatedAt'>>): Promise<GalleryImage> {
    try {
      const updateData: GalleryImageUpdate = {}
      
      if (updates.title !== undefined) updateData.title = updates.title
      if (updates.alt !== undefined) updateData.alt_text = updates.alt
      if (updates.description !== undefined) updateData.description = updates.description
      if (updates.category !== undefined) updateData.category = updates.category
      if (updates.tags !== undefined) updateData.tags = updates.tags
      if (updates.featured !== undefined) updateData.featured = updates.featured
      if (updates.active !== undefined) updateData.active = updates.active
      if (updates.sortOrder !== undefined) updateData.sort_order = updates.sortOrder
      if (updates.uploadDate !== undefined) updateData.upload_date = updates.uploadDate
      
      if (updates.url !== undefined) {
        if (updates.url.startsWith('http')) {
          updateData.image_url = updates.url
          updateData.image_file_path = null
        } else {
          updateData.image_url = null
          updateData.image_file_path = updates.url
        }
      }

      const { data, error } = await supabase
        .from('gallery_images')
        .update(updateData)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return transformGalleryImage(data)
    } catch (error) {
      console.error('Error updating gallery image:', error)
      throw error
    }
  }

  /**
   * Delete gallery image
   */
  static async deleteImage(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('gallery_images')
        .delete()
        .eq('id', id)

      if (error) throw error
    } catch (error) {
      console.error('Error deleting gallery image:', error)
      throw error
    }
  }

  /**
   * Bulk delete gallery images
   */
  static async deleteImages(ids: string[]): Promise<void> {
    try {
      const { error } = await supabase
        .from('gallery_images')
        .delete()
        .in('id', ids)

      if (error) throw error
    } catch (error) {
      console.error('Error bulk deleting gallery images:', error)
      throw error
    }
  }

  // =====================================================
  // IMAGE UPLOAD OPERATIONS
  // =====================================================

  /**
   * Upload image to Supabase storage
   */
  static async uploadImage(file: File, imageId?: string): Promise<string> {
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${imageId || Date.now()}.${fileExt}`
      const filePath = `gallery/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('gallery-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        })

      if (uploadError) throw uploadError

      return filePath
    } catch (error) {
      console.error('Error uploading gallery image:', error)
      throw error
    }
  }

  /**
   * Delete image from Supabase storage
   */
  static async deleteImageFile(filePath: string): Promise<void> {
    try {
      const { error } = await supabase.storage
        .from('gallery-images')
        .remove([filePath])

      if (error) throw error
    } catch (error) {
      console.error('Error deleting gallery image file:', error)
      throw error
    }
  }

  /**
   * Get public URL for uploaded image
   */
  static getImageUrl(filePath: string): string {
    const { data } = supabase.storage
      .from('gallery-images')
      .getPublicUrl(filePath)
    
    return data.publicUrl
  }

  // =====================================================
  // UTILITY OPERATIONS
  // =====================================================

  /**
   * Reorder images within a category
   */
  static async reorderImages(imageIds: string[], category: string): Promise<void> {
    try {
      const updates = imageIds.map((id, index) => ({
        id,
        sort_order: index + 1
      }))

      for (const update of updates) {
        await supabase
          .from('gallery_images')
          .update({ sort_order: update.sort_order })
          .eq('id', update.id)
          .eq('category', category)
      }
    } catch (error) {
      console.error('Error reordering gallery images:', error)
      throw error
    }
  }

  /**
   * Get gallery statistics
   */
  static async getGalleryStats(): Promise<{
    totalImages: number
    featuredImages: number
    categoryCounts: Record<string, number>
    recentUploads: number
  }> {
    try {
      const { data, error } = await supabase
        .from('gallery_images')
        .select('category, featured, upload_date')
        .eq('active', true)

      if (error) throw error

      const totalImages = data.length
      const featuredImages = data.filter(img => img.featured).length
      
      const categoryCounts = data.reduce((acc, img) => {
        acc[img.category] = (acc[img.category] || 0) + 1
        return acc
      }, {} as Record<string, number>)

      // Count recent uploads (last 30 days)
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      const recentUploads = data.filter(img => 
        new Date(img.upload_date) >= thirtyDaysAgo
      ).length

      return {
        totalImages,
        featuredImages,
        categoryCounts,
        recentUploads
      }
    } catch (error) {
      console.error('Error fetching gallery stats:', error)
      throw error
    }
  }
}
