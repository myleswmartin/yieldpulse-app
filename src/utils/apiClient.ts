import { projectId, publicAnonKey } from '../../utils/supabase/info';
import { supabase } from './supabaseClient';

const BASE_URL = `https://${projectId}.supabase.co/functions/v1`;

export interface ApiError {
  error: string;
  requestId?: string;
  status: number;
}

export interface ApiResponse<T = any> {
  data?: T;
  error?: ApiError;
  requestId?: string;
}

/**
 * Get a valid access token, refreshing if necessary
 * Returns null if user is not authenticated or refresh fails
 */
async function getAccessToken(): Promise<string | null> {
  try {
    console.log('🔑 Attempting to retrieve access token...');
    
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('❌ Error getting session:', error);
      return null;
    }
    
    if (!session) {
      console.log('ℹ️ No active session found');
      return null;
    }
    
    const expiresAt = session.expires_at || 0;
    const now = Math.floor(Date.now() / 1000);
    const timeUntilExpiry = expiresAt - now;
    
    console.log(`⏱️ Token expires in ${timeUntilExpiry} seconds`);
    
    const isExpired = timeUntilExpiry <= 0;
    const isExpiringSoon = timeUntilExpiry <= 300; // Less than 5 minutes
    
    if (isExpired) {
      console.log('🔄 Token expired, attempting to refresh...');
      const { data: { session: refreshedSession }, error: refreshError } = await supabase.auth.refreshSession();
      
      if (refreshError || !refreshedSession) {
        console.error('❌ Failed to refresh session:', refreshError);
        // Clear the invalid session
        await supabase.auth.signOut();
        // Return null to prevent making API call with invalid token
        return null;
      }
      
      console.log('✅ Session refreshed successfully');
      return refreshedSession.access_token;
    }
    
    if (isExpiringSoon) {
      console.log('⏰ Token expiring soon, refreshing proactively...');
      // Try to refresh but don't block on it
      const { data: { session: refreshedSession }, error: refreshError } = await supabase.auth.refreshSession();
      
      if (refreshError || !refreshedSession) {
        console.warn('⚠️ Proactive refresh failed, using current token:', refreshError);
        // Still return current token as it's still valid
        return session.access_token;
      }
      
      console.log('✅ Session refreshed proactively');
      return refreshedSession.access_token;
    }
    
    console.log('✅ Access token retrieved successfully');
    console.log('📊 Token info:', {
      expiresAt: new Date(expiresAt * 1000).toISOString(),
      expiresIn: expiresAt - now,
      tokenLength: session.access_token.length,
      userId: session.user?.id,
      userEmail: session.user?.email,
    });
    
    return session.access_token;
  } catch (err) {
    console.error('❌ Exception while getting access token:', err);
    return null;
  }
}

/**
 * Makes authenticated API call to Edge Function
 */
async function apiCall<T = any>(
  endpoint: string,
  options: RequestInit = {},
  accessTokenOverride?: string | null,
): Promise<ApiResponse<T>> {
  try {
    const accessToken = accessTokenOverride ?? await getAccessToken();
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    // Add Authorization header if user is authenticated
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    // Extract requestId from response header
    const requestId = response.headers.get('X-Request-ID') || undefined;

    // Handle 401 Unauthorized - clear local session
    if (response.status === 401) {
      // Silently sign out user on frontend to clear invalid session
      try {
        await supabase.auth.signOut();
      } catch (e) {
        // Silent failure - user will be redirected to login anyway
      }
      
      const errorData = await response.json().catch(() => ({ error: 'Unauthorized' }));
      return {
        error: {
          error: errorData.error || 'Session expired. Please sign in again.',
          requestId,
          status: 401,
        },
        requestId,
      };
    }

    // Handle error responses
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      return {
        error: {
          error: errorData.error || `HTTP ${response.status}`,
          requestId,
          status: response.status,
        },
        requestId,
      };
    }

    // Parse success response
    const data = await response.json();
    return { data, requestId };
  } catch (err: any) {
    console.error('API call failed:', err);
    return {
      error: {
        error: err.message || 'Network error',
        status: 0,
      },
    };
  }
}

