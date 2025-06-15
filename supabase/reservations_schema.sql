-- =====================================================
-- CAFEX RESERVATIONS/BOOKINGS MANAGEMENT DATABASE SCHEMA
-- =====================================================
-- This schema creates the complete database structure for Reservations/Bookings management
-- including tables, storage buckets, policies, and sample data

-- =====================================================
-- 1. ENABLE REQUIRED EXTENSIONS
-- =====================================================

-- Enable UUID extension for generating unique IDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 2. CREATE STORAGE BUCKETS
-- =====================================================

-- Create Reservations documents storage bucket (for special requests attachments, etc.)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'reservation-documents',
  'reservation-documents',
  false, -- Private bucket for customer documents
  2097152, -- 2MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'application/pdf', 'text/plain']
) ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- 3. CREATE TABLES
-- =====================================================

-- Create reservations table
CREATE TABLE IF NOT EXISTS public.reservations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    
    -- Customer Information
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50) NOT NULL,
    
    -- Reservation Details
    reservation_date DATE NOT NULL,
    reservation_time TIME NOT NULL,
    number_of_guests INTEGER NOT NULL CHECK (number_of_guests > 0 AND number_of_guests <= 20),
    
    -- Status and Management
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed', 'no_show')),
    
    -- Additional Information
    special_requests TEXT,
    dietary_restrictions TEXT,
    occasion VARCHAR(100), -- Birthday, Anniversary, Business Meeting, etc.
    seating_preference VARCHAR(100), -- Window, Outdoor, Quiet Area, etc.
    
    -- Contact Preferences
    preferred_contact_method VARCHAR(20) DEFAULT 'email' CHECK (preferred_contact_method IN ('email', 'phone', 'sms')),
    marketing_consent BOOLEAN DEFAULT false,
    
    -- Internal Management
    table_number VARCHAR(20), -- Assigned table (if applicable)
    staff_notes TEXT, -- Internal notes for staff
    confirmation_code VARCHAR(20) UNIQUE, -- Unique confirmation code for customer
    
    -- Document Attachments
    attachment_file_path TEXT, -- For uploaded documents in storage
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    confirmed_at TIMESTAMP WITH TIME ZONE,
    cancelled_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    
    -- Constraints
    CONSTRAINT valid_reservation_datetime CHECK (
        reservation_date >= CURRENT_DATE OR 
        (reservation_date = CURRENT_DATE AND reservation_time >= CURRENT_TIME)
    )
);

