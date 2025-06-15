-- =====================================================
-- INSTAGRAM SCHEMA FIXES
-- =====================================================
-- 
-- This file contains fixes for existing Instagram database issues.
-- Run this AFTER the main instagram_schema.sql if you're experiencing issues.
-- 
-- Issues Fixed:
-- 1. Remove sample data conflicts
-- 2. Ensure proper constraints and indexes
-- 3. Fix any missing triggers or functions
-- 4. Update RLS policies if needed
-- =====================================================

-- =====================================================
-- 1. CLEAN UP SAMPLE DATA (if exists)
-- =====================================================

-- Remove any existing sample data that might cause conflicts
DELETE FROM public.instagram_posts WHERE image_url LIKE '%unsplash.com%';

-- =====================================================
-- 2. ENSURE PROPER CONSTRAINTS
-- =====================================================

-- Add missing constraints if they don't exist
DO $$ 
BEGIN
    -- Ensure at least one image source is provided
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.check_constraints 
        WHERE constraint_name = 'instagram_posts_image_check'
    ) THEN
        ALTER TABLE public.instagram_posts 
        ADD CONSTRAINT instagram_posts_image_check 
        CHECK (image_url IS NOT NULL OR image_file_path IS NOT NULL);
    END IF;
    
    -- Ensure scheduled posts have a scheduled date
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.check_constraints 
        WHERE constraint_name = 'instagram_posts_scheduled_check'
    ) THEN
        ALTER TABLE public.instagram_posts 
        ADD CONSTRAINT instagram_posts_scheduled_check 
        CHECK (status != 'scheduled' OR scheduled_date IS NOT NULL);
    END IF;
END $$;

-- =====================================================
-- 3. ENSURE PROPER INDEXES
-- =====================================================

-- Create indexes for better performance if they don't exist
CREATE INDEX IF NOT EXISTS idx_instagram_posts_status_active 
ON public.instagram_posts(status, active);

CREATE INDEX IF NOT EXISTS idx_instagram_posts_featured_status_active 
ON public.instagram_posts(featured, status, active);

CREATE INDEX IF NOT EXISTS idx_instagram_posts_scheduled_date 
ON public.instagram_posts(scheduled_date) 
WHERE status = 'scheduled';

CREATE INDEX IF NOT EXISTS idx_instagram_posts_created_at 
ON public.instagram_posts(created_at DESC);

-- =====================================================
-- 4. ENSURE STORAGE BUCKET EXISTS AND IS CONFIGURED
-- =====================================================

-- Ensure the storage bucket exists
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'instagram-images',
    'instagram-images',
    true,
    5242880, -- 5MB limit
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
    public = true,
    file_size_limit = 5242880,
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

-- =====================================================
-- 5. ENSURE RLS POLICIES ARE CORRECT
-- =====================================================

-- Drop existing policies to recreate them properly
DROP POLICY IF EXISTS "Public can view published Instagram posts" ON public.instagram_posts;
DROP POLICY IF EXISTS "Authenticated users can manage Instagram posts" ON public.instagram_posts;

-- Recreate policies with correct permissions
CREATE POLICY "Public can view published Instagram posts" ON public.instagram_posts
    FOR SELECT USING (status = 'published' AND active = true);

CREATE POLICY "Authenticated users can manage Instagram posts" ON public.instagram_posts
    FOR ALL USING (auth.role() = 'authenticated');

-- Storage policies
DROP POLICY IF EXISTS "Public can view Instagram images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload Instagram images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update Instagram images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete Instagram images" ON storage.objects;

-- Recreate storage policies
CREATE POLICY "Public can view Instagram images" ON storage.objects
    FOR SELECT USING (bucket_id = 'instagram-images');

CREATE POLICY "Authenticated users can upload Instagram images" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'instagram-images' 
        AND auth.role() = 'authenticated'
    );

CREATE POLICY "Authenticated users can update Instagram images" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'instagram-images' 
        AND auth.role() = 'authenticated'
    );

CREATE POLICY "Authenticated users can delete Instagram images" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'instagram-images' 
        AND auth.role() = 'authenticated'
    );

-- =====================================================
-- 6. ENSURE TRIGGERS ARE WORKING
-- =====================================================

-- Recreate the updated_at trigger if it doesn't exist
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop and recreate trigger
DROP TRIGGER IF EXISTS handle_instagram_posts_updated_at ON public.instagram_posts;
CREATE TRIGGER handle_instagram_posts_updated_at
    BEFORE UPDATE ON public.instagram_posts
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- =====================================================
-- 7. ENSURE VIEWS ARE CREATED
-- =====================================================

-- Recreate views to ensure they exist
CREATE OR REPLACE VIEW public.featured_instagram_posts AS
SELECT * FROM public.instagram_posts 
WHERE featured = true AND active = true AND status = 'published'
ORDER BY created_at DESC;

CREATE OR REPLACE VIEW public.published_instagram_posts AS
SELECT * FROM public.instagram_posts 
WHERE status = 'published' AND active = true
ORDER BY created_at DESC;

CREATE OR REPLACE VIEW public.scheduled_instagram_posts AS
SELECT * FROM public.instagram_posts 
WHERE status = 'scheduled' AND active = true
ORDER BY scheduled_date ASC;

-- =====================================================
-- 8. TEST DATA INSERTION (OPTIONAL)
-- =====================================================

-- Insert a single test post to verify everything works
-- Remove this section if you don't want test data
INSERT INTO public.instagram_posts (
    title, 
    caption, 
    description, 
    image_url, 
    instagram_url, 
    hashtags, 
    status, 
    likes, 
    comments, 
    featured, 
    active
) VALUES (
    'Test Instagram Post',
    'This is a test post to verify the Instagram system is working correctly! ☕️ #CafexTest',
    'This test post verifies that the Instagram management system is properly configured and working. You can delete this post after confirming everything works.',
    'https://images.unsplash.com/photo-1509042239860-f550ce710b93?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    'https://www.instagram.com/p/test/',
    ARRAY['#cafex', '#test', '#coffee'],
    'published',
    0,
    0,
    true,
    true
) ON CONFLICT DO NOTHING;

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Run these queries to verify everything is working:

-- 1. Check if table exists and has correct structure
-- SELECT column_name, data_type, is_nullable 
-- FROM information_schema.columns 
-- WHERE table_name = 'instagram_posts' 
-- ORDER BY ordinal_position;

-- 2. Check if storage bucket exists
-- SELECT * FROM storage.buckets WHERE id = 'instagram-images';

-- 3. Check if policies exist
-- SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
-- FROM pg_policies 
-- WHERE tablename = 'instagram_posts';

-- 4. Check if views exist
-- SELECT viewname FROM pg_views WHERE schemaname = 'public' AND viewname LIKE '%instagram%';

-- 5. Check if test data was inserted
-- SELECT id, title, status, featured, active FROM public.instagram_posts LIMIT 5;

-- =====================================================
-- FIXES COMPLETE
-- =====================================================
-- 
-- After running this script:
-- 1. Test creating a new Instagram post in the admin panel
-- 2. Verify the post appears in the admin grid
-- 3. Mark the post as featured and published
-- 4. Check that it appears on the home page Instagram carousel
-- 5. Test both URL and file upload methods
-- 
-- If issues persist, check:
-- - Supabase connection in browser console
-- - Authentication status in admin panel
-- - Network tab for API errors
-- - Browser console for JavaScript errors
-- =====================================================
