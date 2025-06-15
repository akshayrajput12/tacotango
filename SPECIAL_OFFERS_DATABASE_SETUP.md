# CafeX Special Offers Management Database Setup

This guide explains how to set up and use the Supabase database integration for Special Offers management in CafeX.

## 🚀 Quick Setup

### 1. Database Schema Setup

1. **Open your Supabase project dashboard**
2. **Go to SQL Editor**
3. **Copy and paste the entire content from `supabase/special_offers_schema.sql`**
4. **Execute the SQL script**

This will create:
- ✅ `special_offers` table with all required fields
- ✅ Storage bucket `offer-images` for image uploads (5MB limit)
- ✅ Row Level Security (RLS) policies for public/admin access
- ✅ Sample data with 5 existing special offers
- ✅ Helpful database functions and triggers
- ✅ Auto sort order management
- ✅ Views for different offer states

### 2. Environment Variables

Make sure your `.env` file has the correct Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Test the Integration

1. **Start your development server**: `npm run dev`
2. **Visit the events page** - Special Offers section should load from database
3. **Access admin panel** - Login and manage offers with full CRUD operations

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

### Special Offers Table

```sql
CREATE TABLE special_offers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    discount VARCHAR(100) NOT NULL,        -- e.g., "25%", "BOGO", "₹100 OFF"
    image_url TEXT,                        -- For external URLs
    image_file_path TEXT,                  -- For uploaded files
    timing VARCHAR(255),                   -- e.g., "Monday to Friday, 4:00 PM - 6:00 PM"
    valid_from DATE NOT NULL,
    valid_until DATE NOT NULL,
    terms TEXT[],                          -- Array of terms and conditions
    popular_items TEXT[],                  -- Array of popular items
    bg_color VARCHAR(50) DEFAULT 'bg-orange-50',
    border_color VARCHAR(50) DEFAULT 'border-orange-200',
    text_color VARCHAR(50) DEFAULT 'text-orange-800',
    button_color VARCHAR(50) DEFAULT 'bg-orange-600 hover:bg-orange-700',
    featured BOOLEAN DEFAULT false,        -- Show on events page
    active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Storage Bucket

- **Bucket Name**: `offer-images`
- **Public Access**: Yes
- **File Size Limit**: 5MB
- **Allowed Types**: JPEG, PNG, WebP, GIF

## 🔧 How It Works

### Public Pages (Events Page)

**Events Page (`SpecialOffers` component):**
- Fetches featured special offers (`featured = true` and `active = true`)
- Shows loading spinner during data fetch
- Displays empty state if no offers available
- Maintains existing design with dynamic colors and styling

### Admin Panel

**Special Offers Management:**
- Full CRUD operations (Create, Read, Update, Delete)
- Real-time updates without page refresh
- **Dual Image Support**: External URLs + File uploads
- **Dynamic Styling**: Customizable colors for each offer
- **Timing Management**: Optional timing field for specific hours
- **Popular Items**: Array of popular items for each offer
- **Terms & Conditions**: Array of terms for each offer
- **Featured Toggle**: Mark offers to show on events page
- **Sort Order Management**: Custom ordering of offers
- **Status Filtering**: Filter by active, inactive, or expired offers

**Offer Creation Workflow:**
1. **Fill Basic Info**: Title, description, discount amount
2. **Select Image Method**: Choose between URL or file upload
3. **Set Validity**: Valid from and until dates
4. **Add Details**: Timing, popular items, terms & conditions
5. **Customize Appearance**: Background, border, text, and button colors
6. **Set Status**: Featured, active, sort order
7. **Save**: Offer appears immediately on events page (if featured)

### Data Flow

```
Database (Supabase) 
    ↓
SpecialOffersService (src/services/specialOffersService.ts)
    ↓
React Hooks (src/hooks/useSpecialOffers.ts)
    ↓
Components (Events Page, Admin Panel)
```

## 🎯 Key Features

### 1. Dynamic Styling System
- **Customizable Colors**: Each offer can have unique background, border, text, and button colors
- **Tailwind Integration**: Uses Tailwind CSS classes stored in database
- **Live Preview**: Admin can see how offers will look while editing

### 2. Featured Offers System
- **Events Page Display**: Only featured offers appear on events page
- **Admin Control**: Toggle featured status for any offer
- **Automatic Filtering**: Expired offers don't show even if featured

### 3. Comprehensive Offer Details
- **Timing Information**: Optional specific hours (e.g., "4 PM - 6 PM")
- **Popular Items**: Highlight popular items for each offer
- **Terms & Conditions**: Detailed terms stored as array
- **Validity Dates**: Precise start and end dates

### 4. Advanced Filtering
- **Status-based**: Active, inactive, expired offers
- **Date-based**: Automatically detect expired offers
- **Featured**: Separate view for featured offers
- **Sort Order**: Custom ordering for display

### 5. Image Management
- **Dual Upload**: URLs or file uploads
- **Storage Integration**: Secure Supabase storage
- **Preview System**: Live preview in admin panel
- **Automatic URLs**: Uploaded files get public URLs

## 🛠️ API Usage Examples

### Fetch Featured Special Offers (Events Page)
```typescript
import { SpecialOffersService } from '../services/specialOffersService'

