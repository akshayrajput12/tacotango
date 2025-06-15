# CafeX Events Management Database Setup

This guide explains how to set up and use the Supabase database integration for events management in CafeX.

## 🚀 Quick Setup

### 1. Database Schema Setup

1. **Open your Supabase project dashboard**
2. **Go to SQL Editor**
3. **Copy and paste the entire content from `supabase/events_schema.sql`**
4. **Execute the SQL script**

This will create:
- ✅ `events` table with all required fields
- ✅ Storage bucket `event-images` for image uploads (5MB limit)
- ✅ Row Level Security (RLS) policies for public/admin access
- ✅ Sample data with existing event items
- ✅ Helpful database functions and triggers
- ✅ Auto status updates based on event dates

### 2. Environment Variables

Make sure your `.env` file has the correct Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Test the Integration

1. **Start your development server**: `npm run dev`
2. **Visit the home page** - Featured events should load from database
3. **Visit the events page** - All events should be displayed with calendar integration
4. **Access admin panel** - Login and manage events with full CRUD operations

### 4. Image Upload Setup

The system supports two types of images:

**External URLs (Immediate)**:
- Use direct links to images (e.g., Unsplash, your CDN)
- No upload required, works immediately

**File Uploads (Supabase Storage)**:
- Upload images directly through the admin panel
- Automatic compression and optimization
- Secure storage with public access URLs
- Supported formats: JPEG, PNG, WebP, GIF
- Maximum file size: 5MB

## 📊 Database Structure

### Events Table

```sql
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    date DATE NOT NULL,
    time VARCHAR(50) NOT NULL,
    image_url TEXT,              -- For external URLs
    image_file_path TEXT,        -- For uploaded files
    status VARCHAR(20) DEFAULT 'upcoming',
    capacity INTEGER DEFAULT 50,
    registered INTEGER DEFAULT 0,
    price VARCHAR(50) DEFAULT 'Free Entry',
    category VARCHAR(100) NOT NULL,
    type VARCHAR(100),           -- For public display
    featured BOOLEAN DEFAULT false,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Storage Bucket

- **Bucket Name**: `event-images`
- **Public Access**: Yes
- **File Size Limit**: 5MB
- **Allowed Types**: JPEG, PNG, WebP, GIF

## 🔧 How It Works

### Public Pages (Home & Events)

**Home Page (`UpcomingEvents` component):**
- Fetches featured events (`featured = true`)
- Falls back to sample data if database is unavailable
- Shows loading spinner during data fetch
- Displays error message if fetch fails

**Events Page (`EventsCalendarAndFeatured` component):**
- Fetches all active events (`active = true`)
- Integrates with calendar for date filtering
- Shows events in featured layout
- Maintains existing UI/UX with database integration

### Admin Panel

**Events Management:**
- Full CRUD operations (Create, Read, Update, Delete)
- Real-time updates without page refresh
- **Dual Image Support**: External URLs + File uploads
- Toggle status, featured, and active flags
- Filter by status (upcoming, ongoing, completed)
- Responsive modal editing with live preview

**Image Upload Workflow:**
1. **Select Upload Method**: Choose between URL or file upload
2. **File Validation**: Automatic format and size checking
3. **Live Preview**: See how the image will look in the event card
4. **Secure Upload**: Files uploaded to Supabase storage bucket
5. **Auto URL Generation**: Uploaded files get public URLs automatically
6. **Database Storage**: Image paths stored in database for retrieval

### Data Flow

```
Database (Supabase) 
    ↓
EventsService (src/services/eventsService.ts)
    ↓
React Hooks (src/hooks/useEvents.ts)
    ↓
Components (Home, Events, Admin)
```

## 🎯 Key Features

### 1. Dual Image Support
- **External URLs**: Direct links to images (e.g., Unsplash)
- **File Uploads**: Upload images to Supabase storage
- **Automatic URL Generation**: Uploaded files get public URLs

### 2. Real-time Synchronization
- Admin changes immediately reflect on public pages
- No cache invalidation needed
- Optimistic updates for better UX

### 3. Auto Status Management
- Events automatically update status based on date
- `upcoming` → `ongoing` → `completed`
- Database triggers handle status transitions

### 4. Calendar Integration
- Events appear on calendar with date filtering
- Date range selection for event filtering
- Visual indicators for event dates

### 5. Security
- Row Level Security (RLS) enabled
- Public can only read active events
- Admin operations require authentication
- Secure file upload policies

## 🛠️ API Usage Examples

### Fetch Featured Events (Public)
```typescript
import { EventsService } from '../services/eventsService'

