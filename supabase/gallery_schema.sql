-- =====================================================
-- CAFEX GALLERY MANAGEMENT DATABASE SCHEMA
-- =====================================================
-- This schema creates the complete database structure for Gallery management
-- including tables, storage buckets, policies, and sample data

-- =====================================================
-- 1. ENABLE REQUIRED EXTENSIONS
-- =====================================================

-- Enable UUID extension for generating unique IDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 2. CREATE STORAGE BUCKETS
-- =====================================================

-- Create Gallery images storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'gallery-images',
  'gallery-images',
  true,
  10485760, -- 10MB limit for high-quality gallery images
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
) ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- 3. CREATE TABLES
-- =====================================================

-- Create gallery_images table
CREATE TABLE IF NOT EXISTS public.gallery_images (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    alt_text TEXT, -- For accessibility and SEO
    description TEXT, -- Detailed description for admin
    image_url TEXT, -- For external URLs
    image_file_path TEXT, -- For uploaded files in storage
    category VARCHAR(100) NOT NULL DEFAULT 'Interior',
    tags TEXT[], -- Array of tags for filtering
    featured BOOLEAN DEFAULT false, -- Show on home page
    active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0, -- For custom ordering
    upload_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_gallery_images_category ON public.gallery_images(category);
CREATE INDEX IF NOT EXISTS idx_gallery_images_featured ON public.gallery_images(featured);
CREATE INDEX IF NOT EXISTS idx_gallery_images_active ON public.gallery_images(active);
CREATE INDEX IF NOT EXISTS idx_gallery_images_sort_order ON public.gallery_images(sort_order);
CREATE INDEX IF NOT EXISTS idx_gallery_images_upload_date ON public.gallery_images(upload_date);
CREATE INDEX IF NOT EXISTS idx_gallery_images_tags ON public.gallery_images USING GIN(tags);

-- =====================================================
-- 4. CREATE FUNCTIONS
-- =====================================================

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_gallery_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS trigger_gallery_updated_at ON public.gallery_images;
CREATE TRIGGER trigger_gallery_updated_at
    BEFORE UPDATE ON public.gallery_images
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_gallery_updated_at();

-- Function to automatically manage sort_order
CREATE OR REPLACE FUNCTION public.handle_gallery_sort_order()
RETURNS TRIGGER AS $$
BEGIN
    -- If sort_order is not provided, set it to max + 1
    IF NEW.sort_order IS NULL OR NEW.sort_order = 0 THEN
        SELECT COALESCE(MAX(sort_order), 0) + 1 
        INTO NEW.sort_order 
        FROM public.gallery_images 
        WHERE category = NEW.category;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for sort_order
DROP TRIGGER IF EXISTS trigger_gallery_sort_order ON public.gallery_images;
CREATE TRIGGER trigger_gallery_sort_order
    BEFORE INSERT ON public.gallery_images
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_gallery_sort_order();

-- =====================================================
-- 5. ROW LEVEL SECURITY POLICIES
-- =====================================================

-- Enable RLS on gallery_images table
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public read access to active images
CREATE POLICY "Public can view active gallery images" ON public.gallery_images
    FOR SELECT USING (active = true);

-- Policy: Allow authenticated users to view all images (for admin)
CREATE POLICY "Authenticated users can view all gallery images" ON public.gallery_images
    FOR SELECT USING (auth.role() = 'authenticated');

-- Policy: Allow authenticated users to insert images (admin only)
CREATE POLICY "Authenticated users can insert gallery images" ON public.gallery_images
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Policy: Allow authenticated users to update images (admin only)
CREATE POLICY "Authenticated users can update gallery images" ON public.gallery_images
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Policy: Allow authenticated users to delete images (admin only)
CREATE POLICY "Authenticated users can delete gallery images" ON public.gallery_images
    FOR DELETE USING (auth.role() = 'authenticated');

-- =====================================================
-- 6. STORAGE POLICIES
-- =====================================================

-- Policy: Allow public to view gallery images
CREATE POLICY "Public can view gallery images" ON storage.objects
    FOR SELECT USING (bucket_id = 'gallery-images');

-- Policy: Allow authenticated users to upload gallery images
CREATE POLICY "Authenticated users can upload gallery images" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'gallery-images' 
        AND auth.role() = 'authenticated'
        AND (storage.foldername(name))[1] = 'gallery'
    );

