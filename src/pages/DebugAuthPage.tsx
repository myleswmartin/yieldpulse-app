import { useState } from 'react';
import { supabase } from '@/utils/supabaseClient';

export default function DebugAuthPage() {
  const [tokenInfo, setTokenInfo] = useState<any>(null);
  const [validationResult, setValidationResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testAuth = async () => {
    setLoading(true);
    try {
      // 1. Get current session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        setTokenInfo({ error: 'No active session', sessionError });
        setLoading(false);
        return;
      }

      // 2. Show token info
      const info = {
        hasSession: true,
        userId: session.user.id,
        userEmail: session.user.email,
        tokenLength: session.access_token.length,
        expiresAt: new Date(session.expires_at! * 1000).toISOString(),
        expiresIn: session.expires_at! - Math.floor(Date.now() / 1000),
        token: session.access_token.substring(0, 50) + '...' + session.access_token.substring(session.access_token.length - 20),
        fullToken: session.access_token, // For copying
      };
      setTokenInfo(info);

      // 3. Test token validity by calling Supabase's getUser
      console.log('🧪 Testing token validity with supabase.auth.getUser()...');
      const { data: { user }, error: userError } = await supabase.auth.getUser(session.access_token);
      
      const validation = {
        isValid: !userError && user !== null,
        user: user ? {
          id: user.id,
          email: user.email,
          createdAt: user.created_at,
        } : null,
        error: userError?.message,
      };
      setValidationResult(validation);

      // 4. Test the actual API call
      console.log('🧪 Testing actual API call to /analyses/user/me...');
      const response = await fetch(
        `https://woqwrkfmdjuaerzpvshj.supabase.co/functions/v1/make-server-ef294769/analyses/user/me`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const responseData = await response.json().catch(() => null);
      
      setValidationResult({
        ...validation,
        apiTest: {
          status: response.status,
          statusText: response.statusText,
          ok: response.ok,
          responseData,
        },
      });

    } catch (err: any) {
      setTokenInfo({ error: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">🔍 Authentication Debug</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <button
            onClick={testAuth}
            disabled={loading}
            className="bg-[#1e2875] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#2d3a8f] disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test Authentication'}
          </button>
        </div>

        {tokenInfo && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">📊 Session Info</h2>
            <pre className="bg-gray-100 p-4 rounded overflow-x-auto text-sm">
              {JSON.stringify(tokenInfo, null, 2)}
            </pre>
            
            {tokenInfo.fullToken && (
              <div className="mt-4">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(tokenInfo.fullToken);
                    alert('Full token copied to clipboard!');
                  }}
                  className="bg-gray-200 px-4 py-2 rounded text-sm hover:bg-gray-300"
                >
                  📋 Copy Full Token
                </button>
              </div>
            )}
          </div>
        )}

        {validationResult && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">
              {validationResult.isValid ? '✅ Token Validation' : '❌ Token Validation'}
            </h2>
            <pre className="bg-gray-100 p-4 rounded overflow-x-auto text-sm">
              {JSON.stringify(validationResult, null, 2)}
            </pre>

            {validationResult.apiTest && (
              <div className="mt-4">
                {validationResult.apiTest.status === 401 ? (
                  <div className="bg-red-50 border border-red-200 rounded p-4">
                    <p className="font-bold text-red-800 mb-2">❌ Backend JWT Validation Failed</p>
                    <p className="text-sm text-red-700 mb-2">
                      The token is valid on Supabase's side (see validation above), but your backend Edge Function is rejecting it.
                    </p>
                    <p className="text-sm text-red-700">
                      <strong>Fix required:</strong> Update your Edge Function to use <code className="bg-red-100 px-1 rounded">supabase.auth.getUser(jwt)</code> instead of custom JWT verification.
                    </p>
                  </div>
                ) : validationResult.apiTest.ok ? (
                  <div className="bg-green-50 border border-green-200 rounded p-4">
                    <p className="font-bold text-green-800">✅ Backend API Call Successful!</p>
                    <p className="text-sm text-green-700">Your backend is properly validating JWT tokens.</p>
                  </div>
                ) : (
                  <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
                    <p className="font-bold text-yellow-800">⚠️ Unexpected Response</p>
                    <p className="text-sm text-yellow-700">Status: {validationResult.apiTest.status}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="text-lg font-bold mb-3">📖 Backend Fix Instructions</h2>
          <p className="text-sm mb-3">
            Your backend Edge Function needs to validate JWT using Supabase's auth utilities:
          </p>
          <pre className="bg-white p-3 rounded text-xs overflow-x-auto border">
{`// ❌ DON'T DO THIS
const decoded = jwt.verify(token, secret);

// ✅ DO THIS INSTEAD
const supabase = createClient(url, key, {
  global: { headers: { Authorization: authHeader } }
});
const { data: { user }, error } = 
  await supabase.auth.getUser(jwt);

if (error || !user) {
  return new Response(
    JSON.stringify({ code: 401, message: 'Invalid JWT' }),
    { status: 401 }
  );
}`}
          </pre>
          <p className="text-sm mt-3">
            See <code className="bg-blue-100 px-2 py-1 rounded">/BACKEND_JWT_FIX_REQUIRED.md</code> for complete implementation.
          </p>
        </div>
      </div>
    </div>
  );
}
