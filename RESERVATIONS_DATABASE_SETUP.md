# CafeX Reservations/Bookings Management Database Setup

This guide explains how to set up and use the Supabase database integration for Reservations/Bookings management in CafeX.

## 🚀 Quick Setup

### 1. Database Schema Setup

1. **Open your Supabase project dashboard**
2. **Go to SQL Editor**
3. **Copy and paste the entire content from `supabase/reservations_schema.sql`**
4. **Execute the SQL script**

This will create:
- ✅ `reservations` table with comprehensive customer and booking details
- ✅ `table_availability` table for table management
- ✅ `reservation_time_slots` table for time slot configuration
- ✅ `reservation_blackout_dates` table for holidays/maintenance
- ✅ Storage bucket `reservation-documents` for document attachments
- ✅ Row Level Security (RLS) policies for public/admin access
- ✅ Sample data with 10 existing reservations
- ✅ Helpful database functions and triggers
- ✅ Auto confirmation code generation
- ✅ Views for analytics and reporting

### 2. Environment Variables

Make sure your `.env` file has the correct Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Test the Integration

1. **Start your development server**: `npm run dev`
2. **Visit the reservation page** - Form should include name, email, phone fields
3. **Make a test reservation** - Should receive confirmation code
4. **Access admin panel** - Login and manage reservations with full CRUD operations

### 4. Document Upload Setup (Optional)

The system supports document attachments for special requests:

**Private Storage**:
- Upload documents through admin panel
- Secure storage with signed URLs (1-hour expiry)
- Supported formats: JPEG, PNG, WebP, PDF, TXT
- Maximum file size: 2MB

## 📊 Database Structure

### Main Tables

#### Reservations Table
```sql
CREATE TABLE reservations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    -- Customer Information
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50) NOT NULL,
    -- Reservation Details
    reservation_date DATE NOT NULL,
    reservation_time TIME NOT NULL,
    number_of_guests INTEGER NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    -- Additional Information
    special_requests TEXT,
    dietary_restrictions TEXT,
    occasion VARCHAR(100),
    seating_preference VARCHAR(100),
    -- Contact Preferences
    preferred_contact_method VARCHAR(20) DEFAULT 'email',
    marketing_consent BOOLEAN DEFAULT false,
    -- Internal Management
    table_number VARCHAR(20),
    staff_notes TEXT,
    confirmation_code VARCHAR(20) UNIQUE,
    attachment_file_path TEXT,
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    confirmed_at TIMESTAMP WITH TIME ZONE,
    cancelled_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE
);
```

#### Supporting Tables
- **`table_availability`** - Table management (capacity, type, status)
- **`reservation_time_slots`** - Available time slots with capacity limits
- **`reservation_blackout_dates`** - Holidays and maintenance dates

### Storage Bucket

- **Bucket Name**: `reservation-documents`
- **Public Access**: No (Private with signed URLs)
- **File Size Limit**: 2MB
- **Allowed Types**: JPEG, PNG, WebP, PDF, TXT

## 🔧 How It Works

### Public Reservation Page

**Enhanced Reservation Form:**
- **Customer Information**: Name, email, phone number (required)
- **Reservation Details**: Date, time, number of guests
- **Additional Options**: Special requests, dietary restrictions, occasion, seating preference
- **Marketing Consent**: Optional newsletter signup
- **Real-time Validation**: Form validation with database integration
- **Confirmation Code**: Unique 6-character code generated automatically

**Booking Flow:**
1. Customer fills out comprehensive form
2. System validates availability
3. Reservation created with "pending" status
4. Confirmation code generated and displayed
5. Customer receives booking confirmation

### Admin Panel

**Reservations Management:**
- **Full CRUD operations** (Create, Read, Update, Delete)
- **Real-time updates** without page refresh
- **Status Management**: Pending → Confirmed → Completed/Cancelled/No-show
- **Advanced Filtering**: By status, date, customer search
- **Customer Details**: Complete customer information display
- **Table Assignment**: Assign specific tables to reservations
- **Staff Notes**: Internal notes for staff coordination
- **Document Attachments**: Upload and manage reservation documents

**Reservation Statuses:**
- **Pending**: New reservation awaiting confirmation
- **Confirmed**: Reservation confirmed by staff
- **Completed**: Customer showed up and dining completed
- **Cancelled**: Reservation cancelled
- **No Show**: Customer didn't show up

### Data Flow

```
Public Form → ReservationsService → Supabase Database → Admin Panel
```

## 🎯 Key Features

### 1. Comprehensive Customer Management
- **Full Contact Details**: Name, email, phone number
- **Preferences Tracking**: Seating preferences, dietary restrictions
- **Occasion Tracking**: Birthday, anniversary, business meeting, etc.
- **Marketing Consent**: GDPR-compliant consent tracking

### 2. Advanced Availability Management
- **Time Slot Configuration**: Configurable time slots with capacity limits
- **Table Management**: Track table availability and assignments
- **Blackout Dates**: Block dates for holidays or maintenance
- **Capacity Limits**: Prevent overbooking with automatic capacity checking

### 3. Automated Confirmation System
- **Unique Codes**: 6-character alphanumeric confirmation codes
- **Automatic Generation**: Codes generated automatically on booking
- **Customer Lookup**: Customers can find reservations using confirmation codes

