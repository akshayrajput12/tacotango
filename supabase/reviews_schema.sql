-- =====================================================
-- CAFEX CUSTOMER REVIEWS SCHEMA
-- =====================================================
-- 
-- This schema creates a complete customer reviews system with:
-- - Customer reviews with ratings and moderation
-- - Dynamic avatar generation based on customer names
-- - Admin management with full CRUD operations
-- - Public submission with optional moderation
-- - Row Level Security (RLS) policies
-- =====================================================

-- =====================================================
-- 1. ENABLE REQUIRED EXTENSIONS
-- =====================================================

-- Enable UUID extension for generating unique IDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 2. CREATE REVIEWS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS public.customer_reviews (
    -- Primary key and identification
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Customer information
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255), -- Optional email for follow-up
    
    -- Review content
    review_text TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    
    -- Moderation and status
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    
    -- Admin notes and management
    admin_notes TEXT, -- Internal notes for admin use
    moderated_by UUID REFERENCES auth.users(id), -- Admin who moderated
    moderated_at TIMESTAMP WITH TIME ZONE,
    
    -- Display preferences
    featured BOOLEAN DEFAULT false, -- Featured reviews for homepage
    display_order INTEGER DEFAULT 0, -- Custom ordering
    
    -- Metadata
    ip_address INET, -- For spam prevention
    user_agent TEXT, -- For analytics and spam prevention
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 3. CREATE INDEXES FOR PERFORMANCE
-- =====================================================

-- Index for public display (approved reviews)
CREATE INDEX IF NOT EXISTS idx_customer_reviews_approved 
ON public.customer_reviews(status, featured, display_order, created_at) 
WHERE status = 'approved';

-- Index for admin filtering
CREATE INDEX IF NOT EXISTS idx_customer_reviews_status_created 
ON public.customer_reviews(status, created_at DESC);

-- Index for customer name (for avatar generation)
CREATE INDEX IF NOT EXISTS idx_customer_reviews_name 
ON public.customer_reviews(customer_name);

-- Index for rating analysis
CREATE INDEX IF NOT EXISTS idx_customer_reviews_rating 
ON public.customer_reviews(rating, status) 
WHERE status = 'approved';

-- =====================================================
-- 4. CREATE TRIGGERS FOR AUTOMATIC TIMESTAMPS
-- =====================================================

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
DROP TRIGGER IF EXISTS handle_customer_reviews_updated_at ON public.customer_reviews;
CREATE TRIGGER handle_customer_reviews_updated_at
    BEFORE UPDATE ON public.customer_reviews
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Function to handle moderation timestamps
CREATE OR REPLACE FUNCTION public.handle_review_moderation()
RETURNS TRIGGER AS $$
BEGIN
    -- Set moderation timestamp when status changes from pending
    IF OLD.status = 'pending' AND NEW.status IN ('approved', 'rejected') THEN
        NEW.moderated_at = NOW();
        -- Set moderated_by to current user if not already set
        IF NEW.moderated_by IS NULL THEN
            NEW.moderated_by = auth.uid();
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for moderation tracking
DROP TRIGGER IF EXISTS handle_review_moderation_trigger ON public.customer_reviews;
CREATE TRIGGER handle_review_moderation_trigger
    BEFORE UPDATE ON public.customer_reviews
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_review_moderation();

-- =====================================================
-- 5. ENABLE ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS on the reviews table
ALTER TABLE public.customer_reviews ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 6. CREATE RLS POLICIES
-- =====================================================

-- Policy for public to view approved reviews
CREATE POLICY "Public can view approved reviews" ON public.customer_reviews
    FOR SELECT USING (status = 'approved');

-- Policy for public to submit new reviews
CREATE POLICY "Public can submit reviews" ON public.customer_reviews
    FOR INSERT WITH CHECK (
        status = 'pending' AND
        customer_name IS NOT NULL AND
        review_text IS NOT NULL AND
        rating BETWEEN 1 AND 5
    );

-- Policy for authenticated users (admins) to manage all reviews
CREATE POLICY "Authenticated users can manage reviews" ON public.customer_reviews
    FOR ALL USING (auth.role() = 'authenticated');

-- =====================================================
-- 7. CREATE HELPFUL VIEWS
-- =====================================================

-- View for approved reviews (public display)
CREATE OR REPLACE VIEW public.approved_reviews AS
SELECT 
    id,
    customer_name,
    review_text,
    rating,
    featured,
    display_order,
    created_at