-- Policy: Allow authenticated users to update gallery images
CREATE POLICY "Authenticated users can update gallery images" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'gallery-images' 
        AND auth.role() = 'authenticated'
    );

-- Policy: Allow authenticated users to delete gallery images
CREATE POLICY "Authenticated users can delete gallery images" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'gallery-images' 
        AND auth.role() = 'authenticated'
    );

-- =====================================================
-- 7. INSERT SAMPLE DATA
-- =====================================================

-- Insert sample gallery images with existing data structure
INSERT INTO public.gallery_images (
    title, alt_text, description, image_url, category, tags, 
    featured, active, sort_order
) VALUES 
-- Featured Images (for home page)
(
    'Modern Cafe Interior',
    'Modern cafe interior with minimalist design',
    'Our beautifully designed modern cafe interior featuring clean lines, comfortable seating, and a minimalist aesthetic that creates the perfect atmosphere for work or relaxation.',
    'https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    'Interior',
    ARRAY['modern', 'minimalist', 'seating', 'atmosphere'],
    true,
    true,
    1
),
(
    'Warm Wooden Interior',
    'Warm wooden cafe interior',
    'Cozy wooden interior design that brings warmth and comfort to your dining experience. Natural materials and soft lighting create an inviting environment.',
    'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    'Interior',
    ARRAY['wooden', 'warm', 'cozy', 'natural'],
    true,
    true,
    2
),
(
    'Cozy Dining Area',
    'Cozy dining area with wooden tables',
    'Intimate dining spaces with handcrafted wooden tables and comfortable seating arrangements perfect for both casual meals and special occasions.',
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    'Interior',
    ARRAY['dining', 'wooden', 'tables', 'intimate'],
    true,
    true,
    3
),
(
    'Elegant Restaurant Seating',
    'Elegant restaurant seating area',
    'Sophisticated seating arrangements designed for comfort and style. Perfect for business meetings, romantic dinners, or casual gatherings with friends.',
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    'Interior',
    ARRAY['elegant', 'seating', 'sophisticated', 'comfort'],
    true,
    true,
    4
),
(
    'Bright Natural Lighting',
    'Bright cafe with natural lighting',
    'Spacious cafe area flooded with natural light from large windows, creating an energizing environment perfect for morning coffee and productive work sessions.',
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    'Interior',
    ARRAY['bright', 'natural', 'lighting', 'spacious'],
    true,
    true,
    5
),
(
    'Rustic Warm Ambiance',
    'Rustic cafe interior with warm ambiance',
    'Charming rustic interior featuring exposed brick, vintage furniture, and warm lighting that creates a homey atmosphere perfect for relaxing conversations.',
    'https://images.unsplash.com/photo-1567521464027-f127ff144326?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    'Interior',
    ARRAY['rustic', 'vintage', 'brick', 'homey'],
    true,
    true,
    6
),
(
    'Modern Coffee Shop Design',
    'Modern coffee shop design',
    'Contemporary coffee shop layout with sleek furniture, industrial elements, and modern fixtures that appeal to urban professionals and coffee enthusiasts.',
    'https://images.unsplash.com/photo-1551218808-94e220e084d2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    'Interior',
    ARRAY['modern', 'contemporary', 'industrial', 'sleek'],
    true,
    true,
    7
),
(
    'Comfortable Seating Area',
    'Comfortable seating area',
    'Plush seating arrangements with soft cushions and ergonomic design, perfect for extended stays whether you''re working, reading, or socializing.',
    'https://images.unsplash.com/photo-1559329007-40df8a9345d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    'Interior',
    ARRAY['comfortable', 'plush', 'ergonomic', 'socializing'],
    true,
    true,
    8
),
(
    'Stylish Restaurant Interior',
    'Stylish restaurant interior',
    'Thoughtfully designed restaurant space combining style and functionality. Every detail has been carefully chosen to enhance your dining experience.',
    'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    'Interior',
    ARRAY['stylish', 'thoughtful', 'functional', 'detailed'],
    true,
    true,
    9
),
(
    'Contemporary Dining Space',
    'Contemporary dining space',
    'Modern dining area with clean architectural lines and sophisticated color palette, creating an upscale yet welcoming environment for all occasions.',
    'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    'Interior',
    ARRAY['contemporary', 'architectural', 'upscale', 'welcoming'],
    true,
    true,
    10
),

