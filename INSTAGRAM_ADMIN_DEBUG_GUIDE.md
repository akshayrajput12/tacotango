# Instagram Admin Panel Debug Guide

## 🔍 **Current Issue**
Instagram posts are visible on the home page but NOT showing in the admin panel grid, even though they exist in the database.

## 🛠️ **Debug Tools Added**

I've added several debugging tools to help identify the issue:

### **1. Console Logging**
- Added detailed logging to `useAdminInstagram` hook
- Added logging to `createPost` function
- Added debug info display in admin panel

### **2. Debug Info Panel**
- Shows posts count, loading state, error state
- Shows filtered posts count and current filter
- Shows raw posts data (expandable)

### **3. Diagnostic Component**
- Tests Supabase connection
- Tests table access
- Tests service methods
- Tests authentication
- Tests RLS policies
- Can create test posts

### **4. Refresh Button**
- Manual refresh to trigger data fetching

## 🧪 **Step-by-Step Debugging Process**

### **Step 1: Access Admin Panel**
1. Go to `/admin` and login
2. Navigate to Instagram Management
3. **Check the debug info panel** - what does it show?

### **Step 2: Check Browser Console**
Open browser console (F12) and look for:
```
🔄 Fetching admin Instagram posts...
✅ Admin Instagram posts fetched: X posts
📋 Posts data: [array of posts]
```

**If you see errors here, that's the issue!**

### **Step 3: Run Diagnostics**
1. Click "🔍 Run Diagnostics" button
2. Check which tests pass/fail:
   - **Connection Test**: Can connect to Supabase?
   - **Table Test**: Can read from instagram_posts table?
   - **Service Test**: Does InstagramService.getAllPosts() work?
   - **Auth Test**: Is user authenticated?
   - **RLS Test**: Do Row Level Security policies allow access?

### **Step 4: Create Test Post**
1. Click "🧪 Create Test Post" button
2. Check if it creates successfully
3. Check if it appears in the grid after creation

### **Step 5: Manual Refresh**
1. Click "🔄 Refresh" button
2. Check if posts appear after manual refresh

## 🚨 **Common Issues & Solutions**

### **Issue 1: Authentication Problem**
**Symptoms**: Auth test fails, RLS test fails
**Solution**: 
```javascript
// Check if user is logged in
console.log(await supabase.auth.getUser())
```
- Re-login to admin panel
- Check if session is valid

### **Issue 2: RLS Policy Problem**
**Symptoms**: Connection works, but table test fails with permission error
**Solution**: Run the fixes SQL:
```sql
-- Copy and paste from supabase/instagram_schema_fixes.sql
```

### **Issue 3: Service Method Problem**
**Symptoms**: Table test passes, but service test fails
**Solution**: Check the transform function in `instagramService.ts`

### **Issue 4: Hook Not Updating**
**Symptoms**: Service test passes, but posts array is empty in debug info
**Solution**: Check React state management in `useAdminInstagram`

### **Issue 5: Component Not Re-rendering**
**Symptoms**: Posts exist in hook, but grid shows empty state
**Solution**: Check `filteredPosts` logic in admin component

## 🔧 **Quick Fixes to Try**

### **Fix 1: Clear Browser Cache**
```bash
# Hard refresh
Ctrl + Shift + R (Windows/Linux)
Cmd + Shift + R (Mac)
```

### **Fix 2: Re-run Database Schema**
```sql
-- If RLS policies are the issue
-- Copy and paste from supabase/instagram_schema_fixes.sql
```

### **Fix 3: Check Environment Variables**
```javascript
// In browser console
console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL)
console.log('Supabase Key:', import.meta.env.VITE_SUPABASE_ANON_KEY)
```

### **Fix 4: Manual Database Query**
```sql
-- In Supabase SQL Editor
SELECT COUNT(*) FROM instagram_posts;
SELECT * FROM instagram_posts LIMIT 5;
```

## 📋 **Expected Debug Output**

### **When Working Correctly:**
```
Debug Info:
Posts loaded: 5
Loading: No
Error: None
Filtered posts: 5
Current filter: all

Console:
🔄 Fetching admin Instagram posts...
✅ Admin Instagram posts fetched: 5 posts
📋 Posts data: [array with 5 posts]

Diagnostics:
✅ Connection Test: Passed
✅ Table Test: Passed (Records found: 5)
✅ Service Test: Passed (Records found: 5)
✅ Auth Test: Passed (User: admin@example.com)
✅ RLS Test: Passed
```

### **When Broken:**
```
Debug Info:
Posts loaded: 0
Loading: No
Error: [some error message]
Filtered posts: 0
Current filter: all

Console:
🔄 Fetching admin Instagram posts...
❌ Error fetching admin Instagram data: [error details]

Diagnostics:
❌ One or more tests failing
```

## 🎯 **Next Steps Based on Results**

### **If All Diagnostics Pass But No Posts Show:**
- Check React component rendering logic
- Check if `filteredPosts` is working correctly
- Check if `InstagramPostCard` component is rendering properly

### **If Service Test Fails:**
- Check `InstagramService.getAllPosts()` method
- Check database connection
- Check transform function

### **If Auth Test Fails:**
- Re-login to admin panel
- Check if admin user has proper permissions

### **If RLS Test Fails:**
- Run the database fixes SQL
- Check RLS policies in Supabase dashboard

## 🔄 **After Fixing**

1. **Remove debug code** (console.log statements)
2. **Remove diagnostic component** from production
3. **Remove debug info panel** from production
4. **Test the complete flow** again

## 📞 **Report Results**

Please run through this debugging process and report:

1. **What the debug info panel shows**
2. **What the browser console shows**
3. **Which diagnostic tests pass/fail**
4. **Any error messages you see**

This will help identify exactly where the issue is occurring!
