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
 * Get current session and access token
 */
async function getAuthHeaders(): Promise<HeadersInit | null> {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error || !session) {
      console.log('ℹ️ No active session for API call');
      return null;
    }

    return {
      'Authorization': `Bearer ${session.access_token}`,
    };
  } catch (err) {
    console.error('❌ Error getting auth headers:', err);
    return null;
  }
}

/**
 * Makes authenticated API call to Edge Function
 */
async function apiCall<T = any>(
  endpoint: string,
  options: {
    method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    body?: any;
    requireAuth?: boolean;
  } = {}
): Promise<ApiResponse<T>> {
  try {
    const { method = 'GET', body, requireAuth = true } = options;

    console.log(`🌐 API Call: ${method} ${endpoint}`);

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    // Add auth headers if required
    if (requireAuth) {
      const authHeaders = await getAuthHeaders();
      if (!authHeaders) {
        return {
          error: {
            error: 'Not authenticated. Please sign in to continue.',
            status: 401,
          },
        };
      }
      Object.assign(headers, authHeaders);
      console.log(`🔑 Auth headers added for ${endpoint}`);
    }

    const fetchOptions: RequestInit = {
      method,
      headers,
    };

    if (body) {
      fetchOptions.body = typeof body === 'string' ? body : JSON.stringify(body);
    }

    console.log(`📤 Sending request to: ${BASE_URL}${endpoint}`);
    const response = await fetch(`${BASE_URL}${endpoint}`, fetchOptions);
    console.log(`📨 Response: ${response.status} ${response.statusText}`);

    // Extract requestId from response header
    const requestId = response.headers.get('X-Request-ID') || undefined;

    // Handle error responses
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        error: `HTTP ${response.status}`
      }));

      console.error(`❌ API Error (${response.status}):`, errorData);

      return {
        error: {
          error: errorData.error || errorData.message || `HTTP ${response.status}`,
          requestId,
          status: response.status,
        },
        requestId,
      };
    }

    // Parse success response
    const data = await response.json();
    console.log(`✅ API call successful`);
    return { data, requestId };
  } catch (err: any) {
    console.error('❌ API call exception:', err);
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
  return apiCall('/make-server-ef294769/discounts/validate', {
    method: 'POST',
    body: { code },
    requireAuth: false,
  });
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

export interface CreateComparisonShareRequest {
  analysisIds: string[];
  propertyName?: string;
}

/**
 * Create a shareable link for a report (requires authentication)
 * Endpoint: POST /make-server-ef294769/reports/share
 */
export async function createShareLink(payload: CreateShareRequest): Promise<ApiResponse> {
  return apiCall('/make-server-ef294769/reports/share', {
    method: 'POST',
    body: payload,
  });
}

/**
 * Create a shareable link for a comparison report (requires authentication)
 * Endpoint: POST /make-server-ef294769/reports/share/comparison
 */
export async function createComparisonShareLink(payload: CreateComparisonShareRequest): Promise<ApiResponse> {
  return apiCall('/make-server-ef294769/reports/share/comparison', {
    method: 'POST',
    body: payload,
  });
}

/**
 * Get a shared report (NO authentication required - public endpoint)
 * Endpoint: GET /make-server-ef294769/reports/shared/:token
 */
export async function getSharedReport(token: string): Promise<ApiResponse> {
  return apiCall(`/make-server-ef294769/reports/shared/${token}`, {
    method: 'GET',
    requireAuth: false,
  });
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
export async function saveAnalysis(payload: SaveAnalysisRequest): Promise<ApiResponse> {
  return apiCall('/make-server-ef294769/analyses', {
    method: 'POST',
    body: payload,
  });
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
    body: updates,
  });
}

/**
 * Update analysis note (requires authentication)
 * Endpoint: PUT /make-server-ef294769/analyses/:id/note
 */
export async function updateAnalysisNote(analysisId: string, note: string): Promise<ApiResponse> {
  return apiCall(`/make-server-ef294769/analyses/${analysisId}/note`, {
    method: 'PUT',
    body: { note },
  });
}

/**
 * Update property name for an analysis (requires authentication)
 * Endpoint: PATCH /make-server-ef294769/analyses/:id/property-name
 */
export async function updatePropertyName(analysisId: string, propertyName: string): Promise<ApiResponse> {
  return apiCall(`/make-server-ef294769/analyses/${analysisId}/property-name`, {
    method: 'PATCH',
    body: { propertyName },
  });
}

/**
 * Update property image URL for an analysis (requires authentication)
 * Endpoint: PATCH /make-server-ef294769/analyses/:id/property-image
 */
export async function updatePropertyImage(analysisId: string, imageUrl: string | null): Promise<ApiResponse> {
  return apiCall(`/make-server-ef294769/analyses/${analysisId}/property-image`, {
    method: 'PATCH',
    body: { propertyImageUrl: imageUrl },
  });
}

export async function getSharedComparison(token: string): Promise<ApiResponse> {
  try {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${publicAnonKey}`,
    };

    const response = await fetch(`${BASE_URL}/make-server-ef294769/reports/shared/comparison/${token}`, {
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
    console.error('Failed to fetch shared comparison report:', err);
    return {
      error: {
        error: err.message || 'Network error',
        status: 0,
      },
    };
  }
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
    body: payload,
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
  return apiCall('/make-server-ef294769/stripe/guest-checkout-session', {
    method: 'POST',
    body: payload,
    requireAuth: false,
  });
}
