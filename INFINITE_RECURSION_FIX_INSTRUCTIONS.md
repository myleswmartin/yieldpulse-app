# 🔧 Fix: Infinite Recursion in RLS Policies

## ❌ Problem

You're experiencing this error when trying to save analyses or view your dashboard:

```
infinite recursion detected in policy for relation "profiles"
```

## 🎯 Root Cause

The database schema had foreign key constraints that referenced `profiles(id)` instead of `auth.users(id)`:

```sql
-- ❌ WRONG (causes infinite recursion)
user_id UUID REFERENCES profiles(id) ON DELETE CASCADE

-- ✅ CORRECT
user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
```

When PostgreSQL enforces foreign key constraints with RLS enabled on the `profiles` table, it creates a circular dependency that causes infinite recursion.

## 🚀 Fix Instructions

### Option 1: Quick Fix (For Existing Databases)

1. **Open Supabase SQL Editor**
   - Go to your Supabase project dashboard
   - Navigate to: **SQL Editor** (left sidebar)

2. **Run the Migration Script**
   - Copy the contents of `DATABASE_MIGRATION_FIX_INFINITE_RECURSION.sql`
   - Paste into the SQL Editor
   - Click **Run** (or press Cmd/Ctrl + Enter)

3. **Verify the Fix**
   - Run this test query in SQL Editor:
   ```sql
   SELECT * FROM analyses LIMIT 1;
   ```
   - If it works without errors, the fix is successful!

### Option 2: Fresh Database Setup

If you're setting up a new database or want to recreate tables:

1. **Drop existing tables** (⚠️ WARNING: This deletes all data!)
   ```sql
   DROP TABLE IF EXISTS report_files CASCADE;
   DROP TABLE IF EXISTS payments CASCADE;
   DROP TABLE IF EXISTS analyses CASCADE;
   DROP TABLE IF EXISTS profiles CASCADE;
   ```

2. **Run the updated schema**
   - Copy the entire contents of `DATABASE_SCHEMA.sql`
   - Paste into the SQL Editor
   - Click **Run**

## ✅ What Was Fixed

### Changed Foreign Keys

**analyses table:**
```sql
-- Before: user_id UUID REFERENCES profiles(id)
-- After:  user_id UUID REFERENCES auth.users(id)
```

**payments table:**
```sql
-- Before: user_id UUID REFERENCES profiles(id)
-- After:  user_id UUID REFERENCES auth.users(id)
```

**report_files table:**
```sql
-- Before: user_id UUID REFERENCES profiles(id)
-- After:  user_id UUID REFERENCES auth.users(id)
```

### Why This Works

- `auth.users` table does **NOT** have RLS enabled
- No circular dependency when PostgreSQL validates foreign keys
- RLS policies on `profiles`, `analyses`, `payments`, and `report_files` still work correctly
- `profiles.id` still matches `auth.users.id` (1:1 relationship)

## 🧪 Testing

After applying the fix, test these operations:

1. **Save an analysis** from the calculator page
2. **View your dashboard** - analyses should load
3. **View reports page** - purchased reports should display
4. **Compare properties** - comparison should work

All should work without "infinite recursion" errors.

## 📋 Files Updated

1. `DATABASE_SCHEMA.sql` - Updated schema with correct foreign keys
2. `DATABASE_MIGRATION_FIX_INFINITE_RECURSION.sql` - Migration script for existing databases

## ❓ FAQ

**Q: Will this delete my data?**  
A: The migration script (Option 1) only modifies foreign key constraints. Your data is preserved. However, always backup first!

**Q: What if I still get the error?**  
A: Make sure:
1. You ran the migration script completely
2. You refreshed your browser
3. The `profiles` table doesn't have custom policies that reference itself

**Q: Can I undo this?**  
A: You can revert by changing foreign keys back to `profiles(id)`, but the infinite recursion will return.

## 🔍 Verification Query

Run this in SQL Editor to verify foreign keys are correct:

```sql
SELECT
  tc.table_name, 
  kcu.column_name, 
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name 
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_name IN ('analyses', 'payments', 'report_files')
  AND kcu.column_name = 'user_id';
```

**Expected Result:** All `foreign_table_name` should show `users` (from `auth.users`), not `profiles`.

---

**Need Help?** Check your browser console and Supabase logs for any remaining errors.
