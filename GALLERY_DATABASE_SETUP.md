# CafeX Gallery Management Database Setup

This guide explains how to set up and use the Supabase database integration for Gallery management in CafeX.

## 🚀 Quick Setup

### 1. Database Schema Setup

1. **Open your Supabase project dashboard**
2. **Go to SQL Editor**
3. **Copy and paste the entire content from `supabase/gallery_schema.sql`**
4. **Execute the SQL script**

This will create:
- ✅ `gallery_images` table with all required fields
- ✅ Storage bucket `gallery-images` for image uploads (10MB limit)
- ✅ Row Level Security (RLS) policies for public/admin access
- ✅ Sample data with existing gallery images
- ✅ Helpful database functions and triggers
- ✅ Auto sort order management

### 2. Environment Variables

Make sure your `.env` file has the correct Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Test the Integration

1. **Start your development server**: `npm run dev`
2. **Visit the home page** - Gallery section should load from database
3. **Visit the gallery page** - All gallery images should be displayed
4. **Access admin panel** - Login and manage gallery with full CRUD operations

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
- Maximum file size: 10MB (higher limit for gallery images)

## 📊 Database Structure

### Gallery Images Table

```sql
CREATE TABLE gallery_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    alt_text TEXT,               -- For accessibility and SEO
    description TEXT,            -- Detailed description for admin
    image_url TEXT,              -- For external URLs
    image_file_path TEXT,        -- For uploaded files
    category VARCHAR(100) DEFAULT 'Interior',
    tags TEXT[],                 -- Array of tags for filtering
    featured BOOLEAN DEFAULT false,
    active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    upload_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Storage Bucket

- **Bucket Name**: `gallery-images`
- **Public Access**: Yes
- **File Size Limit**: 10MB
- **Allowed Types**: JPEG, PNG, WebP, GIF

## 🔧 How It Works

### Public Pages (Home & Gallery)

**Home Page (`Gallery` component):**
- Fetches all active gallery images (`active = true`)
- Can limit number of images with `maxImages` prop
- Shows loading spinner during data fetch
- Displays empty state if no images available

**Gallery Page:**
- Uses the same `Gallery` component
- Displays all active gallery images
- Grid layout with hover effects and image previews

### Admin Panel

**Gallery Management:**
- Full CRUD operations (Create, Read, Update, Delete)
- Real-time updates without page refresh
- **Dual Image Support**: External URLs + File uploads
- Category management and filtering
- Tag system for organization
- Featured toggle for special highlighting
- Bulk operations (select multiple images for deletion)
- Sort order management

**Image Upload Workflow:**
1. **Select Upload Method**: Choose between URL or file upload
2. **File Validation**: Automatic format and size checking
3. **Live Preview**: See how the image will look in the gallery
4. **Secure Upload**: Files uploaded to Supabase storage bucket
5. **Auto URL Generation**: Uploaded files get public URLs automatically
6. **Database Storage**: Image paths stored in database for retrieval

### Data Flow

```
Database (Supabase) 
    ↓
GalleryService (src/services/galleryService.ts)
    ↓
React Hooks (src/hooks/useGallery.ts)
    ↓
Components (Home, Gallery, Admin)
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

### 3. Category & Tag System
- Organize images by categories (Interior, Outdoor, Bar, etc.)
- Tag system for flexible filtering and search
- Auto-generated category statistics

### 4. Featured Images System
- Mark images as featured for special highlighting
- Featured images can be used for home page displays
- Flexible featured image management

### 5. Security
- Row Level Security (RLS) enabled
- Public can only read active images
- Admin operations require authentication
- Secure file upload policies

## 🛠️ API Usage Examples

### Fetch Public Gallery Images
```typescript
import { GalleryService } from '../services/galleryService'

const galleryImages = await GalleryService.getPublicImages()
```

### Create New Gallery Image (Admin)
```typescript
const newImage = await GalleryService.createImage({
  title: "Beautiful Interior",
  alt: "Modern cafe interior with elegant design",
  description: "Stunning interior design showcasing our modern aesthetic",
  url: "https://example.com/image.jpg",
  category: "Interior",
  tags: ["modern", "elegant", "interior"],
  featured: true,
  active: true,
  sortOrder: 1,
  uploadDate: "2024-12-15"
})
```

### Upload Image
```typescript
const filePath = await GalleryService.uploadImage(file, imageId)
const publicUrl = GalleryService.getImageUrl(filePath)
```

## 🧪 Testing Gallery System

### Step-by-Step Test

1. **Access Admin Panel**
   - Navigate to `/admin` and login
   - Go to Gallery Management

2. **Add New Gallery Image with Upload**
   - Click "Add New Image"
   - Fill in image details (title, alt text, description)
   - Select "Upload" tab for image
   - Choose an image file (JPEG, PNG, WebP, GIF under 10MB)
   - Set category and tags
   - Mark as "Featured" if desired
   - Click "Upload Image"

3. **Verify Image Display**
   - Check the admin grid shows the uploaded image
   - Visit home page - gallery section should show the image
   - Visit gallery page - image should appear in the grid

4. **Test Category Filtering**
   - Add images with different categories
   - Use category filter in admin panel
   - Verify filtering works correctly

5. **Test Bulk Operations**
   - Select multiple images using checkboxes
   - Test bulk delete functionality
   - Verify images are removed from both admin and public views

## 🔍 Troubleshooting

### Common Issues

1. **"Unable to load gallery images"**
   - Check Supabase URL and API key in `.env`
   - Verify database schema is created
   - Check browser console for errors

2. **Images not loading**
   - Verify storage bucket `gallery-images` exists
   - Check storage policies are correctly set
   - Ensure image URLs are valid

3. **Admin operations failing**
   - Verify user is authenticated
   - Check RLS policies allow admin operations
   - Review browser console for error details

4. **Gallery not showing images**
   - Verify images are marked as `active = true`
   - Check images have valid URLs or file paths
   - Ensure images are not filtered out by category

### Database Queries for Debugging

```sql
-- Check if gallery images exist
SELECT COUNT(*) FROM gallery_images;

-- Check featured images
SELECT title, featured FROM gallery_images WHERE featured = true;

-- Check storage bucket
SELECT * FROM storage.buckets WHERE id = 'gallery-images';

-- Check storage policies
SELECT * FROM storage.policies WHERE bucket_id = 'gallery-images';
```

## 📈 Performance Considerations

- **Indexes**: Created on frequently queried columns (category, featured, active, sort_order)
- **Image Optimization**: 10MB limit enforced, consider image compression
- **Caching**: Browser caches API responses automatically
- **Pagination**: Consider implementing for large gallery collections

## 🔄 Migration from Static Data

The system automatically handles the transition:
1. **Database available**: Uses real data
2. **Database unavailable**: Shows empty state with admin guidance
3. **Mixed state**: Shows what's available

No manual migration needed - the integration is seamless!

## 🎨 Customization

### Adding New Categories
Simply create images with new category names - they'll appear automatically in filters.

### Custom Fields
Extend the database schema and update TypeScript interfaces in:
- `src/services/galleryService.ts` (GalleryImage interface)
- `src/admin/components/cards/GalleryImageCard.tsx` (Form fields)

### UI Modifications
All existing components maintain their design - database integration is transparent to the UI layer.

---

**🎉 Your gallery management system is now fully integrated with Supabase!**

The admin can manage gallery images through the admin panel, and changes will immediately appear on the home page and gallery page for all visitors.