-- Create table availability tracking
CREATE TABLE IF NOT EXISTS public.table_availability (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    table_number VARCHAR(20) NOT NULL,
    table_capacity INTEGER NOT NULL CHECK (table_capacity > 0),
    table_type VARCHAR(50), -- Regular, VIP, Outdoor, Window, etc.
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create reservation time slots configuration
CREATE TABLE IF NOT EXISTS public.reservation_time_slots (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    time_slot TIME NOT NULL,
    max_capacity INTEGER NOT NULL DEFAULT 50, -- Maximum guests for this time slot
    is_active BOOLEAN DEFAULT true,
    day_of_week INTEGER CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0=Sunday, 6=Saturday, NULL=all days
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create blackout dates (holidays, maintenance, etc.)
CREATE TABLE IF NOT EXISTS public.reservation_blackout_dates (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    blackout_date DATE NOT NULL,
    reason VARCHAR(255) NOT NULL,
    is_full_day BOOLEAN DEFAULT true,
    start_time TIME, -- If not full day
    end_time TIME, -- If not full day
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 4. CREATE INDEXES
-- =====================================================

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_reservations_date ON public.reservations(reservation_date);
CREATE INDEX IF NOT EXISTS idx_reservations_status ON public.reservations(status);
CREATE INDEX IF NOT EXISTS idx_reservations_customer_email ON public.reservations(customer_email);
CREATE INDEX IF NOT EXISTS idx_reservations_customer_phone ON public.reservations(customer_phone);
CREATE INDEX IF NOT EXISTS idx_reservations_confirmation_code ON public.reservations(confirmation_code);
CREATE INDEX IF NOT EXISTS idx_reservations_created_at ON public.reservations(created_at);
CREATE INDEX IF NOT EXISTS idx_reservations_datetime ON public.reservations(reservation_date, reservation_time);

-- Composite indexes for common queries
CREATE INDEX IF NOT EXISTS idx_reservations_date_status ON public.reservations(reservation_date, status);
CREATE INDEX IF NOT EXISTS idx_reservations_customer_lookup ON public.reservations(customer_email, customer_phone);

-- Table availability indexes
CREATE INDEX IF NOT EXISTS idx_table_availability_number ON public.table_availability(table_number);
CREATE INDEX IF NOT EXISTS idx_table_availability_active ON public.table_availability(is_active);

-- Time slots indexes
CREATE INDEX IF NOT EXISTS idx_time_slots_active ON public.reservation_time_slots(is_active);
CREATE INDEX IF NOT EXISTS idx_time_slots_day ON public.reservation_time_slots(day_of_week);

-- Blackout dates indexes
CREATE INDEX IF NOT EXISTS idx_blackout_dates_date ON public.reservation_blackout_dates(blackout_date);

-- =====================================================
-- 5. CREATE FUNCTIONS
-- =====================================================

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_reservations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS trigger_reservations_updated_at ON public.reservations;
CREATE TRIGGER trigger_reservations_updated_at
    BEFORE UPDATE ON public.reservations
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_reservations_updated_at();

-- Function to generate unique confirmation code
CREATE OR REPLACE FUNCTION public.generate_confirmation_code()
RETURNS TEXT AS $$
DECLARE
    code TEXT;
    exists_check INTEGER;
BEGIN
    LOOP
        -- Generate 6-character alphanumeric code
        code := UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 6));
        
        -- Check if code already exists
        SELECT COUNT(*) INTO exists_check 
        FROM public.reservations 
        WHERE confirmation_code = code;
        
        -- Exit loop if code is unique
        EXIT WHEN exists_check = 0;
    END LOOP;
    
    RETURN code;
END;
$$ LANGUAGE plpgsql;

-- Function to automatically set confirmation code
CREATE OR REPLACE FUNCTION public.handle_reservation_confirmation_code()
RETURNS TRIGGER AS $$
BEGIN
    -- Set confirmation code if not provided
    IF NEW.confirmation_code IS NULL THEN
        NEW.confirmation_code = public.generate_confirmation_code();
    END IF;

    -- Set confirmed_at timestamp when status changes to confirmed (only on UPDATE)
    IF TG_OP = 'UPDATE' AND NEW.status = 'confirmed' AND (OLD.status IS NULL OR OLD.status != 'confirmed') THEN
        NEW.confirmed_at = NOW();
    END IF;

    -- Set cancelled_at timestamp when status changes to cancelled (only on UPDATE)
    IF TG_OP = 'UPDATE' AND NEW.status = 'cancelled' AND (OLD.status IS NULL OR OLD.status != 'cancelled') THEN
        NEW.cancelled_at = NOW();
    END IF;

    -- Set completed_at timestamp when status changes to completed (only on UPDATE)
    IF TG_OP = 'UPDATE' AND NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status != 'completed') THEN
        NEW.completed_at = NOW();
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for confirmation code and status timestamps
DROP TRIGGER IF EXISTS trigger_reservation_confirmation_code ON public.reservations;
CREATE TRIGGER trigger_reservation_confirmation_code
    BEFORE INSERT OR UPDATE ON public.reservations
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_reservation_confirmation_code();

-- Function to check table availability
CREATE OR REPLACE FUNCTION public.check_table_availability(
    check_date DATE,
    check_time TIME,
    required_guests INTEGER
)
RETURNS TABLE(
    available_tables INTEGER,
    total_capacity INTEGER,
    is_available BOOLEAN
) AS $$
DECLARE
    total_booked INTEGER;
    max_capacity INTEGER;
