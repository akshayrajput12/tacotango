# CafeX Menu Management Database Setup

This guide explains how to set up and use the Supabase database integration for menu management in CafeX.

## 🚀 Quick Setup

### 1. Database Schema Setup

1. **Open your Supabase project dashboard**
2. **Go to SQL Editor**
3. **Copy and paste the entire content from `supabase/schema.sql`**
4. **Execute the SQL script**

This will create:
- ✅ `menu_items` table with all required fields
- ✅ Storage bucket `menu-images` for image uploads (5MB limit)
- ✅ Row Level Security (RLS) policies for public/admin access
- ✅ Sample data with existing menu items
- ✅ Helpful database functions and triggers
- ✅ Storage policies for secure image upload/access

### 2. Environment Variables

Make sure your `.env` file has the correct Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Test the Integration

1. **Start your development server**: `npm run dev`
2. **Visit the home page** - Featured menu items should load from database
3. **Visit the menu page** - All menu items should be organized by category
4. **Access admin panel** - Login and manage menu items with full CRUD operations
5. **Check Database Status** - The admin panel shows a status indicator at the top

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

### Menu Items Table

```sql
CREATE TABLE menu_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    category VARCHAR(100) NOT NULL,
    image_url TEXT,              -- For external URLs
    image_file_path TEXT,        -- For uploaded files
    available BOOLEAN DEFAULT true,
    featured BOOLEAN DEFAULT false,
    ingredients TEXT[],          -- Array of ingredients
    prep_time VARCHAR(50),       -- e.g., "3-5 mins"
    calories INTEGER,
    rating DECIMAL(2,1),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Storage Bucket

- **Bucket Name**: `menu-images`
- **Public Access**: Yes
- **File Size Limit**: 5MB
- **Allowed Types**: JPEG, PNG, WebP, GIF

## 🔧 How It Works

### Public Pages (Home & Menu)

**Home Page (`MenuHighlights` component):**
- Fetches featured menu items (`featured = true`)
- Falls back to sample data if database is unavailable
- Shows loading spinner during data fetch
- Displays error message if fetch fails

**Menu Page:**
- Fetches all available menu items (`available = true`)
- Groups items by category dynamically
- Updates categories based on database content
- Maintains existing UI/UX with database integration

### Admin Panel

**Menu Management:**
- Full CRUD operations (Create, Read, Update, Delete)
- Real-time updates without page refresh
- **Dual Image Support**: External URLs + File uploads
- Toggle availability and featured status
- Filter by category
- Responsive modal editing with live preview

**Image Upload Workflow:**
1. **Select Upload Method**: Choose between URL or file upload
2. **File Validation**: Automatic format and size checking
3. **Live Preview**: See how the image will look in the menu card
4. **Secure Upload**: Files uploaded to Supabase storage bucket
5. **Auto URL Generation**: Uploaded files get public URLs automatically
6. **Database Storage**: Image paths stored in database for retrieval

### Data Flow

```
Database (Supabase) 
    ↓
MenuService (src/services/menuService.ts)
    ↓
React Hooks (src/hooks/useMenu.ts)
    ↓
Components (Home, Menu, Admin)
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

### 3. Fallback System
- Sample data shown if database is unavailable
- Graceful error handling
- No broken UI states

### 4. Security
- Row Level Security (RLS) enabled
- Public can only read available items
- Admin operations require authentication
- Secure file upload policies

## 🛠️ API Usage Examples

### Fetch Featured Items (Public)
```typescript
import { MenuService } from '../services/menuService'

const featuredItems = await MenuService.getFeaturedMenuItems()
```

### Create New Menu Item (Admin)
```typescript
const newItem = await MenuService.createMenuItem({
  name: "New Coffee",
  description: "Delicious coffee blend",
  price: 350,
  category: "Coffee",
  image: "https://example.com/image.jpg",
  available: true,
  featured: false,
  ingredients: ["Coffee Beans", "Milk"],
  prepTime: "3-5 mins",
  calories: 120,
  rating: 4.5
})
```

### Upload Image
```typescript
const filePath = await MenuService.uploadImage(file, menuItemId)
const publicUrl = MenuService.getImageUrl(filePath)
```

## 🧪 Testing Image Upload

### Step-by-Step Test

1. **Access Admin Panel**
   - Navigate to `/admin` and login
   - Go to Menu Management

2. **Check Database Status**
   - Green status = Ready to go
   - Red status = Run the SQL schema first

3. **Add New Menu Item with Image Upload**
   - Click "Add Menu Item"
   - Fill in basic details (name, description, price)
   - Select "Upload" tab for image
   - Choose an image file (JPEG, PNG, WebP, GIF under 5MB)
   - See live preview with price badge
   - Click "Add Item"

4. **Verify Image Display**
   - Check the admin grid shows the uploaded image
   - Visit home page - if marked as featured, should appear in carousel
   - Visit menu page - should appear in appropriate category

5. **Test Image URL Generation**
   - Uploaded images get URLs like: `https://your-project.supabase.co/storage/v1/object/public/menu-images/menu/filename.jpg`
   - Images are publicly accessible
   - No authentication required for viewing

## 🔍 Troubleshooting

### Common Issues

1. **"Unable to load menu items"**
   - Check Supabase URL and API key in `.env`
   - Verify database schema is created
   - Check browser console for errors

2. **Images not loading**
   - Verify storage bucket `menu-images` exists
   - Check storage policies are correctly set
   - Ensure image URLs are valid

3. **Admin operations failing**
   - Verify user is authenticated
   - Check RLS policies allow admin operations
   - Review browser console for error details

### Database Queries for Debugging

```sql
-- Check if menu items exist
SELECT COUNT(*) FROM menu_items;

-- Check featured items
SELECT name, featured FROM menu_items WHERE featured = true;

-- Check storage bucket
SELECT * FROM storage.buckets WHERE id = 'menu-images';

-- Check storage policies
SELECT * FROM storage.policies WHERE bucket_id = 'menu-images';
```

## 📈 Performance Considerations

- **Indexes**: Created on frequently queried columns (category, available, featured)
- **Image Optimization**: 5MB limit enforced, consider image compression
- **Caching**: Browser caches API responses automatically
- **Pagination**: Consider implementing for large menu catalogs

## 🔄 Migration from Mock Data

The system automatically handles the transition:
1. **Database available**: Uses real data
2. **Database unavailable**: Falls back to sample data
3. **Mixed state**: Shows what's available + fallback

No manual migration needed - the integration is seamless!

## 🎨 Customization

### Adding New Categories
Simply create menu items with new category names - they'll appear automatically in filters.

### Custom Fields
Extend the database schema and update TypeScript interfaces in:
- `src/admin/auth/supabaseClient.ts` (Database types)
- `src/services/menuService.ts` (MenuItem interface)

### UI Modifications
All existing components maintain their design - database integration is transparent to the UI layer.

---

**🎉 Your menu management system is now fully integrated with Supabase!**

The admin can manage menu items through the admin panel, and changes will immediately appear on the home page and menu page for all visitors.
