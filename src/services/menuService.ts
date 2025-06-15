import { supabase, type Database } from '../admin/auth/supabaseClient'

// Type definitions
export type MenuItemRow = Database['public']['Tables']['menu_items']['Row']
export type MenuItemInsert = Database['public']['Tables']['menu_items']['Insert']
export type MenuItemUpdate = Database['public']['Tables']['menu_items']['Update']

// Unified MenuItem interface for the application
export interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  category: string
  image: string // This will be the final image URL (either image_url or constructed storage URL)
  available: boolean
  featured: boolean
  ingredients: string[]
  prepTime: string
  calories: number
  rating: number
  createdAt?: string
  updatedAt?: string
}

// Transform database row to application MenuItem
const transformMenuItem = (row: MenuItemRow): MenuItem => {
  // Determine the image URL - prefer uploaded file over external URL
  let imageUrl = row.image_url || ''
  if (row.image_file_path) {
    imageUrl = `${supabase.supabaseUrl}/storage/v1/object/public/menu-images/${row.image_file_path}`
  }

  return {
    id: row.id,
    name: row.name,
    description: row.description,
    price: row.price,
    category: row.category,
    image: imageUrl,
    available: row.available,
    featured: row.featured,
    ingredients: row.ingredients || [],
    prepTime: row.prep_time || '5 mins',
    calories: row.calories || 0,
    rating: row.rating || 4.0,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  }
}

// Menu Service Class
export class MenuService {
  
  // =====================================================
  // READ OPERATIONS
  // =====================================================

  /**
   * Get all available menu items for public display
   */
  static async getPublicMenuItems(): Promise<MenuItem[]> {
    try {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .eq('available', true)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data.map(transformMenuItem)
    } catch (error) {
      console.error('Error fetching public menu items:', error)
      throw error
    }
  }

  /**
   * Get featured menu items for home page carousel
   */
  static async getFeaturedMenuItems(): Promise<MenuItem[]> {
    try {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .eq('available', true)
        .eq('featured', true)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data.map(transformMenuItem)
    } catch (error) {
      console.error('Error fetching featured menu items:', error)
      throw error
    }
  }

  /**
   * Get menu items by category
   */
  static async getMenuItemsByCategory(category: string): Promise<MenuItem[]> {
    try {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .eq('category', category)
        .eq('available', true)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data.map(transformMenuItem)
    } catch (error) {
      console.error('Error fetching menu items by category:', error)
      throw error
    }
  }

  /**
   * Get all menu items for admin (including unavailable ones)
   */
  static async getAllMenuItems(): Promise<MenuItem[]> {
    try {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      return data.map(transformMenuItem)
    } catch (error) {
      console.error('Error fetching all menu items:', error)
      throw error
    }
  }

  /**
   * Get single menu item by ID
   */
  static async getMenuItemById(id: string): Promise<MenuItem | null> {
    try {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      return data ? transformMenuItem(data) : null
    } catch (error) {
      console.error('Error fetching menu item by ID:', error)
      throw error
    }
  }

  /**
   * Get unique categories
   */
  static async getCategories(): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from('menu_items')
        .select('category')
        .eq('available', true)

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
   * Create new menu item
   */
  static async createMenuItem(menuItem: Omit<MenuItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<MenuItem> {
    try {
      const insertData: MenuItemInsert = {
        name: menuItem.name,
        description: menuItem.description,
        price: menuItem.price,
        category: menuItem.category,
        image_url: menuItem.image.startsWith('http') ? menuItem.image : null,
        image_file_path: !menuItem.image.startsWith('http') ? menuItem.image : null,
        available: menuItem.available,
        featured: menuItem.featured,
        ingredients: menuItem.ingredients,
        prep_time: menuItem.prepTime,
        calories: menuItem.calories,
        rating: menuItem.rating
      }

      const { data, error } = await supabase
        .from('menu_items')
        .insert(insertData)
        .select()
        .single()

      if (error) throw error
      return transformMenuItem(data)
    } catch (error) {
      console.error('Error creating menu item:', error)
      throw error
    }
  }

  /**
   * Update existing menu item
   */
  static async updateMenuItem(id: string, updates: Partial<Omit<MenuItem, 'id' | 'createdAt' | 'updatedAt'>>): Promise<MenuItem> {
    try {
      const updateData: MenuItemUpdate = {}
      
      if (updates.name !== undefined) updateData.name = updates.name
      if (updates.description !== undefined) updateData.description = updates.description
      if (updates.price !== undefined) updateData.price = updates.price
      if (updates.category !== undefined) updateData.category = updates.category
      if (updates.available !== undefined) updateData.available = updates.available
      if (updates.featured !== undefined) updateData.featured = updates.featured
      if (updates.ingredients !== undefined) updateData.ingredients = updates.ingredients
      if (updates.prepTime !== undefined) updateData.prep_time = updates.prepTime
      if (updates.calories !== undefined) updateData.calories = updates.calories
      if (updates.rating !== undefined) updateData.rating = updates.rating
      
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
        .from('menu_items')
        .update(updateData)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return transformMenuItem(data)
    } catch (error) {
      console.error('Error updating menu item:', error)
      throw error
    }
  }

  /**
   * Delete menu item
   */
  static async deleteMenuItem(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('menu_items')
        .delete()
        .eq('id', id)

      if (error) throw error
    } catch (error) {
      console.error('Error deleting menu item:', error)
      throw error
    }
  }

  // =====================================================
  // IMAGE UPLOAD OPERATIONS
  // =====================================================

  /**
   * Upload image to Supabase storage
   */
  static async uploadImage(file: File, menuItemId?: string): Promise<string> {
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${menuItemId || Date.now()}.${fileExt}`
      const filePath = `menu/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('menu-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        })

      if (uploadError) throw uploadError

      return filePath
    } catch (error) {
      console.error('Error uploading image:', error)
      throw error
    }
  }

  /**
   * Delete image from Supabase storage
   */
  static async deleteImage(filePath: string): Promise<void> {
    try {
      const { error } = await supabase.storage
        .from('menu-images')
        .remove([filePath])

      if (error) throw error
    } catch (error) {
      console.error('Error deleting image:', error)
      throw error
    }
  }

  /**
   * Get public URL for uploaded image
   */
  static getImageUrl(filePath: string): string {
    const { data } = supabase.storage
      .from('menu-images')
      .getPublicUrl(filePath)
    
    return data.publicUrl
  }
}