/**
 * Validate a discount code (NO authentication required)
 * Endpoint: POST /make-server-ef294769/discounts/validate
 */
export async function validateDiscountCode(code: string): Promise<ApiResponse> {
  try {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${publicAnonKey}`,
    };

    const response = await fetch(`${BASE_URL}/make-server-ef294769/discounts/validate`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ code }),
    });

    const requestId = response.headers.get('X-Request-ID') || undefined;

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      return {
        error: {
          error: errorData.error || `HTTP ${response.status}`,
          requestId,
          status: response.status,
        },
        requestId,
      };
    }

    const data = await response.json();
    return { data, requestId };
  } catch (err: any) {
    console.error('Discount validation failed:', err);
    return {
      error: {
        error: err.message || 'Network error',
        status: 0,
      },
    };
  }
}

// ================================================================
// REPORT SHARING ENDPOINTS
// ================================================================

export interface CreateShareRequest {
  analysisId?: string;
  inputs?: any;
  results?: any;
  propertyName?: string;
}

/**
 * Create a shareable link for a report (requires authentication)
 * Endpoint: POST /make-server-ef294769/reports/share
 */
export async function createShareLink(payload: CreateShareRequest): Promise<ApiResponse> {
  return apiCall('/make-server-ef294769/reports/share', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

/**
 * Get a shared report (NO authentication required - public endpoint)
 * Endpoint: GET /make-server-ef294769/reports/shared/:token
 */
export async function getSharedReport(token: string): Promise<ApiResponse> {
  try {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${publicAnonKey}`,
    };

    const response = await fetch(`${BASE_URL}/make-server-ef294769/reports/shared/${token}`, {
      method: 'GET',
      headers,
    });

    const requestId = response.headers.get('X-Request-ID') || undefined;

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      return {
        error: {
          error: errorData.error || `HTTP ${response.status}`,
          requestId,
          status: response.status,
        },
        requestId,
      };
    }

    const data = await response.json();
    return { data, requestId };
  } catch (err: any) {
    console.error('Failed to fetch shared report:', err);
    return {
      error: {
        error: err.message || 'Network error',
        status: 0,
      },
    };
  }
}

/**
 * Save a shared report to user's dashboard (requires authentication)
 * Endpoint: POST /make-server-ef294769/reports/shared/:token/save
 */
export async function saveSharedReport(token: string): Promise<ApiResponse> {
  return apiCall(`/make-server-ef294769/reports/shared/${token}/save`, {
    method: 'POST',
  });
}

/**
 * Get user's share history (requires authentication)
 * Endpoint: GET /make-server-ef294769/reports/my-shares
 */
export async function getMyShares(): Promise<ApiResponse> {
  return apiCall('/make-server-ef294769/reports/my-shares', {
    method: 'GET',
  });
}

// ================================================================
// ANALYSIS ENDPOINTS
// ================================================================

export interface SaveAnalysisRequest {
  inputs: {
    propertyName?: string;
    portalSource: string;
    listingUrl: string;
    areaSqft: number;
    purchasePrice: number;
    downPaymentPercent: number;
    mortgageInterestRate: number;
    mortgageTermYears: number;
    expectedMonthlyRent: number;
    serviceChargeAnnual: number;
    annualMaintenancePercent: number;
    propertyManagementFeePercent: number;
    dldFeePercent: number;
    agentFeePercent: number;
    capitalGrowthPercent: number;
    rentGrowthPercent: number;
    vacancyRatePercent: number;
    holdingPeriodYears: number;
  };
  results: any;
}

/**
 * Save a new analysis (requires authentication)
 * Endpoint: POST /make-server-ef294769/analyses
 */
export async function saveAnalysis(
  payload: SaveAnalysisRequest,
  accessTokenOverride?: string | null,
): Promise<ApiResponse> {
  return apiCall('/make-server-ef294769/analyses', {
    method: 'POST',
    body: JSON.stringify(payload),
  }, accessTokenOverride);
}

/**
 * Get all analyses for current user (requires authentication)
 * Endpoint: GET /make-server-ef294769/analyses/user/me
 */
