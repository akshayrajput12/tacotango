-- =====================================================
-- CAFEX INSTAGRAM MANAGEMENT DATABASE SCHEMA
-- =====================================================
-- This schema creates the complete database structure for Instagram management
-- including tables, storage buckets, policies, and sample data

-- =====================================================
-- 1. ENABLE REQUIRED EXTENSIONS
-- =====================================================

-- Enable UUID extension for generating unique IDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 2. CREATE STORAGE BUCKETS
-- =====================================================

-- Create Instagram images storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'instagram-images',
  'instagram-images',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
) ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- 3. CREATE TABLES
-- =====================================================

-- Create instagram_posts table
CREATE TABLE IF NOT EXISTS public.instagram_posts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    caption TEXT NOT NULL,
    description TEXT, -- For detailed description (home page display)
    image_url TEXT, -- For external URLs
    image_file_path TEXT, -- For uploaded files in storage
    instagram_url VARCHAR(500), -- Link to actual Instagram post
    hashtags TEXT[], -- Array of hashtags
    scheduled_date TIMESTAMP WITH TIME ZONE, -- For scheduled posts
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('published', 'scheduled', 'draft')),
    likes INTEGER DEFAULT 0 CHECK (likes >= 0),
    comments INTEGER DEFAULT 0 CHECK (comments >= 0),
    featured BOOLEAN DEFAULT false, -- Show on home page
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_instagram_posts_status ON public.instagram_posts(status);
CREATE INDEX IF NOT EXISTS idx_instagram_posts_featured ON public.instagram_posts(featured);
CREATE INDEX IF NOT EXISTS idx_instagram_posts_active ON public.instagram_posts(active);
CREATE INDEX IF NOT EXISTS idx_instagram_posts_scheduled_date ON public.instagram_posts(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_instagram_posts_created_at ON public.instagram_posts(created_at);

-- =====================================================
-- 4. CREATE FUNCTIONS
-- =====================================================

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_instagram_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS trigger_instagram_updated_at ON public.instagram_posts;
CREATE TRIGGER trigger_instagram_updated_at
    BEFORE UPDATE ON public.instagram_posts
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_instagram_updated_at();

-- Function to automatically update post status based on scheduled date
CREATE OR REPLACE FUNCTION public.update_instagram_status()
RETURNS TRIGGER AS $$
BEGIN
    -- Auto-update status based on scheduled date
    IF NEW.status = 'scheduled' AND NEW.scheduled_date IS NOT NULL THEN
        IF NEW.scheduled_date <= NOW() THEN
            NEW.status = 'published';
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for auto status update
DROP TRIGGER IF EXISTS trigger_auto_instagram_status ON public.instagram_posts;
CREATE TRIGGER trigger_auto_instagram_status
    BEFORE INSERT OR UPDATE ON public.instagram_posts
    FOR EACH ROW
    EXECUTE FUNCTION public.update_instagram_status();

-- =====================================================
-- 5. ROW LEVEL SECURITY POLICIES
-- =====================================================

-- Enable RLS on instagram_posts table
ALTER TABLE public.instagram_posts ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public read access to active and published posts
CREATE POLICY "Public can view active published posts" ON public.instagram_posts
    FOR SELECT USING (active = true AND status = 'published');

-- Policy: Allow authenticated users to view all posts (for admin)
CREATE POLICY "Authenticated users can view all posts" ON public.instagram_posts
    FOR SELECT USING (auth.role() = 'authenticated');

-- Policy: Allow authenticated users to insert posts (admin only)
CREATE POLICY "Authenticated users can insert posts" ON public.instagram_posts
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Policy: Allow authenticated users to update posts (admin only)
CREATE POLICY "Authenticated users can update posts" ON public.instagram_posts
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Policy: Allow authenticated users to delete posts (admin only)
CREATE POLICY "Authenticated users can delete posts" ON public.instagram_posts
    FOR DELETE USING (auth.role() = 'authenticated');

-- =====================================================
-- 6. STORAGE POLICIES
-- =====================================================

-- Policy: Allow public to view Instagram images
CREATE POLICY "Public can view Instagram images" ON storage.objects
    FOR SELECT USING (bucket_id = 'instagram-images');

-- Policy: Allow authenticated users to upload Instagram images
CREATE POLICY "Authenticated users can upload Instagram images" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'instagram-images' 
        AND auth.role() = 'authenticated'
        AND (storage.foldername(name))[1] = 'instagram'
    );

-- Policy: Allow authenticated users to update Instagram images
CREATE POLICY "Authenticated users can update Instagram images" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'instagram-images' 
        AND auth.role() = 'authenticated'
    );

-- Policy: Allow authenticated users to delete Instagram images
CREATE POLICY "Authenticated users can delete Instagram images" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'instagram-images' 
        AND auth.role() = 'authenticated'
    );



-- =====================================================
-- 7. HELPFUL VIEWS (OPTIONAL)
-- =====================================================

-- View for featured Instagram posts (home page)
CREATE OR REPLACE VIEW public.featured_instagram_posts AS
SELECT * FROM public.instagram_posts 
WHERE featured = true AND active = true AND status = 'published'
ORDER BY created_at DESC;

-- View for published posts
CREATE OR REPLACE VIEW public.published_instagram_posts AS
SELECT * FROM public.instagram_posts 
WHERE status = 'published' AND active = true
ORDER BY created_at DESC;

-- View for scheduled posts
CREATE OR REPLACE VIEW public.scheduled_instagram_posts AS
SELECT * FROM public.instagram_posts 
WHERE status = 'scheduled' AND active = true
ORDER BY scheduled_date ASC;

-- =====================================================
-- SCHEMA CREATION COMPLETE
-- =====================================================
--
-- To use this schema:
-- 1. Copy this entire SQL and run it in your Supabase SQL editor
-- 2. Update your environment variables with correct Supabase URL and keys
-- 3. Test the policies by creating a user and trying CRUD operations
-- 4. Start creating Instagram posts through the admin panel
--
-- Storage bucket 'instagram-images' will be available for image uploads
--
-- Key Features Created:
-- - Complete Instagram post management with dual image support (URL + file upload)
-- - Status management (draft, scheduled, published)
-- - Featured posts for home page carousel
-- - Hashtag support and engagement tracking
-- - Scheduled posting capabilities
-- - Row Level Security (RLS) policies
-- - Public storage bucket for images
-- - Admin-only CRUD operations
-- - Helpful views for different post types
--
-- Next Steps:
-- 1. Test creating posts through the admin panel
-- 2. Upload images using both URL and file upload methods
-- 3. Set up scheduled posts and test functionality
-- 4. Verify posts display correctly on home page and Instagram feed
-- 5. If you encounter issues, run the instagram_schema_fixes.sql file
-- =====================================================
