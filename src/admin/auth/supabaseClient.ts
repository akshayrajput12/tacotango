import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
export { supabaseUrl }

// Database Types
export interface Database {
  public: {
    Tables: {
      menu_items: {
        Row: {
          id: string
          name: string
          description: string
          price: number
          category: string
          image_url: string | null
          image_file_path: string | null
          available: boolean
          featured: boolean
          ingredients: string[] | null
          prep_time: string | null
          calories: number | null
          rating: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          price: number
          category: string
          image_url?: string | null
          image_file_path?: string | null
          available?: boolean
          featured?: boolean
          ingredients?: string[] | null
          prep_time?: string | null
          calories?: number | null
          rating?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          price?: number
          category?: string
          image_url?: string | null
          image_file_path?: string | null
          available?: boolean
          featured?: boolean
          ingredients?: string[] | null
          prep_time?: string | null
          calories?: number | null
          rating?: number | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