const featuredOffers = await SpecialOffersService.getFeaturedOffers()
```

### Create New Special Offer (Admin)
```typescript
const newOffer = await SpecialOffersService.createOffer({
  title: "Happy Hour Special",
  description: "25% off all beverages during happy hour",
  discount: "25%",
  image: "https://example.com/image.jpg",
  timing: "Monday to Friday, 4:00 PM - 6:00 PM",
  validFrom: "2024-01-01",
  validUntil: "2024-12-31",
  terms: ["Valid during specified hours", "Cannot be combined with other offers"],
  popularItems: ["Craft Beer", "Wine Selection", "Cocktails"],
  bgColor: "bg-amber-50",
  borderColor: "border-amber-200",
  textColor: "text-amber-800",
  buttonColor: "bg-amber-600 hover:bg-amber-700",
  featured: true,
  active: true,
  sortOrder: 1
})
```

### Upload Offer Image
```typescript
const filePath = await SpecialOffersService.uploadImage(file, offerId)
const publicUrl = SpecialOffersService.getImageUrl(filePath)
```

## 🧪 Testing Special Offers System

### Step-by-Step Test

1. **Access Admin Panel**
   - Navigate to `/admin` and login
   - Go to Special Offers Management

2. **Add New Special Offer**
   - Click "Create New Offer"
   - Fill in offer details (title, description, discount)
   - Choose image method (URL or upload)
   - Set validity dates
   - Add timing, popular items, and terms
   - Customize colors if desired
   - Mark as "Featured" to show on events page
   - Click "Create Offer"

3. **Verify Offer Display**
   - Check the admin grid shows the new offer
   - Visit events page - offer should appear in Special Offers section
   - Verify colors, styling, and content match admin settings

4. **Test Filtering**
   - Use status filters in admin panel (All, Active, Inactive, Expired)
   - Verify filtering works correctly
   - Test featured offers display

5. **Test Offer Management**
   - Edit existing offers
   - Toggle active/inactive status
   - Delete offers
   - Verify changes reflect on events page

## 🔍 Troubleshooting

### Common Issues

1. **"Unable to load special offers"**
   - Check Supabase URL and API key in `.env`
   - Verify database schema is created
   - Check browser console for errors

2. **Offers not showing on events page**
   - Verify offers are marked as `featured = true`
   - Check offers are `active = true`
   - Ensure offers haven't expired (`valid_until >= today`)

3. **Image upload failing**
   - Verify storage bucket `offer-images` exists
   - Check storage policies are correctly set
   - Ensure file size is under 5MB

4. **Colors not applying correctly**
   - Verify Tailwind CSS classes are valid
   - Check color values in database match Tailwind format
   - Ensure CSS is properly compiled

### Database Queries for Debugging

```sql
-- Check if special offers exist
SELECT COUNT(*) FROM special_offers;

-- Check featured offers
SELECT title, featured, active, valid_until FROM special_offers WHERE featured = true;

-- Check storage bucket
SELECT * FROM storage.buckets WHERE id = 'offer-images';

-- Check expired offers
SELECT title, valid_until FROM special_offers WHERE valid_until < CURRENT_DATE;
```

## 📈 Performance Considerations

- **Indexes**: Created on frequently queried columns (active, featured, valid dates, sort_order)
- **Image Optimization**: 5MB limit enforced, consider image compression
- **Caching**: Browser caches API responses automatically
- **Efficient Queries**: Separate hooks for different use cases

## 🔄 Migration from Static Data

The system automatically handles the transition:
1. **Database available**: Uses real data from Supabase
2. **Database unavailable**: Shows empty state with guidance
3. **Mixed state**: Shows what's available

No manual migration needed - the integration is seamless!

## 🎨 Customization

### Adding New Color Schemes
Update the color options in the admin form and ensure Tailwind classes are available.

### Custom Fields
Extend the database schema and update TypeScript interfaces in:
- `src/services/specialOffersService.ts` (SpecialOffer interface)
- `src/admin/components/cards/SpecialOfferCard.tsx` (Form fields)

### UI Modifications
All existing components maintain their design - database integration is transparent to the UI layer.

---

**🎉 Your special offers management system is now fully integrated with Supabase!**

The admin can manage special offers through the admin panel, and featured offers will immediately appear on the events page for all visitors with beautiful, customizable styling and comprehensive offer details.
