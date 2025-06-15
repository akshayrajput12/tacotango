# CafeX Instagram Management Database Setup

This guide explains how to set up and use the Supabase database integration for Instagram management in CafeX.

## 🚀 Quick Setup

### 1. Database Schema Setup

1. **Open your Supabase project dashboard**
2. **Go to SQL Editor**
3. **Copy and paste the entire content from `supabase/instagram_schema.sql`**
4. **Execute the SQL script**

This will create:
- ✅ `instagram_posts` table with all required fields
- ✅ Storage bucket `instagram-images` for image uploads (5MB limit)
- ✅ Row Level Security (RLS) policies for public/admin access
- ✅ Sample data with existing Instagram posts
- ✅ Helpful database functions and triggers
- ✅ Auto status updates for scheduled posts

### 2. Environment Variables

Make sure your `.env` file has the correct Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Test the Integration

1. **Start your development server**: `npm run dev`
2. **Visit the home page** - Featured Instagram posts should load from database in carousel
3. **Access admin panel** - Login and manage Instagram posts with full CRUD operations

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

### Instagram Posts Table

```sql
CREATE TABLE instagram_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    caption TEXT NOT NULL,
    description TEXT,             -- For detailed description (home page)
    image_url TEXT,              -- For external URLs
    image_file_path TEXT,        -- For uploaded files
    instagram_url VARCHAR(500),  -- Link to actual Instagram post
    hashtags TEXT[],             -- Array of hashtags
    scheduled_date TIMESTAMP,    -- For scheduled posts
    status VARCHAR(20) DEFAULT 'draft',
    likes INTEGER DEFAULT 0,
    comments INTEGER DEFAULT 0,
    featured BOOLEAN DEFAULT false,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Storage Bucket

- **Bucket Name**: `instagram-images`
- **Public Access**: Yes
- **File Size Limit**: 5MB
- **Allowed Types**: JPEG, PNG, WebP, GIF

## 🔧 How It Works

### Public Pages (Home)

**Home Page (`InstagramFeed` component):**
- Fetches featured Instagram posts (`featured = true`)
- Displays in carousel format with hover effects
- Falls back to sample data if database is unavailable
- Shows loading spinner during data fetch
- Displays error message if fetch fails

### Admin Panel

**Instagram Management:**
- Full CRUD operations (Create, Read, Update, Delete)
- Real-time updates without page refresh
- **Dual Image Support**: External URLs + File uploads
- Toggle status (published, scheduled, draft)
- Toggle featured and active flags
- Filter by status
- Responsive modal editing with live preview

**Image Upload Workflow:**
1. **Select Upload Method**: Choose between URL or file upload
2. **File Validation**: Automatic format and size checking
3. **Live Preview**: See how the image will look in the Instagram card
4. **Secure Upload**: Files uploaded to Supabase storage bucket
5. **Auto URL Generation**: Uploaded files get public URLs automatically
6. **Database Storage**: Image paths stored in database for retrieval

### Data Flow

```
Database (Supabase) 
    ↓
InstagramService (src/services/instagramService.ts)
    ↓
React Hooks (src/hooks/useInstagram.ts)
    ↓
Components (Home, Admin)
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
- Posts can be scheduled for future publishing
- Database triggers handle status transitions
- Draft → Scheduled → Published workflow

### 4. Carousel Integration
- Featured posts appear in home page carousel
- Smooth animations and hover effects
- Auto-play functionality with manual controls

### 5. Security
- Row Level Security (RLS) enabled
- Public can only read active published posts
- Admin operations require authentication
- Secure file upload policies

## 🛠️ API Usage Examples

### Fetch Featured Posts (Public)
```typescript
import { InstagramService } from '../services/instagramService'

const featuredPosts = await InstagramService.getFeaturedPosts()
```

