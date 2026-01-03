# Supabase Authentication Configuration

**Required for authentication to work correctly**

---

## 1. Enable Email Provider

**Location:** Supabase Dashboard → Authentication → Providers

**Steps:**
1. Go to your Supabase project dashboard
2. Click "Authentication" in left sidebar
3. Click "Providers" tab
4. Find "Email" provider
5. Ensure it's **ENABLED** (toggle should be ON)

---

## 2. Disable Email Confirmation (MVP Only)

**Location:** Supabase Dashboard → Authentication → Email Templates

**Option A: Disable Confirmation (Recommended for MVP)**

1. Go to Authentication → Settings
2. Scroll to "Email Confirmation"
3. **Uncheck** "Enable email confirmations"
4. Click "Save"

**Result:** Users can sign up and use the app immediately without email verification.

---

**Option B: Auto-Confirm via SQL (Alternative)**

If you can't disable via UI, run this SQL in SQL Editor:

```sql
-- Auto-confirm all new signups (MVP only)
CREATE OR REPLACE FUNCTION public.auto_confirm_user()
RETURNS trigger AS $$
BEGIN
  NEW.email_confirmed_at = NOW();
  NEW.confirmed_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER auto_confirm_user_trigger
  BEFORE INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION auto_confirm_user();
```

**Warning:** Only use for MVP/testing. Remove for production.

---

## 3. Verify JWT Settings

**Location:** Authentication → Settings → JWT Settings

**Ensure:**
- JWT expiry: 3600 seconds (1 hour) or higher
- Refresh token expiry: 604800 seconds (7 days) or higher

**Default settings are fine for MVP.**

---

## 4. Allowed Redirect URLs

**Location:** Authentication → URL Configuration

**Add your domains:**
```
http://localhost:5173
http://localhost:3000
https://your-app.vercel.app
https://your-custom-domain.com
```

**Note:** For MVP with no magic links, this is less critical, but good to set up.

---

## 5. Site URL

**Location:** Authentication → URL Configuration

**Set to your production URL:**
```
https://your-app.vercel.app
```

**For local dev:**
```
http://localhost:5173
```

---

## 6. Verify RLS Policies on profiles Table

**Required Policies:**

```sql
-- Users can view own profile
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Users can insert own profile
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Users can update own profile
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);
```

**These should already exist from DATABASE_SCHEMA.sql**

---

## 7. Email Templates (Optional Customization)

**Location:** Authentication → Email Templates

You can customize:
- Confirmation email (if using email confirmation)
- Password reset email
- Magic link email (not used in MVP)

**For MVP:** Default templates are fine.

---

## Quick Verification Checklist

**Before testing signup/login:**

- [ ] Email provider is enabled
- [ ] Email confirmation is disabled OR auto-confirm trigger exists
- [ ] JWT expiry is reasonable (3600 seconds minimum)
- [ ] Site URL is set to your domain
- [ ] profiles table exists
- [ ] RLS policies on profiles table exist
- [ ] Environment variables in Vercel are correct:
  - [ ] VITE_SUPABASE_URL
  - [ ] VITE_SUPABASE_ANON_KEY

---

## Testing Auth Configuration

**Test Signup:**

1. Go to your app's /auth/signup
2. Fill in details and submit
3. Check browser console:
   - ✅ Should see "Auth state changed: SIGNED_IN"
   - ❌ Should NOT see "Email not confirmed" error
4. Check Supabase Dashboard → Authentication → Users
   - User should appear immediately
   - email_confirmed_at should have a timestamp (or NULL is OK for MVP)

**If signup fails:**
- Check browser console for error message
- Check Supabase logs (Dashboard → Logs → Auth)
- Verify email provider is enabled
- Verify email confirmation is disabled

---

## Production Considerations

**For production deployment, you should:**

1. **Enable email confirmation** for security
2. **Set up email sending** (SMTP or Supabase's service)
3. **Customize email templates** with your branding
4. **Add password reset flow** (not in MVP)
5. **Set up rate limiting** to prevent abuse
6. **Add CAPTCHA** to signup form
7. **Monitor auth logs** for suspicious activity

**But for MVP, current setup is fine.**

---

## Common Issues

### "Email not confirmed" Error

**Solution:**
- Disable email confirmation in Supabase settings
- Or use auto-confirm trigger (see Option B above)

### "Invalid API key" Error

**Solution:**
- Check VITE_SUPABASE_ANON_KEY is correct
- Ensure you're using anon key, not service role key
- Regenerate keys if compromised

### Profile Not Created

**Solution:**
- Check RLS policies on profiles table
- Check if database trigger exists to auto-create profile
- AuthContext will create profile manually if needed

### Session Not Persisting

**Solution:**
- Check localStorage is enabled in browser
- Check Supabase client initialization
- Check JWT expiry isn't too short

---

## Environment Variables

**Vercel (Production):**
```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
```

**Local (.env.local):**
```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
```

**Get these values from:**
Supabase Dashboard → Settings → API

---

## Summary

**Minimum Required Configuration:**

1. ✅ Enable Email provider
2. ✅ Disable email confirmation (MVP only)
3. ✅ Set Site URL
4. ✅ Verify environment variables

**Time Required:** 5 minutes

**Complexity:** Low

**After setup:** Signup and login should work immediately

---

**Status:** Ready for configuration  
**Estimated Time:** 5 minutes  
**Difficulty:** Easy  
**Required for:** Authentication to work
