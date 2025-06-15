-- =====================================================
-- CAFEX SPECIAL OFFERS MANAGEMENT DATABASE SCHEMA
-- =====================================================
-- This schema creates the complete database structure for Special Offers management
-- including tables, storage buckets, policies, and sample data

-- =====================================================
-- 1. ENABLE REQUIRED EXTENSIONS
-- =====================================================

-- Enable UUID extension for generating unique IDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 2. CREATE STORAGE BUCKETS
-- =====================================================

-- Create Special Offers images storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'offer-images',
  'offer-images',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
) ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- 3. CREATE TABLES
-- =====================================================

-- Create special_offers table
CREATE TABLE IF NOT EXISTS public.special_offers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    discount VARCHAR(100) NOT NULL, -- e.g., "25%", "BOGO", "₹100 OFF"
    image_url TEXT, -- For external URLs
    image_file_path TEXT, -- For uploaded files in storage
    timing VARCHAR(255), -- e.g., "Monday to Friday, 4:00 PM - 6:00 PM"
    valid_from DATE NOT NULL,
    valid_until DATE NOT NULL,
    terms TEXT[], -- Array of terms and conditions
    popular_items TEXT[], -- Array of popular items for this offer
    bg_color VARCHAR(50) DEFAULT 'bg-orange-50', -- Tailwind background color
    border_color VARCHAR(50) DEFAULT 'border-orange-200', -- Tailwind border color
    text_color VARCHAR(50) DEFAULT 'text-orange-800', -- Tailwind text color
    button_color VARCHAR(50) DEFAULT 'bg-orange-600 hover:bg-orange-700', -- Tailwind button color
    featured BOOLEAN DEFAULT false, -- Show prominently
    active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0, -- For custom ordering
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_special_offers_active ON public.special_offers(active);
CREATE INDEX IF NOT EXISTS idx_special_offers_featured ON public.special_offers(featured);
CREATE INDEX IF NOT EXISTS idx_special_offers_valid_dates ON public.special_offers(valid_from, valid_until);
CREATE INDEX IF NOT EXISTS idx_special_offers_sort_order ON public.special_offers(sort_order);
CREATE INDEX IF NOT EXISTS idx_special_offers_terms ON public.special_offers USING GIN(terms);
CREATE INDEX IF NOT EXISTS idx_special_offers_popular_items ON public.special_offers USING GIN(popular_items);

-- =====================================================
-- 4. CREATE FUNCTIONS
-- =====================================================

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_offers_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS trigger_offers_updated_at ON public.special_offers;
CREATE TRIGGER trigger_offers_updated_at
    BEFORE UPDATE ON public.special_offers
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_offers_updated_at();

-- Function to automatically manage sort_order
CREATE OR REPLACE FUNCTION public.handle_offers_sort_order()
RETURNS TRIGGER AS $$
BEGIN
    -- If sort_order is not provided, set it to max + 1
    IF NEW.sort_order IS NULL OR NEW.sort_order = 0 THEN
        SELECT COALESCE(MAX(sort_order), 0) + 1 
        INTO NEW.sort_order 
        FROM public.special_offers;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for sort_order
DROP TRIGGER IF EXISTS trigger_offers_sort_order ON public.special_offers;
CREATE TRIGGER trigger_offers_sort_order
    BEFORE INSERT ON public.special_offers
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_offers_sort_order();

-- Function to check if offer is expired
CREATE OR REPLACE FUNCTION public.is_offer_expired(offer_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    offer_valid_until DATE;
BEGIN
    SELECT valid_until INTO offer_valid_until
    FROM public.special_offers
    WHERE id = offer_id;
    
    RETURN offer_valid_until < CURRENT_DATE;
END;
$$ LANGUAGE plpgsql;

-- Function to check if offer is currently valid
CREATE OR REPLACE FUNCTION public.is_offer_valid(offer_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    offer_valid_from DATE;
    offer_valid_until DATE;
BEGIN
    SELECT valid_from, valid_until INTO offer_valid_from, offer_valid_until
    FROM public.special_offers
    WHERE id = offer_id;
    
    RETURN CURRENT_DATE BETWEEN offer_valid_from AND offer_valid_until;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 5. ROW LEVEL SECURITY POLICIES
-- =====================================================

-- Enable RLS on special_offers table
ALTER TABLE public.special_offers ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public read access to active offers
CREATE POLICY "Public can view active offers" ON public.special_offers
    FOR SELECT USING (active = true);

-- Policy: Allow authenticated users to view all offers (for admin)
CREATE POLICY "Authenticated users can view all offers" ON public.special_offers
    FOR SELECT USING (auth.role() = 'authenticated');

-- Policy: Allow authenticated users to insert offers (admin only)
CREATE POLICY "Authenticated users can insert offers" ON public.special_offers
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Policy: Allow authenticated users to update offers (admin only)
CREATE POLICY "Authenticated users can update offers" ON public.special_offers
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Policy: Allow authenticated users to delete offers (admin only)
CREATE POLICY "Authenticated users can delete offers" ON public.special_offers
    FOR DELETE USING (auth.role() = 'authenticated');

-- =====================================================
-- 6. STORAGE POLICIES
-- =====================================================

-- Policy: Allow public to view offer images
CREATE POLICY "Public can view offer images" ON storage.objects
    FOR SELECT USING (bucket_id = 'offer-images');

-- Policy: Allow authenticated users to upload offer images
CREATE POLICY "Authenticated users can upload offer images" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'offer-images' 
        AND auth.role() = 'authenticated'
        AND (storage.foldername(name))[1] = 'offers'
    );

-- Policy: Allow authenticated users to update offer images
CREATE POLICY "Authenticated users can update offer images" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'offer-images' 
        AND auth.role() = 'authenticated'
    );

