import { projectId, publicAnonKey } from '../../utils/supabase/info';
import { supabase } from './supabaseClient';

const BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-ef294769`;

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
 * Get current user's access token for Authorization header
 */
async function getAccessToken(): Promise<string | null> {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.access_token || null;
}

/**
 * Makes authenticated API call to Edge Function
 */
async function apiCall<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const accessToken = await getAccessToken();
    
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

// ================================================================
// ANALYSIS ENDPOINTS
// ================================================================

export interface SaveAnalysisRequest {
  inputs: {
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
  return apiCall('/analyses', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

/**
 * Get all analyses for current user (requires authentication)
 * Endpoint: GET /make-server-ef294769/analyses/user/me
 */
export async function getUserAnalyses(): Promise<ApiResponse> {
  return apiCall('/analyses/user/me', {
    method: 'GET',
  });
}

/**
 * Delete an analysis by ID (requires authentication)
 * Endpoint: DELETE /make-server-ef294769/analyses/:id
 */
export async function deleteAnalysis(analysisId: string): Promise<ApiResponse> {
  return apiCall(`/analyses/${analysisId}`, {
    method: 'DELETE',
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
  return apiCall(`/purchases/status?analysisId=${analysisId}`, {
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
  return apiCall('/stripe/checkout-session', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
