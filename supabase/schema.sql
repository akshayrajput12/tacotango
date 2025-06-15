-- =====================================================
-- CAFEX MENU MANAGEMENT DATABASE SCHEMA
-- =====================================================
-- This schema creates the complete database structure for menu management
-- including tables, storage buckets, policies, and sample data

-- =====================================================
-- 1. ENABLE REQUIRED EXTENSIONS
-- =====================================================

-- Enable UUID extension for generating unique IDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- =====================================================
-- 2. CREATE STORAGE BUCKETS
-- =====================================================

-- Create menu images storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'menu-images',
  'menu-images',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
) ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- 3. CREATE TABLES
-- =====================================================

-- Create menu_items table
CREATE TABLE IF NOT EXISTS public.menu_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
    category VARCHAR(100) NOT NULL,
    image_url TEXT, -- For external URLs
    image_file_path TEXT, -- For uploaded files in storage
    available BOOLEAN DEFAULT true,
    featured BOOLEAN DEFAULT false,
    ingredients TEXT[], -- Array of ingredients
    prep_time VARCHAR(50), -- e.g., "3-5 mins"
    calories INTEGER CHECK (calories >= 0),
    rating DECIMAL(2,1) CHECK (rating >= 0 AND rating <= 5),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_menu_items_category ON public.menu_items(category);
CREATE INDEX IF NOT EXISTS idx_menu_items_available ON public.menu_items(available);
CREATE INDEX IF NOT EXISTS idx_menu_items_featured ON public.menu_items(featured);
CREATE INDEX IF NOT EXISTS idx_menu_items_created_at ON public.menu_items(created_at);

-- =====================================================
-- 4. CREATE FUNCTIONS
-- =====================================================

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS trigger_menu_items_updated_at ON public.menu_items;
CREATE TRIGGER trigger_menu_items_updated_at
    BEFORE UPDATE ON public.menu_items
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- =====================================================
-- 5. ROW LEVEL SECURITY POLICIES
-- =====================================================

-- Enable RLS on menu_items table
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public read access to available menu items
CREATE POLICY "Public can view available menu items" ON public.menu_items
    FOR SELECT USING (available = true);

-- Policy: Allow authenticated users to view all menu items (for admin)
CREATE POLICY "Authenticated users can view all menu items" ON public.menu_items
    FOR SELECT USING (auth.role() = 'authenticated');

-- Policy: Allow authenticated users to insert menu items (admin only)
CREATE POLICY "Authenticated users can insert menu items" ON public.menu_items
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Policy: Allow authenticated users to update menu items (admin only)
CREATE POLICY "Authenticated users can update menu items" ON public.menu_items
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Policy: Allow authenticated users to delete menu items (admin only)
CREATE POLICY "Authenticated users can delete menu items" ON public.menu_items
    FOR DELETE USING (auth.role() = 'authenticated');

-- =====================================================
-- 6. STORAGE POLICIES
-- =====================================================

-- Policy: Allow public to view menu images
CREATE POLICY "Public can view menu images" ON storage.objects
    FOR SELECT USING (bucket_id = 'menu-images');

-- Policy: Allow authenticated users to upload menu images
CREATE POLICY "Authenticated users can upload menu images" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'menu-images' 
        AND auth.role() = 'authenticated'
        AND (storage.foldername(name))[1] = 'menu'
    );

-- Policy: Allow authenticated users to update menu images
CREATE POLICY "Authenticated users can update menu images" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'menu-images' 
        AND auth.role() = 'authenticated'
    );

-- Policy: Allow authenticated users to delete menu images
CREATE POLICY "Authenticated users can delete menu images" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'menu-images' 
        AND auth.role() = 'authenticated'
    );

-- =====================================================
-- 7. INSERT SAMPLE DATA
-- =====================================================

-- Insert sample menu items with existing data structure
INSERT INTO public.menu_items (
    name, description, price, category, image_url, available, featured, 
    ingredients, prep_time, calories, rating
) VALUES 
-- Coffee Items
(
    'Artisan Coffee',
    'Our coffee is sourced from the finest beans, roasted to perfection, and crafted with care.',
    350.00,
    'Coffee',
    'https://images.unsplash.com/photo-1509042239860-f550ce710b93?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    true,
    true,
    ARRAY['Premium Arabica Beans', 'Steamed Milk', 'Natural Sweetener'],
    '3-5 mins',
    120,
    4.8
),
(
    'Espresso',
    'Rich and bold espresso shot made from premium arabica beans.',
    250.00,
    'Coffee',
    'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=400',
    true,
    false,
    ARRAY['Premium Arabica Beans', 'Filtered Water'],
    '2-3 mins',
    5,
    4.8
),
(
    'Cappuccino',
    'Perfect balance of espresso, steamed milk, and velvety foam.',
    320.00,
    'Coffee',
    'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400',
    true,
    true,
    ARRAY['Espresso', 'Steamed Milk', 'Milk Foam'],
    '3-4 mins',
    120,
    4.6
),

