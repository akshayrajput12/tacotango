-- =====================================================
-- CAFEX EVENTS MANAGEMENT DATABASE SCHEMA
-- =====================================================
-- This schema creates the complete database structure for events management
-- including tables, storage buckets, policies, and sample data

-- =====================================================
-- 1. ENABLE REQUIRED EXTENSIONS
-- =====================================================

-- Enable UUID extension for generating unique IDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 2. CREATE STORAGE BUCKETS
-- =====================================================

-- Create event images storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'event-images',
  'event-images',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
) ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- 3. CREATE TABLES
-- =====================================================

-- Create events table
CREATE TABLE IF NOT EXISTS public.events (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    date DATE NOT NULL,
    time VARCHAR(50) NOT NULL, -- e.g., "7:00 PM - 10:00 PM"
    image_url TEXT, -- For external URLs
    image_file_path TEXT, -- For uploaded files in storage
    status VARCHAR(20) DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'ongoing', 'completed')),
    capacity INTEGER DEFAULT 50 CHECK (capacity > 0),
    registered INTEGER DEFAULT 0 CHECK (registered >= 0),
    price VARCHAR(50) DEFAULT 'Free Entry', -- e.g., "₹500", "Free Entry"
    category VARCHAR(100) NOT NULL, -- e.g., "Workshop", "Live Music", "Literature Event"
    type VARCHAR(100), -- e.g., "Music", "Literature", "Workshop" (for public display)
    featured BOOLEAN DEFAULT false,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_events_date ON public.events(date);
CREATE INDEX IF NOT EXISTS idx_events_status ON public.events(status);
CREATE INDEX IF NOT EXISTS idx_events_featured ON public.events(featured);
CREATE INDEX IF NOT EXISTS idx_events_active ON public.events(active);
CREATE INDEX IF NOT EXISTS idx_events_category ON public.events(category);
CREATE INDEX IF NOT EXISTS idx_events_created_at ON public.events(created_at);

-- =====================================================
-- 4. CREATE FUNCTIONS
-- =====================================================

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_events_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS trigger_events_updated_at ON public.events;
CREATE TRIGGER trigger_events_updated_at
    BEFORE UPDATE ON public.events
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_events_updated_at();

-- Function to automatically update event status based on date
CREATE OR REPLACE FUNCTION public.update_event_status()
RETURNS TRIGGER AS $$
BEGIN
    -- Auto-update status based on date
    IF NEW.date < CURRENT_DATE THEN
        NEW.status = 'completed';
    ELSIF NEW.date = CURRENT_DATE THEN
        NEW.status = 'ongoing';
    ELSE
        NEW.status = 'upcoming';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for auto status update
DROP TRIGGER IF EXISTS trigger_auto_event_status ON public.events;
CREATE TRIGGER trigger_auto_event_status
    BEFORE INSERT OR UPDATE ON public.events
    FOR EACH ROW
    EXECUTE FUNCTION public.update_event_status();

-- =====================================================
-- 5. ROW LEVEL SECURITY POLICIES
-- =====================================================

-- Enable RLS on events table
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public read access to active events
CREATE POLICY "Public can view active events" ON public.events
    FOR SELECT USING (active = true);

-- Policy: Allow authenticated users to view all events (for admin)
CREATE POLICY "Authenticated users can view all events" ON public.events
    FOR SELECT USING (auth.role() = 'authenticated');

-- Policy: Allow authenticated users to insert events (admin only)
CREATE POLICY "Authenticated users can insert events" ON public.events
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Policy: Allow authenticated users to update events (admin only)
CREATE POLICY "Authenticated users can update events" ON public.events
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Policy: Allow authenticated users to delete events (admin only)
CREATE POLICY "Authenticated users can delete events" ON public.events
    FOR DELETE USING (auth.role() = 'authenticated');

-- =====================================================
-- 6. STORAGE POLICIES
-- =====================================================

-- Policy: Allow public to view event images
CREATE POLICY "Public can view event images" ON storage.objects
    FOR SELECT USING (bucket_id = 'event-images');

