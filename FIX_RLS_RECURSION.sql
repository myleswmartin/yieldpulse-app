-- ================================================================
-- FIX FOR INFINITE RECURSION IN RLS POLICIES
-- ================================================================
-- Run this SQL in your Supabase SQL Editor to fix the infinite recursion error
-- This creates a helper function and updates the RLS policies

-- ================================================================
-- STEP 1: Create helper function to check admin status
-- ================================================================
-- This function uses SECURITY DEFINER to bypass RLS and prevent infinite recursion
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = user_id AND is_admin = TRUE
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ================================================================
-- STEP 2: Drop problematic policies on profiles table
-- ================================================================
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;

-- ================================================================
-- STEP 3: Recreate policies with the helper function
-- ================================================================
CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  USING (public.is_admin(auth.uid()));

-- ================================================================
-- STEP 4: Drop problematic policies on analyses table
-- ================================================================
DROP POLICY IF EXISTS "Admins can view all analyses" ON analyses;
DROP POLICY IF EXISTS "Admins can update all analyses" ON analyses;

-- ================================================================
-- STEP 5: Recreate policies with the helper function
-- ================================================================
CREATE POLICY "Admins can view all analyses"
  ON analyses FOR SELECT
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update all analyses"
  ON analyses FOR UPDATE
  USING (public.is_admin(auth.uid()));

-- ================================================================
-- STEP 6: Fix payments table policies
-- ================================================================
DROP POLICY IF EXISTS "Admins can view all payments" ON payments;

CREATE POLICY "Admins can view all payments"
  ON payments FOR SELECT
  USING (public.is_admin(auth.uid()));

-- ================================================================
-- STEP 7: Fix report_files table policies (if exists)
-- ================================================================
DROP POLICY IF EXISTS "Admins can view all report files" ON report_files;

CREATE POLICY "Admins can view all report files"
  ON report_files FOR SELECT
  USING (public.is_admin(auth.uid()));

-- ================================================================
-- STEP 8: Add missing INSERT policy for profiles (optional but recommended)
-- ================================================================
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ================================================================
-- VERIFICATION
-- ================================================================
-- Test that the fix works by running these queries:
-- SELECT * FROM profiles WHERE id = auth.uid();
-- SELECT * FROM analyses WHERE user_id = auth.uid();

-- If you're an admin, you should also be able to:
-- SELECT * FROM profiles;
-- SELECT * FROM analyses;

-- ================================================================
-- COMPLETE
-- ================================================================
-- The infinite recursion errors should now be resolved.
-- Refresh your application to see the changes take effect.
