# RLS Infinite Recursion Fix Instructions

## Problem
The error "infinite recursion detected in policy for relation 'profiles'" was caused by RLS policies that created a circular dependency. When checking if a user is an admin, the policies queried the `profiles` table, which triggered the RLS policies again, creating an infinite loop.

## Root Cause
The problematic policies were:

```sql
-- This causes infinite recursion:
CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles  -- ← This queries profiles again!
      WHERE id = auth.uid() AND is_admin = TRUE
    )
  );
```

When a query tries to access the `profiles` table, it runs this policy. The policy itself queries `profiles`, which triggers the policy again, creating infinite recursion.

## Solution
Create a **SECURITY DEFINER** function that bypasses RLS to check admin status:

```sql
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = user_id AND is_admin = TRUE
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

The `SECURITY DEFINER` clause makes the function run with the privileges of its creator (bypassing RLS), preventing the infinite recursion.

## How to Apply the Fix

### Option 1: Quick Fix (Recommended for Existing Database)
1. Open your Supabase Dashboard
2. Go to **SQL Editor**
3. Open the file `/FIX_RLS_RECURSION.sql`
4. Copy and paste the entire content into the SQL Editor
5. Click **Run** or press `Ctrl+Enter`
6. Refresh your YieldPulse application

### Option 2: Complete Schema Reset (Only if you want to start fresh)
⚠️ **WARNING: This will delete all existing data!**

1. Open your Supabase Dashboard
2. Go to **SQL Editor**
3. Delete all existing tables:
   ```sql
   DROP TABLE IF EXISTS report_files CASCADE;
   DROP TABLE IF EXISTS payments CASCADE;
   DROP TABLE IF EXISTS analyses CASCADE;
   DROP TABLE IF EXISTS profiles CASCADE;
   DROP FUNCTION IF EXISTS public.is_admin(UUID);
   DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
   DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
   ```
4. Open the file `/DATABASE_SCHEMA.sql`
5. Copy and paste the entire content into the SQL Editor
6. Click **Run** or press `Ctrl+Enter`
7. Refresh your YieldPulse application

## Verification

After applying the fix, verify it works:

1. **Test as Regular User:**
   - Sign in as a regular user
   - Go to Dashboard
   - You should see only your own analyses (no errors)

2. **Test Profile Loading:**
   - Check browser console (F12)
   - You should NOT see any "infinite recursion" errors
   - Profile data should load successfully

3. **Test as Admin (if applicable):**
   - Sign in as an admin user
   - You should see all profiles and analyses
   - No errors should appear

## What Changed

### Files Modified:
1. **`/DATABASE_SCHEMA.sql`** - Updated with security definer function and fixed policies
2. **`/FIX_RLS_RECURSION.sql`** - Created (standalone fix for existing databases)
3. **`/RLS_FIX_INSTRUCTIONS.md`** - Created (this file)

### Changes Made:
1. ✅ Created `public.is_admin(UUID)` function with `SECURITY DEFINER`
2. ✅ Updated all admin policies to use the helper function instead of querying profiles directly
3. ✅ Added missing INSERT policy for profiles table
4. ✅ Fixed policies on: `profiles`, `analyses`, `payments`, `report_files`

## Technical Details

### Before (Problematic):
```sql
CREATE POLICY "Admins can view all analyses"
  ON analyses FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles  -- Causes recursion
      WHERE id = auth.uid() AND is_admin = TRUE
    )
  );
```

### After (Fixed):
```sql
CREATE POLICY "Admins can view all analyses"
  ON analyses FOR SELECT
  USING (public.is_admin(auth.uid()));  -- No recursion
```

## Troubleshooting

### If you still see errors after applying the fix:

1. **Clear browser cache and refresh:**
   - Press `Ctrl+Shift+R` (or `Cmd+Shift+R` on Mac)

2. **Verify the function exists:**
   ```sql
   SELECT routine_name 
   FROM information_schema.routines 
   WHERE routine_schema = 'public' 
   AND routine_name = 'is_admin';
   ```
   Should return 1 row.

3. **Verify policies are using the function:**
   ```sql
   SELECT tablename, policyname 
   FROM pg_policies 
   WHERE schemaname = 'public';
   ```
   Admin policies should reference `is_admin(auth.uid())`

4. **Check for lingering connections:**
   - Sign out completely
   - Close all browser tabs
   - Open a new incognito/private window
   - Sign in again

### If problems persist:
- Check Supabase logs in Dashboard > Logs
- Ensure you're using the latest Supabase client version
- Verify environment variables are correct

## Security Notes

The `SECURITY DEFINER` function is safe because:
- It only checks a boolean flag (`is_admin`)
- It doesn't expose sensitive data
- It only returns TRUE/FALSE
- Users still can't modify the `is_admin` flag (UPDATE policies prevent this)

## Support

If you encounter any issues:
1. Check the browser console for detailed error messages
2. Check Supabase Dashboard > Logs for backend errors
3. Verify all SQL commands completed successfully
4. Test with a fresh sign-up to ensure policies work for new users

---

**Status:** ✅ Fixed
**Last Updated:** 2026-01-02
**Issue:** Infinite recursion in RLS policies
**Resolution:** Security definer function to bypass RLS for admin checks