FROM public.customer_reviews 
WHERE status = 'approved'
ORDER BY 
    featured DESC,
    display_order ASC,
    created_at DESC;

-- View for featured reviews (homepage)
CREATE OR REPLACE VIEW public.featured_reviews AS
SELECT 
    id,
    customer_name,
    review_text,
    rating,
    created_at
FROM public.customer_reviews 
WHERE status = 'approved' AND featured = true
ORDER BY display_order ASC, created_at DESC;

-- View for review statistics
CREATE OR REPLACE VIEW public.review_stats AS
SELECT 
    COUNT(*) as total_reviews,
    COUNT(*) FILTER (WHERE status = 'approved') as approved_reviews,
    COUNT(*) FILTER (WHERE status = 'pending') as pending_reviews,
    COUNT(*) FILTER (WHERE status = 'rejected') as rejected_reviews,
    ROUND(AVG(rating) FILTER (WHERE status = 'approved'), 2) as average_rating,
    COUNT(*) FILTER (WHERE status = 'approved' AND featured = true) as featured_reviews,
    COUNT(*) FILTER (WHERE status = 'approved' AND created_at >= CURRENT_DATE - INTERVAL '30 days') as recent_reviews
FROM public.customer_reviews;

-- View for rating distribution
CREATE OR REPLACE VIEW public.rating_distribution AS
SELECT 
    rating,
    COUNT(*) as count,
    ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 2) as percentage
FROM public.customer_reviews 
WHERE status = 'approved'
GROUP BY rating
ORDER BY rating DESC;

-- =====================================================
-- 8. CREATE UTILITY FUNCTIONS
-- =====================================================

-- Function to generate avatar color based on name
CREATE OR REPLACE FUNCTION public.get_avatar_color(customer_name TEXT)
RETURNS TEXT AS $$
DECLARE
    colors TEXT[] := ARRAY[
        '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
        '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
        '#F8C471', '#82E0AA', '#F1948A', '#85C1E9', '#D7BDE2'
    ];
    name_hash INTEGER;
BEGIN
    -- Generate hash from first character of name
    name_hash := ASCII(UPPER(SUBSTRING(customer_name, 1, 1)));
    -- Return color based on hash
    RETURN colors[(name_hash % array_length(colors, 1)) + 1];
END;
$$ LANGUAGE plpgsql;

-- Function to get avatar initials
CREATE OR REPLACE FUNCTION public.get_avatar_initials(customer_name TEXT)
RETURNS TEXT AS $$
DECLARE
    words TEXT[];
    initials TEXT := '';
BEGIN
    -- Split name into words
    words := string_to_array(trim(customer_name), ' ');
    
    -- Get first letter of first word
    IF array_length(words, 1) >= 1 THEN
        initials := initials || UPPER(SUBSTRING(words[1], 1, 1));
    END IF;
    
    -- Get first letter of last word (if different from first)
    IF array_length(words, 1) >= 2 THEN
        initials := initials || UPPER(SUBSTRING(words[array_length(words, 1)], 1, 1));
    END IF;
    
    -- If only one word, just return first letter
    IF initials = '' THEN
        initials := UPPER(SUBSTRING(customer_name, 1, 1));
    END IF;
    
    RETURN initials;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- SCHEMA CREATION COMPLETE
-- =====================================================
-- 
-- To use this schema:
-- 1. Copy this entire SQL and run it in your Supabase SQL editor
-- 2. Update your environment variables with correct Supabase URL and keys
-- 3. Test the policies by creating reviews and trying CRUD operations
-- 4. Start building the frontend components
--
-- Key Features Created:
-- - Complete customer reviews table with moderation
-- - Dynamic avatar color and initial generation functions
-- - Row Level Security (RLS) policies for public/admin access
-- - Helpful views for different use cases
-- - Automatic timestamp and moderation tracking
-- - Performance indexes for fast queries
-- - Rating validation and statistics
-- - Featured reviews system for homepage
-- - Admin notes and moderation tracking
--
-- Next Steps:
-- 1. Build the ReviewsService for database operations
-- 2. Create React hooks for data management
-- 3. Build the public review submission form
-- 4. Create the admin reviews management panel
-- 5. Implement the dynamic avatar component
-- 6. Update the homepage to show featured reviews
-- =====================================================