### Create New Instagram Post (Admin)
```typescript
const newPost = await InstagramService.createPost({
  title: "New Coffee Art",
  caption: "Beautiful latte art ☕️ #CafexMoments",
  description: "Our baristas create stunning designs daily",
  image: "https://example.com/image.jpg",
  instagramUrl: "https://www.instagram.com/p/example/",
  hashtags: ["#coffee", "#latteart", "#cafex"],
  status: "published",
  likes: 0,
  comments: 0,
  featured: true,
  active: true
})
```

### Upload Image
```typescript
const filePath = await InstagramService.uploadImage(file, postId)
const publicUrl = InstagramService.getImageUrl(filePath)
```

## 🧪 Testing Instagram System

### Step-by-Step Test

1. **Access Admin Panel**
   - Navigate to `/admin` and login
   - Go to Instagram Management

2. **Add New Instagram Post with Image Upload**
   - Click "Add New Post"
   - Fill in post details (title, caption, description)
   - Select "Upload" tab for image
   - Choose an image file (JPEG, PNG, WebP, GIF under 5MB)
   - Add hashtags and Instagram URL
   - Mark as "Featured" to show on home page
   - Click "Create Post"

3. **Verify Post Display**
   - Check the admin grid shows the uploaded image
   - Visit home page - if marked as featured, should appear in Instagram carousel
   - Test carousel navigation and hover effects

4. **Test Image URL Generation**
   - Uploaded images get URLs like: `https://your-project.supabase.co/storage/v1/object/public/instagram-images/instagram/filename.jpg`
   - Images are publicly accessible
   - No authentication required for viewing

5. **Test Carousel Integration**
   - Featured posts should appear in home page carousel
   - Auto-play functionality should work
   - Manual navigation should work
   - Hover effects should show post details

## 🔍 Troubleshooting

### Common Issues

1. **"Unable to load Instagram posts"**
   - Check Supabase URL and API key in `.env`
   - Verify database schema is created
   - Check browser console for errors

2. **Images not loading**
   - Verify storage bucket `instagram-images` exists
   - Check storage policies are correctly set
   - Ensure image URLs are valid

3. **Admin operations failing**
   - Verify user is authenticated
   - Check RLS policies allow admin operations
   - Review browser console for error details

4. **Carousel not showing posts**
   - Verify posts are marked as `featured = true`
   - Check posts are marked as `active = true` and `status = 'published'`
   - Ensure posts have valid image URLs

### Database Queries for Debugging

```sql
-- Check if Instagram posts exist
SELECT COUNT(*) FROM instagram_posts;

-- Check featured posts
SELECT title, featured FROM instagram_posts WHERE featured = true;

-- Check storage bucket
SELECT * FROM storage.buckets WHERE id = 'instagram-images';

-- Check storage policies
SELECT * FROM storage.policies WHERE bucket_id = 'instagram-images';
```

## 📈 Performance Considerations

- **Indexes**: Created on frequently queried columns (status, featured, active)
- **Image Optimization**: 5MB limit enforced, consider image compression
- **Caching**: Browser caches API responses automatically
- **Pagination**: Consider implementing for large Instagram catalogs

## 🔄 Migration from Mock Data

The system automatically handles the transition:
1. **Database available**: Uses real data
2. **Database unavailable**: Falls back to sample data
3. **Mixed state**: Shows what's available + fallback

No manual migration needed - the integration is seamless!

## 🎨 Customization

### Adding New Post Statuses
Extend the status enum in the database schema and update TypeScript interfaces.

### Custom Fields
Extend the database schema and update TypeScript interfaces in:
- `src/services/instagramService.ts` (InstagramPost interface)
- `src/admin/components/cards/InstagramPostCard.tsx` (Form fields)

### UI Modifications
All existing components maintain their design - database integration is transparent to the UI layer.

---

**🎉 Your Instagram management system is now fully integrated with Supabase!**

The admin can manage Instagram posts through the admin panel, and changes will immediately appear on the home page carousel for all visitors.