export async function getUserAnalyses(): Promise<ApiResponse> {
  return apiCall('/make-server-ef294769/analyses/user/me', {
    method: 'GET',
  });
}

/**
 * Delete an analysis by ID (requires authentication)
 * Endpoint: DELETE /make-server-ef294769/analyses/:id
 */
export async function deleteAnalysis(analysisId: string): Promise<ApiResponse> {
  return apiCall(`/make-server-ef294769/analyses/${analysisId}`, {
    method: 'DELETE',
  });
}

/**
 * Update an analysis by ID (requires authentication)
 * Endpoint: PUT /make-server-ef294769/analyses/:id
 */
export async function updateAnalysis(analysisId: string, updates: Record<string, any>): Promise<ApiResponse> {
  return apiCall(`/make-server-ef294769/analyses/${analysisId}`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  });
}

/**
 * Update analysis note (requires authentication)
 * Endpoint: PUT /make-server-ef294769/analyses/:id/note
 */
export async function updateAnalysisNote(analysisId: string, note: string): Promise<ApiResponse> {
  return apiCall(`/make-server-ef294769/analyses/${analysisId}/note`, {
    method: 'PUT',
    body: JSON.stringify({ note }),
  });
}

/**
 * Update property name for an analysis (requires authentication)
 * Endpoint: PATCH /make-server-ef294769/analyses/:id/property-name
 */
export async function updatePropertyName(analysisId: string, propertyName: string): Promise<ApiResponse> {
  return apiCall(`/make-server-ef294769/analyses/${analysisId}/property-name`, {
    method: 'PATCH',
    body: JSON.stringify({ propertyName }),
  });
}

// ================================================================
// PAYMENT ENDPOINTS
// ================================================================

/**
 * Check if analysis has been purchased (requires authentication)
 * Endpoint: GET /make-server-ef294769/purchases/status?analysisId={id}
 */
export async function checkPurchaseStatus(analysisId: string): Promise<ApiResponse> {
  return apiCall(`/make-server-ef294769/purchases/status?analysisId=${analysisId}`, {
    method: 'GET',
  });
}

export interface CreateCheckoutRequest {
  analysisId: string;
  origin: string;
}

/**
 * Create Stripe checkout session (requires authentication)
 * Endpoint: POST /make-server-ef294769/stripe/checkout-session
 */
export async function createCheckoutSession(payload: CreateCheckoutRequest): Promise<ApiResponse> {
  return apiCall('/make-server-ef294769/stripe/checkout-session', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export interface CreateGuestCheckoutRequest {
  inputs: any;
  results: any;
  origin: string;
}

/**
 * Create Stripe guest checkout session (NO authentication required)
 * Endpoint: POST /make-server-ef294769/stripe/guest-checkout-session
 */
export async function createGuestCheckoutSession(payload: CreateGuestCheckoutRequest): Promise<ApiResponse> {
  // Call without user authentication, but include anon key for Supabase Edge Function access
  try {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${publicAnonKey}`, // Anon key needed for Supabase Edge Function access
    };

    const response = await fetch(`${BASE_URL}/make-server-ef294769/stripe/guest-checkout-session`, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });

    // Extract requestId from response header
    const requestId = response.headers.get('X-Request-ID') || undefined;

    // Handle error responses
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      return {
        error: {
          error: errorData.error || `HTTP ${response.status}`,
          requestId,
          status: response.status,
        },
        requestId,
      };
    }

    // Parse success response
    const data = await response.json();
    return { data, requestId };
  } catch (err: any) {
    console.error('API call failed:', err);
    return {
      error: {
        error: err.message || 'Network error',
        status: 0,
      },
    };
  }
}

/**
 * Claim a guest purchase and attach it to the authenticated user
 * Endpoint: POST /make-server-ef294769/guest/claim
 */
export async function claimGuestPurchase(purchaseId: string): Promise<ApiResponse> {
  return apiCall('/make-server-ef294769/guest/claim', {
    method: 'POST',
    body: JSON.stringify({ purchaseId }),
  });
}