BEGIN
    -- Get total booked guests for the date/time
    SELECT COALESCE(SUM(number_of_guests), 0) INTO total_booked
    FROM public.reservations
    WHERE reservation_date = check_date
    AND reservation_time = check_time
    AND status IN ('confirmed', 'pending');
    
    -- Get maximum capacity for the time slot
    SELECT COALESCE(MAX(max_capacity), 50) INTO max_capacity
    FROM public.reservation_time_slots
    WHERE time_slot = check_time
    AND is_active = true
    AND (day_of_week IS NULL OR day_of_week = EXTRACT(DOW FROM check_date));
    
    -- Return availability information
    RETURN QUERY SELECT
        (max_capacity - total_booked)::INTEGER as available_tables,
        max_capacity::INTEGER as total_capacity,
        (max_capacity - total_booked >= required_guests)::BOOLEAN as is_available;
END;
$$ LANGUAGE plpgsql;

-- Function to get available time slots for a date
CREATE OR REPLACE FUNCTION public.get_available_time_slots(check_date DATE)
RETURNS TABLE(
    time_slot TIME,
    available_capacity INTEGER,
    total_capacity INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ts.time_slot,
        (ts.max_capacity - COALESCE(SUM(r.number_of_guests), 0))::INTEGER as available_capacity,
        ts.max_capacity::INTEGER as total_capacity
    FROM public.reservation_time_slots ts
    LEFT JOIN public.reservations r ON (
        r.reservation_date = check_date
        AND r.reservation_time = ts.time_slot
        AND r.status IN ('confirmed', 'pending')
    )
    WHERE ts.is_active = true
    AND (ts.day_of_week IS NULL OR ts.day_of_week = EXTRACT(DOW FROM check_date))
    AND NOT EXISTS (
        SELECT 1 FROM public.reservation_blackout_dates bd
        WHERE bd.blackout_date = check_date
        AND (bd.is_full_day = true OR (ts.time_slot BETWEEN bd.start_time AND bd.end_time))
    )
    GROUP BY ts.time_slot, ts.max_capacity
    ORDER BY ts.time_slot;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 6. ROW LEVEL SECURITY POLICIES
-- =====================================================

-- Enable RLS on reservations table
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public to insert reservations (for booking form)
CREATE POLICY "Public can create reservations" ON public.reservations
    FOR INSERT WITH CHECK (true);

-- Policy: Allow customers to view their own reservations
CREATE POLICY "Customers can view own reservations" ON public.reservations
    FOR SELECT USING (
        customer_email = current_setting('request.jwt.claims', true)::json->>'email'
        OR auth.role() = 'authenticated'
    );

-- Policy: Allow authenticated users (admin) to view all reservations
CREATE POLICY "Authenticated users can view all reservations" ON public.reservations
    FOR SELECT USING (auth.role() = 'authenticated');

-- Policy: Allow authenticated users (admin) to update reservations
CREATE POLICY "Authenticated users can update reservations" ON public.reservations
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Policy: Allow authenticated users (admin) to delete reservations
CREATE POLICY "Authenticated users can delete reservations" ON public.reservations
    FOR DELETE USING (auth.role() = 'authenticated');

-- Enable RLS on other tables
ALTER TABLE public.table_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservation_time_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservation_blackout_dates ENABLE ROW LEVEL SECURITY;

-- Policies for configuration tables (admin only)
CREATE POLICY "Authenticated users can manage table availability" ON public.table_availability
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage time slots" ON public.reservation_time_slots
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage blackout dates" ON public.reservation_blackout_dates
    FOR ALL USING (auth.role() = 'authenticated');

-- Public can read availability information
CREATE POLICY "Public can view table availability" ON public.table_availability
    FOR SELECT USING (is_active = true);

CREATE POLICY "Public can view time slots" ON public.reservation_time_slots
    FOR SELECT USING (is_active = true);

CREATE POLICY "Public can view blackout dates" ON public.reservation_blackout_dates
    FOR SELECT USING (true);

-- =====================================================
-- 7. STORAGE POLICIES
-- =====================================================

-- Policy: Allow authenticated users to upload reservation documents
CREATE POLICY "Authenticated users can upload reservation documents" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'reservation-documents' 
        AND auth.role() = 'authenticated'
        AND (storage.foldername(name))[1] = 'reservations'
    );

-- Policy: Allow authenticated users to view reservation documents
CREATE POLICY "Authenticated users can view reservation documents" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'reservation-documents' 
        AND auth.role() = 'authenticated'
    );

