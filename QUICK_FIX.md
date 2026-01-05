# ⚡ QUICK FIX - Infinite Recursion Error

## 🔴 Error
```
Error: "infinite recursion detected in policy for relation 'profiles'"
```

## ✅ Fix (2 minutes)

### 1. Open Supabase
Go to: https://supabase.com/dashboard → Your Project → SQL Editor

### 2. Run This Script
```sql
-- Fix infinite recursion
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;

CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  admin_status BOOLEAN;
BEGIN
  SELECT is_admin INTO admin_status
  FROM public.profiles
  WHERE id = user_id;
  
  RETURN COALESCE(admin_status, FALSE);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### 3. Refresh App
Hard refresh your YieldPulse app (Ctrl+Shift+R)

## ✅ Done!
All errors should be gone. Dashboard and analyses work normally.

---

**See `/DATABASE_FIX_INSTRUCTIONS.md` for detailed explanation**
