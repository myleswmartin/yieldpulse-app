# YieldPulse - Quick Start Guide

**For:** Manual deployment from Figma Make to production  
**Time Required:** 30-60 minutes (first time)

---

## 🎯 Goal

Get YieldPulse from Figma Make → GitHub → Vercel → Live Production in under 1 hour.

---

## ✅ Prerequisites Checklist

Before starting, ensure you have:

- [ ] Figma Make account with this project
- [ ] GitHub account
- [ ] Vercel account (connected to GitHub)
- [ ] Supabase account with project created
- [ ] Supabase CLI installed (`npm install -g supabase`)
- [ ] Git installed on your machine
- [ ] Node.js and pnpm installed

---

## 🚀 Deployment Steps (30-60 minutes)

### Step 1: Sync Figma Make to GitHub (10 min)

**Option A: Using Figma Make Git Integration (Recommended)**
1. In Figma Make, look for Git/GitHub integration button
2. Connect to your GitHub repository
3. Select branch: `main` or `master`
4. Click "Push to GitHub" or "Sync"
5. Wait for all files to upload
6. Verify on GitHub that all files are present

**Option B: Manual Export (If no Git integration)**
1. Export all files from Figma Make
2. Clone your GitHub repository locally
3. Copy all exported files into repo
4. Commit and push:
   ```bash
   git add .
   git commit -m "Initial YieldPulse MVP deployment"
   git push origin main
   ```

**Verification:**
- [ ] Visit your GitHub repository
- [ ] Check that `/src/pages/` has 6 files
- [ ] Check that `/src/components/` exists
- [ ] Check that `vercel.json` exists
- [ ] Check that `package.json` exists

---

### Step 2: Set Up Supabase Database (10 min)

1. **Open Supabase Dashboard**
   - Go to https://supabase.com/dashboard
   - Select your project

2. **Execute Database Schema**
   - Click "SQL Editor" in left sidebar
   - Click "New Query"
   - Copy entire contents of `DATABASE_SCHEMA.sql` from your repo
   - Paste into editor
   - Click "Run"
   - Wait for success message

3. **Verify Tables Created**
   - Click "Table Editor" in sidebar
   - Should see tables:
     - profiles
     - analyses
     - payments
     - report_files

