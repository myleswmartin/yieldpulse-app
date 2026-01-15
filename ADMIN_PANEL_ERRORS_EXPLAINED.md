# YieldPulse Admin Panel - Error Troubleshooting

## Current Errors Explained

### ❌ "Invalid login credentials"

**What it means:** Someone is trying to sign in with incorrect email/password.

**This is NOT a bug** - This is a user authentication error. It happens when:
1. The user enters the wrong password
2. The user enters an email that doesn't exist
3. The user hasn't completed email verification yet

**How to fix:**
1. Make sure you're using the correct email and password
2. If you forgot your password, use the "Forgot Password" link
3. Check your email for the verification link if you just signed up

---

### ❌ "HTTP 401" errors on Dashboard

**What it means:** The user is not signed in when trying to access protected routes.

**This is NOT a bug** - This happens when:
1. The user's session has expired
2. The user navigated to `/dashboard` without signing in first
3. The user cleared their browser cookies/storage

**How to fix:**
1. Go to `/auth/signin` and sign in with your credentials
2. The app will automatically redirect you to the dashboard after sign in

---

## Setting Up Admin Access

### Step-by-Step Guide

1. **Create a User Account**
   - Go to: `/auth/signup`
   - Sign up with your email and password
   - Verify your email (check your inbox)

2. **Grant Admin Privileges in Database**
   
   Open Supabase SQL Editor and run:
   
   ```sql
   UPDATE profiles
   SET is_admin = TRUE
   WHERE email = 'your-email@example.com';
   ```
   
   Replace `your-email@example.com` with your actual email.

3. **Sign Out and Back In**
   - Click "Sign Out" in the header
   - Go to `/auth/signin`
   - Sign in again with your credentials
   - Your admin privileges will now be active

4. **Access Admin Panel**
   - Navigate to `/admin/dashboard`
   - You should now see the admin interface

---

## Admin Panel Features

Once you have admin access, you can:

### ✅ Dashboard (`/admin/dashboard`)
- View KPIs: Total users, revenue, conversion rate, open tickets
- See pending purchases that need attention
- Quick links to all admin sections

### ✅ User Management (`/admin/users`)
- Search and filter users
- View detailed user profiles
- See purchase history and analyses
- Toggle admin privileges
- Delete user accounts

### ✅ Purchase Management (`/admin/purchases`)
- View all purchases with filters
- Manual unlock (grant access without payment)
- Process refunds (with Stripe integration)
- View purchase details and snapshots

### ✅ Webhook Monitoring (`/admin/webhooks`)
- View webhook event logs
- Retry failed webhook processing
- Debug payment issues

### ✅ Support Tickets (`/admin/support`)
- View and manage customer tickets
- Reply to tickets (public and internal notes)
- Update ticket status
- Assign tickets to admins

### ✅ Audit Log (`/admin/audit-log`)
- Track all admin actions
- Filter by action type
- See who did what and when

---

## API Endpoints Reference

All admin endpoints require:
- Valid authentication token
- Admin privileges (`is_admin = true`)

### User Management
- `GET /admin/users` - List users with pagination
- `GET /admin/users/:userId` - Get user details
- `PUT /admin/users/:userId` - Update user
- `DELETE /admin/users/:userId` - Delete user

### Purchase Management
- `GET /admin/purchases` - List purchases
- `GET /admin/purchases/:purchaseId` - Get purchase details
- `POST /admin/purchases/:purchaseId/unlock` - Manual unlock
- `POST /admin/purchases/:purchaseId/refund` - Process refund

### Webhook Monitoring
- `GET /admin/webhooks` - List webhook logs
- `POST /admin/webhooks/:sessionId/retry` - Retry webhook

### Support Tickets
- `GET /admin/support/tickets` - List tickets
- `GET /admin/support/tickets/:ticketId` - Get ticket details
- `PUT /admin/support/tickets/:ticketId` - Update ticket
- `POST /admin/support/tickets/:ticketId/reply` - Reply to ticket

### Statistics
- `GET /admin/stats` - Get dashboard statistics

### Audit Log
- `GET /admin/audit-log` - Get audit log entries

---

## Security

### Authentication Flow
1. User signs in → Gets JWT access token
2. Access token stored in Supabase session
3. API requests include `Authorization: Bearer <token>` header
4. Backend verifies token and checks `is_admin` flag
5. If valid admin → Process request
6. If not admin → Return 403 Forbidden

### Admin Privileges
- Only users with `is_admin = true` can access admin endpoints
- Admin status checked on EVERY API request
- No client-side privilege escalation possible
- All admin actions are logged for audit trail

### Audit Trail
All admin actions are logged with:
- Admin user ID
- Action type (unlock, refund, user update, etc.)
- Timestamp
- Reason (for manual actions)
- Affected resource IDs

Logs are stored in KV store with keys like:
- `admin_action:unlock:{purchaseId}:{timestamp}`
- `admin_action:refund:{purchaseId}:{timestamp}`

---

## Common Issues

### "Access Denied" when accessing admin panel
**Cause:** User is not marked as admin in database

**Fix:** Run the SQL command in Step 2 above

---

### Admin stats not loading
**Cause:** API request failing or slow database

**Fix:** 
1. Check browser console for specific error
2. Verify Supabase is running
3. Check network tab for failed requests
4. Try refreshing the page

---

### Can't see webhook logs
**Cause:** No webhooks have been received yet, or KV store is empty

**Fix:**
1. Make a test purchase to trigger a webhook
2. Check Stripe dashboard for webhook delivery status
3. Verify webhook secret is configured correctly

---

## Next Steps

After setting up admin access:

1. **Test all features** - Click through each admin page
2. **Make a test purchase** - Verify the full payment flow
3. **Try manual unlock** - Test the admin override feature
4. **Create a support ticket** - Test the support system
5. **Monitor webhooks** - Watch payment processing in real-time

---

## Need Help?

If you encounter issues not covered here:

1. Check the browser console for detailed error messages
2. Look at the network tab to see which API calls are failing
3. Check Supabase logs for backend errors
4. Verify environment variables are set correctly
5. Make sure the database schema is up to date

---

**Built with ❤️ for YieldPulse**