-- Breakfast Items
(
    'Sunrise Sandwich',
    'Egg, cheese, and your choice of bacon or sausage on a toasted English muffin.',
    420.00,
    'Breakfast',
    'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    true,
    true,
    ARRAY['Farm Fresh Eggs', 'Artisan Cheese', 'Choice of Bacon', 'English Muffin'],
    '8-10 mins',
    380,
    4.7
),
(
    'Fluffy Stack',
    'A stack of three pancakes served with butter and maple syrup.',
    350.00,
    'Breakfast',
    'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    true,
    false,
    ARRAY['Organic Flour', 'Fresh Butter', 'Pure Maple Syrup', 'Farm Eggs'],
    '12-15 mins',
    520,
    4.8
),
(
    'Garden Omelette',
    'A three-egg omelette filled with fresh vegetables and cheese.',
    480.00,
    'Breakfast',
    'https://images.unsplash.com/photo-1525351484163-7529414344d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    true,
    true,
    ARRAY['Farm Fresh Eggs', 'Seasonal Vegetables', 'Artisan Cheese', 'Fresh Herbs'],
    '10-12 mins',
    320,
    4.6
),

-- Pastries
(
    'Croissant',
    'Buttery, flaky French pastry baked fresh daily.',
    280.00,
    'Pastries',
    'https://images.unsplash.com/photo-1555507036-ab794f4ade0a?w=400',
    true,
    false,
    ARRAY['Butter', 'Flour', 'Yeast', 'Salt'],
    '1-2 mins',
    280,
    4.4
),

-- Food Items
(
    'Avocado Toast',
    'Fresh avocado on artisan bread with a drizzle of olive oil.',
    450.00,
    'Food',
    'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=400',
    true,
    true,
    ARRAY['Avocado', 'Artisan Bread', 'Sea Salt', 'Lime', 'Olive Oil'],
    '5-7 mins',
    320,
    4.7
),

-- Lunch Items
(
    'Grilled Chicken Salad',
    'Fresh mixed greens with grilled chicken, cherry tomatoes, and balsamic dressing.',
    520.00,
    'Lunch',
    'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    true,
    true,
    ARRAY['Grilled Chicken', 'Mixed Greens', 'Cherry Tomatoes', 'Balsamic Dressing'],
    '10-12 mins',
    350,
    4.5
),

-- Dinner Items
(
    'Pasta Primavera',
    'Fresh pasta with seasonal vegetables in a light cream sauce.',
    680.00,
    'Dinner',
    'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    true,
    false,
    ARRAY['Fresh Pasta', 'Seasonal Vegetables', 'Cream Sauce', 'Parmesan'],
    '15-18 mins',
    450,
    4.3
),

-- Drinks
(
    'Fresh Orange Juice',
    'Freshly squeezed orange juice, no added sugar.',
    180.00,
    'Drinks',
    'https://images.unsplash.com/photo-1613478223719-2ab802602423?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    true,
    false,
    ARRAY['Fresh Oranges'],
    '2-3 mins',
    110,
    4.6
)

ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- 8. HELPFUL VIEWS (OPTIONAL)
-- =====================================================

-- View for featured menu items
CREATE OR REPLACE VIEW public.featured_menu_items AS
SELECT * FROM public.menu_items 
WHERE featured = true AND available = true
ORDER BY created_at DESC;

-- View for menu items by category
CREATE OR REPLACE VIEW public.menu_by_category AS
SELECT 
    category,
    COUNT(*) as item_count,
    AVG(price) as avg_price,
    AVG(rating) as avg_rating
FROM public.menu_items 
WHERE available = true
GROUP BY category
ORDER BY category;

-- =====================================================
-- SCHEMA CREATION COMPLETE
-- =====================================================
-- 
-- To use this schema:
-- 1. Copy this entire SQL and run it in your Supabase SQL editor
-- 2. Make sure to replace 'your-jwt-secret' with your actual JWT secret
-- 3. Update your environment variables with correct Supabase URL and keys
-- 4. Test the policies by creating a user and trying CRUD operations
--
-- Storage bucket 'menu-images' will be available at:
-- https://your-project.supabase.co/storage/v1/object/public/menu-images/
--
-- =====================================================