-- Policy: Allow authenticated users to delete offer images
CREATE POLICY "Authenticated users can delete offer images" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'offer-images' 
        AND auth.role() = 'authenticated'
    );

-- =====================================================
-- 7. INSERT SAMPLE DATA
-- =====================================================

-- Insert sample special offers with existing data structure
INSERT INTO public.special_offers (
    title, description, discount, image_url, timing, valid_from, valid_until,
    terms, popular_items, bg_color, border_color, text_color, button_color,
    featured, active, sort_order
) VALUES 
-- Happy Hour Offer
(
    'Happy Hour',
    'Enjoy discounted drinks and appetizers every weekday from 4 PM to 6 PM.',
    '25%',
    'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    'Monday to Friday, 4:00 PM - 6:00 PM',
    '2024-01-01',
    '2024-12-31',
    ARRAY[
        'Valid Monday to Friday only',
        'Cannot be combined with other offers',
        'Dine-in only',
        'Subject to availability'
    ],
    ARRAY['Craft Beer', 'Wine Selection', 'Appetizer Platter', 'Nachos'],
    'bg-amber-50',
    'border-amber-200',
    'text-amber-800',
    'bg-amber-600 hover:bg-amber-700',
    true,
    true,
    1
),

-- Student Discount
(
    'Student Discount',
    'Students get 10% off their entire order with a valid student ID.',
    '10%',
    'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    'Available all day, every day',
    '2024-01-01',
    '2024-12-31',
    ARRAY[
        'Valid student ID required',
        'One discount per student per visit',
        'Cannot be combined with other offers',
        'Valid for undergraduate and graduate students'
    ],
    ARRAY['Coffee & Pastries', 'Study Meals', 'Group Orders', 'Late Night Snacks'],
    'bg-orange-50',
    'border-orange-200',
    'text-orange-800',
    'bg-orange-600 hover:bg-orange-700',
    true,
    true,
    2
),

-- Loyalty Program
(
    'Loyalty Program',
    'Join our loyalty program and earn points for every purchase. Redeem points for discounts and free items.',
    '1 point per ₹10',
    'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    'Earn points with every purchase',
    '2024-01-01',
    '2025-12-31',
    ARRAY[
        '100 points = ₹50 discount',
        'Birthday bonus: 2x points',
        'Referral bonus: 50 points',
        'VIP status at 1000 points'
    ],
    ARRAY['Free Coffee (200 pts)', 'Free Dessert (300 pts)', 'Free Meal (500 pts)', 'VIP Experience (1000 pts)'],
    'bg-rose-50',
    'border-rose-200',
    'text-rose-800',
    'bg-rose-600 hover:bg-rose-700',
    true,
    true,
    3
),

-- Weekend Special (Inactive example)
(
    'Weekend Special',
    'Buy 2 get 1 free on all pastries during weekends. Perfect for sharing with friends and family.',
    'BOGO',
    'https://images.unsplash.com/photo-1551024506-0bccd828d307?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'Saturday and Sunday, All day',
    '2024-02-01',
    '2024-02-29',
    ARRAY[
        'Weekends only (Saturday & Sunday)',
        'Lowest priced item free',
        'Minimum 2 pastries required',
        'Cannot be combined with other offers'
    ],
    ARRAY['Croissants', 'Muffins', 'Danish Pastries', 'Cookies'],
    'bg-green-50',
    'border-green-200',
    'text-green-800',
    'bg-green-600 hover:bg-green-700',
    false,
    false,
    4
),

-- Early Bird Special
(
    'Early Bird Special',
    'Get 15% off on all breakfast items when you visit us before 10 AM. Start your day right!',
    '15%',
    'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'Daily, 7:00 AM - 10:00 AM',
    '2024-01-15',
    '2024-06-30',
    ARRAY[
        'Valid before 10:00 AM only',
        'Breakfast items only',
        'Dine-in and takeaway',
        'Cannot be combined with other offers'
    ],
    ARRAY['Breakfast Combo', 'Fresh Pancakes', 'Avocado Toast', 'Morning Coffee'],
    'bg-yellow-50',
    'border-yellow-200',
    'text-yellow-800',
    'bg-yellow-600 hover:bg-yellow-700',
    false,
    true,
    5
)

ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- 8. HELPFUL VIEWS (OPTIONAL)
-- =====================================================

-- View for active offers (public display)
CREATE OR REPLACE VIEW public.active_special_offers AS
SELECT * FROM public.special_offers 
WHERE active = true AND valid_until >= CURRENT_DATE
ORDER BY sort_order ASC, created_at DESC;

-- View for featured offers (events page)
CREATE OR REPLACE VIEW public.featured_special_offers AS
SELECT * FROM public.special_offers 
WHERE featured = true AND active = true AND valid_until >= CURRENT_DATE
ORDER BY sort_order ASC, created_at DESC;

-- View for expired offers
CREATE OR REPLACE VIEW public.expired_special_offers AS
SELECT * FROM public.special_offers 
WHERE valid_until < CURRENT_DATE
ORDER BY valid_until DESC;

-- View for offers expiring soon (within 7 days)
CREATE OR REPLACE VIEW public.expiring_soon_offers AS
SELECT * FROM public.special_offers 
WHERE active = true 
AND valid_until >= CURRENT_DATE 
AND valid_until <= CURRENT_DATE + INTERVAL '7 days'
ORDER BY valid_until ASC;

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
-- Storage bucket 'offer-images' will be available at:
-- https://your-project.supabase.co/storage/v1/object/public/offer-images/
--
-- =====================================================