const featuredEvents = await EventsService.getFeaturedEvents()
```

### Create New Event (Admin)
```typescript
const newEvent = await EventsService.createEvent({
  title: "New Workshop",
  description: "Learn something new",
  date: "2024-12-25",
  time: "2:00 PM - 4:00 PM",
  image: "https://example.com/image.jpg",
  status: "upcoming",
  capacity: 30,
  registered: 0,
  price: "₹500",
  category: "Workshop",
  type: "Workshop",
  featured: true,
  active: true
})
```

### Upload Image
```typescript
const filePath = await EventsService.uploadImage(file, eventId)
const publicUrl = EventsService.getImageUrl(filePath)
```

## 🧪 Testing Events System

### Step-by-Step Test

1. **Access Admin Panel**
   - Navigate to `/admin` and login
   - Go to Events Management

2. **Add New Event with Image Upload**
   - Click "Add New Event"
   - Fill in event details (title, description, date, time)
   - Select "Upload" tab for image
   - Choose an image file (JPEG, PNG, WebP, GIF under 5MB)
   - Set capacity, price, category
   - Mark as "Featured" to show on home page
   - Click "Create Event"

3. **Verify Event Display**
   - Check the admin grid shows the uploaded image
   - Visit home page - if marked as featured, should appear in upcoming events
   - Visit events page - should appear in calendar and featured events

4. **Test Calendar Integration**
   - Events should appear as dots on calendar dates
   - Click date ranges to filter events
   - Filtered events should update dynamically

5. **Test Image URL Generation**
   - Uploaded images get URLs like: `https://your-project.supabase.co/storage/v1/object/public/event-images/events/filename.jpg`
   - Images are publicly accessible
   - No authentication required for viewing

## 🔍 Troubleshooting

### Common Issues

1. **"Unable to load events"**
   - Check Supabase URL and API key in `.env`
   - Verify database schema is created
   - Check browser console for errors

2. **Images not loading**
   - Verify storage bucket `event-images` exists
   - Check storage policies are correctly set
   - Ensure image URLs are valid

3. **Admin operations failing**
   - Verify user is authenticated
   - Check RLS policies allow admin operations
   - Review browser console for error details

4. **Calendar not showing events**
   - Verify event dates are in correct format (YYYY-MM-DD)
   - Check events are marked as `active = true`
   - Ensure events are within calendar date range

### Database Queries for Debugging

```sql
-- Check if events exist
SELECT COUNT(*) FROM events;

-- Check featured events
SELECT title, featured FROM events WHERE featured = true;

-- Check storage bucket
SELECT * FROM storage.buckets WHERE id = 'event-images';

-- Check storage policies
SELECT * FROM storage.policies WHERE bucket_id = 'event-images';
```

## 📈 Performance Considerations

- **Indexes**: Created on frequently queried columns (date, status, featured, active)
- **Image Optimization**: 5MB limit enforced, consider image compression
- **Caching**: Browser caches API responses automatically
- **Pagination**: Consider implementing for large event catalogs

## 🔄 Migration from Mock Data

The system automatically handles the transition:
1. **Database available**: Uses real data
2. **Database unavailable**: Falls back to sample data
3. **Mixed state**: Shows what's available + fallback

No manual migration needed - the integration is seamless!

## 🎨 Customization

### Adding New Event Categories
Simply create events with new category names - they'll appear automatically in filters.

### Custom Fields
Extend the database schema and update TypeScript interfaces in:
- `src/services/eventsService.ts` (Event interface)
- `src/admin/components/cards/EventCard.tsx` (Form fields)

### UI Modifications
All existing components maintain their design - database integration is transparent to the UI layer.

---

**🎉 Your events management system is now fully integrated with Supabase!**

The admin can manage events through the admin panel, and changes will immediately appear on the home page and events page for all visitors.