4. **Get Your Supabase Credentials**
   - Click "Settings" → "API"
   - Copy these values:
     - Project URL (looks like: https://xxx.supabase.co)
     - anon public key (long string starting with "eyJ...")
     - service_role key (long string starting with "eyJ...")

**Verification:**
- [ ] All tables created
- [ ] RLS enabled on all tables
- [ ] Credentials copied to safe place

---

### Step 3: Deploy Supabase Edge Function (5 min)

1. **Link Your Supabase Project**
   ```bash
   cd your-repo-directory
   supabase link --project-ref YOUR_PROJECT_REF
   ```
   (Find project ref in Supabase settings)

2. **Deploy the Function**
   ```bash
   supabase functions deploy make-server-ef294769
   ```

3. **Set Environment Variables**
   ```bash
   supabase secrets set SUPABASE_URL=https://xxx.supabase.co
   supabase secrets set SUPABASE_ANON_KEY=your_anon_key
   supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

**Verification:**
- [ ] Function deployed successfully
- [ ] Secrets set (run `supabase secrets list`)
- [ ] Function shows in Supabase Dashboard → Edge Functions

---

### Step 4: Configure Vercel (10 min)

1. **Connect GitHub Repository**
   - Go to https://vercel.com/dashboard
   - Click "Add New" → "Project"
   - Import your GitHub repository
   - Click "Import"

2. **Configure Build Settings**
   - Framework Preset: **Vite**
   - Build Command: `pnpm build`
   - Output Directory: `dist`
   - Install Command: `pnpm install`
   - Leave Root Directory as `.`

3. **Add Environment Variables**
   Click "Environment Variables" and add:
   
   | Name | Value |
   |------|-------|
   | `VITE_SUPABASE_URL` | `https://xxx.supabase.co` |
   | `VITE_SUPABASE_ANON_KEY` | `eyJ...` (your anon key) |

   - Select "Production, Preview, and Development" for both
   - Click "Add" for each

4. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes for build
   - Watch build logs for errors

**Verification:**
- [ ] Build completed successfully
- [ ] No errors in build logs
- [ ] Deployment shows "Ready"
- [ ] You have a Vercel URL (e.g., your-app.vercel.app)

---

### Step 5: Test Production Deployment (15 min)

Use `DEPLOYMENT_VERIFICATION.md` for complete testing, but here's the quick version:

1. **Test Homepage**
   - [ ] Visit your Vercel URL
   - [ ] Page loads without errors
   - [ ] Click "Get Started" → Goes to `/calculator`

2. **Test Sign Up**
   - [ ] Go to `/auth/signup`
   - [ ] Create test account: test@example.com / password123
   - [ ] Should redirect to `/dashboard`
   - [ ] Check Supabase: auth.users should have 1 user

3. **Test Calculator**
   - [ ] Click "New Analysis"
   - [ ] Use default values
   - [ ] Click "Calculate ROI"
   - [ ] Results appear
   - [ ] Check Supabase: analyses table should have 1 row

4. **Test Dashboard**
   - [ ] Go to `/dashboard`
   - [ ] Should show 1 analysis
   - [ ] Click "View" → See results
   - [ ] Click "Delete" → Analysis removed

5. **Test Sign Out/In**
   - [ ] Sign out
   - [ ] Try to access `/dashboard` → Redirects to sign in
   - [ ] Sign in with same credentials
   - [ ] Dashboard loads (no analyses now)

**If all tests pass:** ✅ Deployment successful!

---

## 🔧 Troubleshooting

### Build Fails on Vercel

**Check:**
- Build logs for specific error
- All files present in GitHub
- package.json has all dependencies
- No TypeScript errors

**Common Fix:**
```bash
# Locally, run:
pnpm install
pnpm build

# If it works locally but not on Vercel:
# - Check Node version (Vercel uses 18.x)
# - Ensure pnpm-lock.yaml is committed
```

---

### Database Errors

**Symptom:** "Failed to save analysis" in console

**Check:**
1. Environment variables in Vercel are correct
2. VITE_SUPABASE_URL has `https://`
3. VITE_SUPABASE_ANON_KEY is the anon key (not service role)
4. Database schema executed successfully
5. RLS policies enabled

**Fix:**
- Re-check environment variables
- Re-deploy Vercel (trigger new build)
- Check Supabase logs

---

### Edge Function Errors

**Symptom:** 500 errors when saving

**Check:**
1. Function deployed: `supabase functions list`
2. Secrets set: `supabase secrets list`
3. Logs: `supabase functions logs make-server-ef294769`

**Fix:**
```bash
# Re-deploy function
supabase functions deploy make-server-ef294769 --no-verify-jwt

# Check logs for errors
supabase functions logs make-server-ef294769
```

---

### Can't Sign In

**Symptom:** "Invalid credentials" error

**Check:**
1. User exists in Supabase auth.users
2. Profile created in profiles table
3. Email is confirmed (should auto-confirm)

**Fix:**
- Try creating new account
- Check Supabase auth logs
- Verify SUPABASE_ANON_KEY is correct

---

### Routes Don't Work (404 on refresh)

**Symptom:** `/calculator` works first time, 404 on refresh

**Check:**
- `vercel.json` exists in root
- Contains SPA rewrites configuration

**Fix:**
Ensure `vercel.json` has:
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

Then redeploy.

---

## 📊 Production Checklist

After deployment, verify these are set up:

### Security
- [ ] HTTPS enabled (automatic with Vercel)
- [ ] Environment variables not in code
- [ ] RLS enabled on all tables
- [ ] CORS configured on Edge Function

### Performance
- [ ] Build size < 500KB (check Vercel dashboard)
- [ ] Page loads < 3 seconds
- [ ] No console errors

### Functionality
- [ ] All 6 routes work
- [ ] Auth flows work
- [ ] Calculator produces results
- [ ] Database saves work
- [ ] Dashboard displays data

### Monitoring
- [ ] Vercel Analytics enabled (optional)
- [ ] Supabase logs accessible
- [ ] Error tracking set up (optional)

---

## 🎉 Success!

If you've completed all steps and tests pass, your YieldPulse MVP is **LIVE IN PRODUCTION!**

### Your Live URLs:
- Homepage: `https://your-app.vercel.app/`
- Calculator: `https://your-app.vercel.app/calculator`
- Dashboard: `https://your-app.vercel.app/dashboard`

### Next Steps:
1. Set up custom domain (optional)
2. Enable Vercel Analytics
3. Monitor usage
4. Plan Phase 2 (Stripe payments)

---

## 🆘 Need Help?

### Documentation
- `MVP_COMPLETE.md` - Full feature list
- `DEPLOYMENT_VERIFICATION.md` - Complete testing checklist
- `ROUTES_REFERENCE.md` - All routes explained
- `IMPLEMENTATION_SUMMARY.md` - Technical details

### Common Resources
- Vercel Docs: https://vercel.com/docs
- Supabase Docs: https://supabase.com/docs
- Vite Docs: https://vitejs.dev

### Debugging Commands
```bash
# Check Vercel deployment logs
vercel logs your-app.vercel.app

# Check Supabase function logs
supabase functions logs make-server-ef294769

# Check database
# Use Supabase Table Editor UI

# Local development
pnpm dev
# Then test at http://localhost:5173
```

---

## 📈 Post-Launch

### Monitor These Metrics:
1. Sign-up conversion rate
2. Calculation completion rate
3. Dashboard return rate
4. Error rates
5. Page load times

### Consider Adding:
1. Google Analytics
2. Hotjar for UX insights
3. Sentry for error tracking
4. Uptime monitoring
5. Backup automation

---

**Estimated Time:** 30-60 minutes for first deployment  
**Subsequent Deployments:** < 5 minutes (just push to GitHub)

**Status:** You're ready to deploy! 🚀