-- Policy: Allow authenticated users to upload event images
CREATE POLICY "Authenticated users can upload event images" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'event-images' 
        AND auth.role() = 'authenticated'
        AND (storage.foldername(name))[1] = 'events'
    );

-- Policy: Allow authenticated users to update event images
CREATE POLICY "Authenticated users can update event images" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'event-images' 
        AND auth.role() = 'authenticated'
    );

-- Policy: Allow authenticated users to delete event images
CREATE POLICY "Authenticated users can delete event images" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'event-images' 
        AND auth.role() = 'authenticated'
    );

-- =====================================================
-- 7. INSERT SAMPLE DATA
-- =====================================================

-- Insert sample events with existing data structure
INSERT INTO public.events (
    title, description, date, time, image_url, status, capacity, registered, 
    price, category, type, featured, active
) VALUES 
-- Featured Events (for home page)
(
    'Live Jazz Night',
    'Join us for a night of live jazz music, featuring local artists and a special menu of cocktails and appetizers. Experience the smooth sounds of jazz in our cozy atmosphere.',
    '2024-12-15',
    '7:00 PM - 10:00 PM',
    'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'upcoming',
    50,
    32,
    'Free Entry',
    'Live Music',
    'Music',
    true,
    true
),
(
    'Coffee Tasting Workshop',
    'Learn about different coffee beans, brewing techniques, and the art of coffee making. Perfect for coffee enthusiasts who want to deepen their knowledge.',
    '2024-12-22',
    '2:00 PM - 4:00 PM',
    'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'upcoming',
    20,
    15,
    '₹750 per person',
    'Workshop',
    'Workshop',
    true,
    true
),

-- Additional Events (for events page)
(
    'Poetry Night',
    'An evening of spoken word poetry, open mic sessions, and literary discussions in a warm, welcoming environment.',
    '2024-12-28',
    '7:30 PM - 9:30 PM',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'upcoming',
    30,
    18,
    'Free Entry',
    'Literature Event',
    'Literature',
    false,
    true
),
(
    'Acoustic Music Session',
    'Intimate acoustic performances by local musicians. Enjoy great music with your favorite coffee and pastries.',
    '2025-01-05',
    '6:00 PM - 8:00 PM',
    'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'upcoming',
    40,
    25,
    '₹200 per person',
    'Live Music',
    'Music',
    false,
    true
),
(
    'Latte Art Workshop',
    'Master the art of creating beautiful designs in your coffee. Learn from our expert baristas.',
    '2025-01-12',
    '10:00 AM - 12:00 PM',
    'https://images.unsplash.com/photo-1447933601403-0c6688de566e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'upcoming',
    15,
    8,
    '₹500 per person',
    'Workshop',
    'Workshop',
    false,
    true
),
(
    'Book Club Meeting',
    'Monthly book discussion featuring contemporary literature. This month: discussing local authors.',
    '2025-01-18',
    '4:00 PM - 6:00 PM',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'upcoming',
    25,
    12,
    'Free Entry',
    'Literature Event',
    'Literature',
    false,
    true
)

ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- 8. HELPFUL VIEWS (OPTIONAL)
-- =====================================================

-- View for featured events (home page)
CREATE OR REPLACE VIEW public.featured_events AS
SELECT * FROM public.events 
WHERE featured = true AND active = true
ORDER BY date ASC;

-- View for upcoming events
CREATE OR REPLACE VIEW public.upcoming_events AS
SELECT * FROM public.events 
WHERE status = 'upcoming' AND active = true
ORDER BY date ASC;

-- View for events by category
CREATE OR REPLACE VIEW public.events_by_category AS
SELECT 
    category,
    COUNT(*) as event_count,
    COUNT(CASE WHEN status = 'upcoming' THEN 1 END) as upcoming_count,
    AVG(capacity) as avg_capacity
FROM public.events 
WHERE active = true
GROUP BY category
ORDER BY category;

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
-- Storage bucket 'event-images' will be available at:
-- https://your-project.supabase.co/storage/v1/object/public/event-images/
--
-- =====================================================
