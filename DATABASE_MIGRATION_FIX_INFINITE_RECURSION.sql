-- ================================================================
-- YieldPulse Database Migration: Fix Infinite Recursion in RLS Policies
-- ================================================================
-- 
-- PROBLEM: Foreign keys referencing profiles(id) cause infinite recursion
-- when RLS policies are enabled on profiles table.
--
-- SOLUTION: Change foreign keys to reference auth.users(id) instead.
--
-- Execute this script in your Supabase SQL Editor to fix the issue.
-- ================================================================

-- Step 1: Drop existing foreign key constraints
ALTER TABLE analyses DROP CONSTRAINT IF EXISTS analyses_user_id_fkey;
ALTER TABLE payments DROP CONSTRAINT IF EXISTS payments_user_id_fkey;
ALTER TABLE report_files DROP CONSTRAINT IF EXISTS report_files_user_id_fkey;

-- Step 2: Add new foreign key constraints pointing to auth.users(id)
ALTER TABLE analyses 
  ADD CONSTRAINT analyses_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE payments 
  ADD CONSTRAINT payments_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE report_files 
  ADD CONSTRAINT report_files_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- ================================================================
-- VERIFICATION
-- ================================================================
-- Run these queries to verify the fix worked:
--
-- 1. Check that foreign keys now reference auth.users:
--
-- SELECT
--   tc.table_name, 
--   kcu.column_name, 
--   ccu.table_name AS foreign_table_name,
--   ccu.column_name AS foreign_column_name 
-- FROM information_schema.table_constraints AS tc 
-- JOIN information_schema.key_column_usage AS kcu
--   ON tc.constraint_name = kcu.constraint_name
-- JOIN information_schema.constraint_column_usage AS ccu
--   ON ccu.constraint_name = tc.constraint_name
-- WHERE tc.constraint_type = 'FOREIGN KEY'
--   AND tc.table_name IN ('analyses', 'payments', 'report_files')
--   AND kcu.column_name = 'user_id';
--
-- Expected result: All should reference auth.users(id)
--
-- 2. Test that you can now query analyses without recursion errors:
--
-- SELECT * FROM analyses LIMIT 1;
--
-- If this works without errors, the fix is successful!
-- ================================================================