### 4. Status Tracking & Timestamps
- **Status History**: Track status changes with timestamps
- **Automatic Timestamps**: Created, confirmed, cancelled, completed dates
- **Staff Coordination**: Internal notes and table assignments

### 5. Analytics & Reporting
- **Reservation Statistics**: Total, confirmed, pending, cancelled counts
- **Popular Time Slots**: Analytics on most popular booking times
- **Customer Insights**: Average party size, booking patterns
- **Today's Reservations**: Quick view of today's bookings

## 🛠️ API Usage Examples

### Create New Reservation (Public)
```typescript
import { ReservationsService } from '../services/reservationsService'

const reservation = await ReservationsService.createReservation({
  customerName: "John Smith",
  customerEmail: "john@email.com",
  customerPhone: "+1-555-0123",
  date: "2024-12-20",
  time: "18:00",
  guests: 4,
  status: "pending",
  specialRequests: "Window table preferred",
  dietaryRestrictions: "One vegetarian guest",
  occasion: "Anniversary",
  seatingPreference: "Window",
  preferredContactMethod: "email",
  marketingConsent: true
})
```

### Check Availability
```typescript
const availability = await ReservationsService.checkAvailability(
  "2024-12-20", 
  "18:00", 
  4
)
// Returns: { availableTables: 5, totalCapacity: 50, isAvailable: true }
```

### Get Available Time Slots
```typescript
const timeSlots = await ReservationsService.getAvailableTimeSlots("2024-12-20")
// Returns array of time slots with availability
```

### Update Reservation Status (Admin)
```typescript
const updatedReservation = await ReservationsService.updateReservation(
  reservationId, 
  { status: "confirmed", tableNumber: "T04", staffNotes: "VIP treatment" }
)
```

## 🧪 Testing Reservations System

### Step-by-Step Test

1. **Make a Public Reservation**
   - Visit `/reservation` page
   - Fill in customer details (name, email, phone)
   - Select date, time, and number of guests
   - Add special requests if desired
   - Submit reservation
   - Note the confirmation code displayed

2. **Verify in Admin Panel**
   - Access admin panel and go to Bookings Management
   - Find the new reservation in the list
   - Verify all customer details are correct
   - Check that status is "pending"

3. **Test Admin Operations**
   - Click on the reservation to view details
   - Change status to "confirmed"
   - Assign a table number
   - Add staff notes
   - Test edit functionality

4. **Test Filtering and Search**
   - Use status filters (All, Pending, Confirmed, etc.)
   - Search by customer name, email, or phone
   - Verify filtering works correctly

5. **Test Availability Functions**
   - Try booking multiple reservations for same time slot
   - Verify capacity limits are enforced
   - Test blackout dates functionality

## 🔍 Troubleshooting

### Common Issues

1. **"Unable to load reservations"**
   - Check Supabase URL and API key in `.env`
   - Verify database schema is created
   - Check browser console for errors

2. **Reservation form not submitting**
   - Verify all required fields are filled
   - Check network tab for API errors
   - Ensure customer email format is valid

3. **Confirmation code not generating**
   - Check database triggers are created
   - Verify `generate_confirmation_code()` function exists
   - Check for unique constraint violations

4. **Admin operations failing**
   - Verify user is authenticated
   - Check RLS policies allow admin operations
   - Review browser console for error details

### Database Queries for Debugging

```sql
-- Check if reservations exist
SELECT COUNT(*) FROM reservations;

-- Check today's reservations
SELECT * FROM todays_reservations;

-- Check reservation statistics
SELECT * FROM reservation_stats;

-- Check time slot availability
SELECT * FROM get_available_time_slots('2024-12-20');

-- Check table availability
SELECT * FROM check_table_availability('2024-12-20', '18:00:00', 4);
```

## 📈 Performance Considerations

- **Indexes**: Created on frequently queried columns (date, status, customer info)
- **Views**: Pre-computed views for common queries (today's reservations, stats)
- **Functions**: Database functions for complex availability calculations
- **Caching**: Browser caches API responses automatically

## 🔄 Migration from Static Data

The system automatically handles the transition:
1. **Database available**: Uses real reservation data
2. **Database unavailable**: Shows empty state with guidance
3. **Mixed state**: Shows what's available

No manual migration needed - the integration is seamless!

## 🎨 Customization

### Adding New Occasions
Simply use new occasion values - they'll be stored and can be used for analytics.

### Custom Time Slots
Update the `reservation_time_slots` table to add/remove time slots or adjust capacity.

### Table Management
Add tables to `table_availability` table with capacity and type information.

### Custom Fields
Extend the database schema and update TypeScript interfaces in:
- `src/services/reservationsService.ts` (Reservation interface)
- `src/pages/reservation/Reservation.tsx` (Form fields)
- `src/admin/components/cards/BookingCard.tsx` (Admin form)

---

**🎉 Your reservations management system is now fully integrated with Supabase!**

Customers can make reservations through the enhanced form with name and phone fields, receive confirmation codes, and admin staff can manage all reservations through the comprehensive admin panel with full CRUD operations, status tracking, and analytics.
