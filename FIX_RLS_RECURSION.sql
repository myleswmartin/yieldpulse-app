-- ================================================================
-- FIX: Infinite Recursion in RLS Policies
-- ================================================================
-- This script fixes the "infinite recursion detected in policy for relation profiles" error
-- 
-- INSTRUCTIONS:
-- 1. Open your Supabase project dashboard
-- 2. Go to SQL Editor
-- 3. Copy and paste this entire script
-- 4. Click "Run" to execute
-- 5. Refresh your YieldPulse application
-- ================================================================

-- Step 1: Drop the problematic admin policy on profiles table
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;

-- Step 2: Update the is_admin function to use SECURITY DEFINER properly
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  admin_status BOOLEAN;
BEGIN
  -- Use SECURITY DEFINER to bypass RLS when checking admin status
  SELECT is_admin INTO admin_status
  FROM public.profiles
  WHERE id = user_id;
  
  RETURN COALESCE(admin_status, FALSE);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ================================================================
-- VERIFICATION
-- ================================================================
-- After running this script, verify the fix by running these queries:

-- 1. Check that the problematic policy is removed:
-- SELECT * FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Admins can view all profiles';
-- (Should return 0 rows)

-- 2. Check remaining policies on profiles table:
-- SELECT policyname, cmd, qual FROM pg_policies WHERE tablename = 'profiles';
-- (Should show only: "Users can view own profile", "Users can update own profile", "Users can insert own profile")

-- 3. Test profile access:
-- SELECT * FROM profiles WHERE id = auth.uid();
-- (Should return your profile without errors)

-- ================================================================
-- EXPLANATION
-- ================================================================
-- The infinite recursion was caused by:
-- 1. The "Admins can view all profiles" policy on the profiles table called is_admin()
-- 2. is_admin() queries the profiles table
-- 3. Querying profiles triggers RLS policies
-- 4. The admin policy calls is_admin() again → infinite loop
--
-- The fix:
-- 1. Remove the admin policy from profiles table
-- 2. Mark is_admin() as SECURITY DEFINER to bypass RLS
-- 3. Admin access to profiles is now handled via service role key, not RLS
-- ================================================================

-- Done! Your database should now work without recursion errors.