-- Policy: Allow authenticated users to update reservation documents
CREATE POLICY "Authenticated users can update reservation documents" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'reservation-documents' 
        AND auth.role() = 'authenticated'
    );

-- Policy: Allow authenticated users to delete reservation documents
CREATE POLICY "Authenticated users can delete reservation documents" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'reservation-documents' 
        AND auth.role() = 'authenticated'
    );



-- =====================================================
-- 8. HELPFUL VIEWS
-- =====================================================

-- View for today's reservations
CREATE OR REPLACE VIEW public.todays_reservations AS
SELECT
    r.*,
    ta.table_type,
    ta.table_capacity
FROM public.reservations r
LEFT JOIN public.table_availability ta ON r.table_number = ta.table_number
WHERE r.reservation_date = CURRENT_DATE
ORDER BY r.reservation_time ASC, r.created_at ASC;

-- View for upcoming reservations (next 7 days)
CREATE OR REPLACE VIEW public.upcoming_reservations AS
SELECT
    r.*,
    ta.table_type,
    ta.table_capacity
FROM public.reservations r
LEFT JOIN public.table_availability ta ON r.table_number = ta.table_number
WHERE r.reservation_date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '7 days'
AND r.status IN ('confirmed', 'pending')
ORDER BY r.reservation_date ASC, r.reservation_time ASC;

-- View for reservation statistics
CREATE OR REPLACE VIEW public.reservation_stats AS
SELECT
    COALESCE(COUNT(*), 0) as total_reservations,
    COALESCE(COUNT(*) FILTER (WHERE status = 'confirmed'), 0) as confirmed_reservations,
    COALESCE(COUNT(*) FILTER (WHERE status = 'pending'), 0) as pending_reservations,
    COALESCE(COUNT(*) FILTER (WHERE status = 'cancelled'), 0) as cancelled_reservations,
    COALESCE(COUNT(*) FILTER (WHERE status = 'completed'), 0) as completed_reservations,
    COALESCE(COUNT(*) FILTER (WHERE status = 'no_show'), 0) as no_show_reservations,
    COALESCE(AVG(number_of_guests), 0) as avg_party_size,
    COALESCE(COUNT(*) FILTER (WHERE reservation_date = CURRENT_DATE), 0) as todays_reservations,
    COALESCE(COUNT(*) FILTER (WHERE reservation_date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '7 days'), 0) as upcoming_reservations
FROM public.reservations;

-- View for popular time slots
CREATE OR REPLACE VIEW public.popular_time_slots AS
SELECT
    reservation_time,
    COUNT(*) as booking_count,
    AVG(number_of_guests) as avg_party_size,
    COUNT(*) FILTER (WHERE status = 'confirmed') as confirmed_count
FROM public.reservations
WHERE reservation_date >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY reservation_time
ORDER BY booking_count DESC;

-- =====================================================
-- SCHEMA CREATION COMPLETE
-- =====================================================
--
-- To use this schema:
-- 1. Copy this entire SQL and run it in your Supabase SQL editor
-- 2. Update your environment variables with correct Supabase URL and keys
-- 3. Test the policies by creating a user and trying CRUD operations
-- 4. Add your own time slots and table availability data as needed
--
-- Storage bucket 'reservation-documents' will be available for document attachments
--
-- Key Features Created:
-- - Complete reservation management with customer details
-- - Table availability tracking system
-- - Time slot management with capacity limits
-- - Blackout dates for holidays/maintenance
-- - Automatic confirmation code generation
-- - Status tracking with timestamps
-- - Advanced availability checking functions
-- - Comprehensive reporting views
-- - Document attachment support
-- - Customer contact preferences
-- - Dietary restrictions and special requests
-- - Occasion tracking for personalized service
-- - Row Level Security (RLS) policies
-- - Database functions for availability checking
-- - Triggers for automatic timestamp updates
--
-- Next Steps:
-- 1. Add your restaurant's time slots to reservation_time_slots table
-- 2. Add your table information to table_availability table
-- 3. Configure blackout dates in reservation_blackout_dates table
-- 4. Test the reservation system with your frontend application
-- =====================================================
