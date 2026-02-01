# Backend JWT Validation Fix Required

## Problem
The frontend is sending a **valid Supabase JWT token** in the `Authorization: Bearer <token>` header, but the backend Edge Function at `/analyses/user/me` is returning:

```json
{
  "code": 401,
  "message": "Invalid JWT"
}
```

## Evidence
✅ Frontend has valid session:
- Token expires in 3600 seconds (1 hour)
- User ID: `73c6c112-9abe-4b37-bb1e-16983369d838`
- User email: `shakilkhan496@gmail.com`

❌ Backend rejects the token:
- Returns 401 Unauthorized
- Error message: "Invalid JWT"

## Root Cause
Your backend Edge Function (`make-server-ef294769`) is **not correctly validating the Supabase JWT token**. The JWT validation logic in the backend is likely:

1. Using the wrong secret key
2. Not using Supabase's built-in auth utilities
3. Incorrectly parsing the Authorization header
4. Missing required environment variables

## Required Backend Fix

Your Edge Function needs to validate JWTs using Supabase's built-in utilities. Here's the **correct pattern**:

### ❌ WRONG - Custom JWT Validation
```typescript
// DON'T DO THIS - it won't work with Supabase JWTs
import { verify } from 'jsonwebtoken';

const token = req.headers.get('Authorization')?.replace('Bearer ', '');
const decoded = verify(token, process.env.JWT_SECRET); // ❌ Wrong approach
```

### ✅ CORRECT - Supabase JWT Validation

```typescript
import { createClient } from '@supabase/supabase-js';

// Create Supabase client with the user's JWT
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

// Extract the JWT from Authorization header
const authHeader = req.headers.get('Authorization');
if (!authHeader || !authHeader.startsWith('Bearer ')) {
  return new Response(
    JSON.stringify({ code: 401, message: 'Missing Authorization header' }),
    { status: 401, headers: { 'Content-Type': 'application/json' } }
  );
}

const jwt = authHeader.replace('Bearer ', '');

// Create Supabase client with the user's JWT
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  global: {
    headers: { Authorization: authHeader },
  },
});

// Validate the JWT and get the user
const { data: { user }, error } = await supabase.auth.getUser(jwt);

if (error || !user) {
  console.error('JWT validation error:', error);
  return new Response(
    JSON.stringify({ code: 401, message: 'Invalid JWT' }),
    { status: 401, headers: { 'Content-Type': 'application/json' } }
  );
}

// ✅ JWT is valid, user is authenticated
console.log('Authenticated user:', user.id, user.email);

// Now you can use user.id to fetch their analyses
const { data: analyses, error: dbError } = await supabase
  .from('analyses')
  .select('*')
  .eq('user_id', user.id)
  .order('created_at', { ascending: false });

if (dbError) {
  console.error('Database error:', dbError);
  return new Response(
    JSON.stringify({ code: 500, message: 'Database error' }),
    { status: 500, headers: { 'Content-Type': 'application/json' } }
  );
}

return new Response(
  JSON.stringify({ data: analyses }),
  { status: 200, headers: { 'Content-Type': 'application/json' } }
);
```

## Complete Edge Function Template

Here's a complete template for your `/analyses/user/me` endpoint:

```typescript
import { createClient } from '@supabase/supabase-js';
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

// Environment variables
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE, OPTIONS',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const path = url.pathname;

    // Route: GET /analyses/user/me
    if (path.includes('/analyses/user/me') && req.method === 'GET') {
      // Extract Authorization header
      const authHeader = req.headers.get('Authorization');
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return new Response(
          JSON.stringify({ code: 401, message: 'Missing Authorization header' }),
          { 
            status: 401, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      const jwt = authHeader.replace('Bearer ', '');

      // Create Supabase client with user's JWT
      const supabase = createClient(supabaseUrl, supabaseServiceKey, {
        global: {
          headers: { Authorization: authHeader },
        },
      });

      // Validate JWT and get user
      const { data: { user }, error: authError } = await supabase.auth.getUser(jwt);

      if (authError || !user) {
        console.error('Authentication failed:', authError);
        return new Response(
          JSON.stringify({ 
            code: 401, 
            message: 'Invalid JWT',
            details: authError?.message || 'Token validation failed'
          }),
          { 
            status: 401, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      console.log(`✅ User authenticated: ${user.id} (${user.email})`);

      // Fetch user's analyses from database
      const { data: analyses, error: dbError } = await supabase
        .from('analyses')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (dbError) {
        console.error('Database error:', dbError);
        return new Response(
          JSON.stringify({ code: 500, message: 'Database error' }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      // Return analyses
      return new Response(
        JSON.stringify({ data: analyses }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Unknown route
    return new Response(
      JSON.stringify({ code: 404, message: 'Not found' }),
      { 
        status: 404, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ 
        code: 500, 
        message: 'Internal server error',
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
```

## Environment Variables Required

Make sure these environment variables are set in your Supabase Edge Function:

```bash
SUPABASE_URL=https://woqwrkfmdjuaerzpvshj.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
```

You can find these in your Supabase Dashboard:
1. Go to: https://supabase.com/dashboard/project/woqwrkfmdjuaerzpvshj/settings/api
2. Copy the values for:
   - Project URL → `SUPABASE_URL`
   - service_role key → `SUPABASE_SERVICE_ROLE_KEY`

## Testing the Backend Fix

After deploying the backend fix, test it:

### 1. Get a JWT Token
Sign in on the frontend and copy the JWT from the console:
```
📊 Token info: { tokenLength: 974, ... }
```

### 2. Test the Endpoint with curl
```bash
JWT="<paste-your-jwt-here>"

curl -X GET \
  "https://woqwrkfmdjuaerzpvshj.supabase.co/functions/v1/make-server-ef294769/analyses/user/me" \
  -H "Authorization: Bearer $JWT" \
  -H "Content-Type: application/json" \
  -v
```

Expected response:
```json
{
  "data": [
    {
      "id": "...",
      "user_id": "73c6c112-9abe-4b37-bb1e-16983369d838",
      "created_at": "...",
      ...
    }
  ]
}
```

### 3. Check Edge Function Logs
In Supabase Dashboard:
1. Go to: Edge Functions → make-server-ef294769 → Logs
2. Look for authentication logs:
   - ✅ "User authenticated: 73c6c112-9abe-4b37-bb1e-16983369d838"
   - ❌ "Authentication failed: ..."

## Common Issues

### Issue 1: "Invalid JWT" Error
**Cause**: Not using `supabase.auth.getUser(jwt)` to validate the token.
**Fix**: Use the code template above.

### Issue 2: Missing Environment Variables
**Cause**: `SUPABASE_SERVICE_ROLE_KEY` not set.
**Fix**: Set it in Supabase Dashboard → Edge Functions → Environment Variables.

### Issue 3: CORS Errors
**Cause**: CORS headers not properly configured.
**Fix**: Ensure `corsHeaders` are returned in ALL responses, including errors.

### Issue 4: Wrong Secret Key
**Cause**: Using `JWT_SECRET` instead of Supabase's auth validation.
**Fix**: Don't manually verify JWTs. Use `supabase.auth.getUser()`.

## Summary

✅ **Frontend is working correctly** - sending valid JWT token  
❌ **Backend needs to be fixed** - must use `supabase.auth.getUser()` to validate JWT  

Once the backend is fixed to use Supabase's auth validation (as shown in the template above), authentication will work properly and users will be able to access their dashboard.