-- Additional Gallery Images (not featured on home page)
(
    'Intimate Dining Corner',
    'Intimate dining corner',
    'Private corner seating perfect for romantic dinners and intimate conversations. Soft lighting and comfortable furnishings create the perfect ambiance.',
    'https://images.unsplash.com/photo-1552566626-52f8b828add9?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    'Interior',
    ARRAY['intimate', 'corner', 'romantic', 'private'],
    false,
    true,
    11
),
(
    'Spacious Cafe Layout',
    'Spacious cafe layout',
    'Open floor plan with flexible seating arrangements that can accommodate both individual guests and larger groups comfortably.',
    'https://images.unsplash.com/photo-1578474846511-04ba529f0b88?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    'Interior',
    ARRAY['spacious', 'open', 'flexible', 'groups'],
    false,
    true,
    12
),
(
    'Elegant Bar Area',
    'Elegant restaurant bar area',
    'Sophisticated bar area featuring premium finishes and professional-grade equipment, perfect for enjoying craft cocktails and specialty beverages.',
    'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    'Bar',
    ARRAY['bar', 'sophisticated', 'cocktails', 'premium'],
    false,
    true,
    1
),
(
    'Cozy Corner Seating',
    'Cozy corner seating',
    'Comfortable corner nooks with soft seating and warm lighting, ideal for quiet conversations and peaceful moments away from the bustle.',
    'https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    'Interior',
    ARRAY['cozy', 'corner', 'quiet', 'peaceful'],
    false,
    true,
    13
),
(
    'Modern Restaurant Interior',
    'Modern restaurant interior',
    'Sleek and contemporary restaurant design with attention to every detail, from lighting to furniture selection, creating a memorable dining atmosphere.',
    'https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    'Interior',
    ARRAY['modern', 'sleek', 'contemporary', 'memorable'],
    false,
    true,
    14
),
(
    'Beautiful Dining Room',
    'Beautiful dining room',
    'Elegantly appointed dining room with carefully selected artwork and furnishings that create a refined atmosphere for special occasions.',
    'https://images.unsplash.com/photo-1481833761820-0509d3217039?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    'Interior',
    ARRAY['beautiful', 'elegant', 'artwork', 'refined'],
    false,
    true,
    15
),
(
    'Outdoor Terrace Dining',
    'Outdoor terrace dining',
    'Charming outdoor dining area with comfortable seating and beautiful views, perfect for al fresco dining during pleasant weather.',
    'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    'Outdoor',
    ARRAY['outdoor', 'terrace', 'alfresco', 'views'],
    false,
    true,
    1
),
(
    'Luxury Restaurant Setting',
    'Luxury restaurant setting',
    'Premium dining environment with luxurious finishes and impeccable attention to detail, designed for the most discerning guests.',
    'https://images.unsplash.com/photo-1586999768151-be3e09217445?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    'Interior',
    ARRAY['luxury', 'premium', 'luxurious', 'discerning'],
    false,
    true,
    16
)

ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- 8. HELPFUL VIEWS (OPTIONAL)
-- =====================================================

-- View for featured gallery images (home page)
CREATE OR REPLACE VIEW public.featured_gallery_images AS
SELECT * FROM public.gallery_images 
WHERE featured = true AND active = true
ORDER BY sort_order ASC, created_at DESC;

-- View for gallery images by category
CREATE OR REPLACE VIEW public.gallery_images_by_category AS
SELECT 
    category,
    COUNT(*) as image_count,
    ARRAY_AGG(id ORDER BY sort_order ASC, created_at DESC) as image_ids
FROM public.gallery_images 
WHERE active = true
GROUP BY category
ORDER BY category;

-- View for public gallery (all active images)
CREATE OR REPLACE VIEW public.public_gallery_images AS
SELECT * FROM public.gallery_images 
WHERE active = true
ORDER BY sort_order ASC, created_at DESC;

-- =====================================================
-- SCHEMA CREATION COMPLETE
-- =====================================================
-- 
-- To use this schema:
-- 1. Copy this entire SQL and run it in your Supabase SQL editor
-- 2. Make sure to replace JWT secret if needed
-- 3. Update your environment variables with correct Supabase URL and keys
-- 4. Test the policies by creating a user and trying CRUD operations
--
-- Storage bucket 'gallery-images' will be available at:
-- https://your-project.supabase.co/storage/v1/object/public/gallery-images/
--
-- =====================================================
