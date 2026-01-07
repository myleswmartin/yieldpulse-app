import { projectId, publicAnonKey } from '../../utils/supabase/info';
import { supabase } from './supabaseClient';

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-ef294769`;

// Helper to get auth token from Supabase
async function getAuthToken(): Promise<string | null> {
  try {
    console.log('🔑 [Admin API] Getting access token...');
    
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('❌ [Admin API] Failed to get session:', error);
      return null;
    }
    
    if (!session) {
      console.warn('⚠️ [Admin API] No active session found');
      return null;
    }
    
    if (!session.access_token) {
      console.warn('⚠️ [Admin API] Session exists but no access token');
      return null;
    }
    
    console.log('✅ [Admin API] Access token retrieved');
    console.log('📊 [Admin API] Token info:', {
      expiresAt: session.expires_at,
      userId: session.user?.id,
      isAdmin: session.user?.user_metadata?.is_admin,
    });
    
    // Check if token is expired
    if (session.expires_at && session.expires_at * 1000 < Date.now()) {
      console.warn('⚠️ [Admin API] Token is expired, attempting refresh...');
      
      const { data: { session: refreshedSession }, error: refreshError } = await supabase.auth.refreshSession();
      
      if (refreshError || !refreshedSession) {
        console.error('❌ [Admin API] Failed to refresh session:', refreshError);
        return null;
      }
      
      console.log('✅ [Admin API] Session refreshed successfully');
      return refreshedSession.access_token;
    }
    
    return session.access_token;
  } catch (error) {
    console.error('❌ [Admin API] Exception while getting auth token:', error);
    return null;
  }
}

// Helper for API requests
async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const token = await getAuthToken();
  
  if (!token) {
    console.error('Authentication required but no token available');
    throw new Error('Not authenticated - please sign in again');
  }

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    ...options.headers,
  };

  console.log(`Making API request to: ${API_BASE}${endpoint}`);

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  console.log(`API response status: ${response.status}`);

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: response.statusText }));
    console.error('API error response:', error);
    throw new Error(error.error || `API request failed with status ${response.status}`);
  }

  return response.json();
}

// ================================================================
// USER MANAGEMENT
// ================================================================

export const adminApi = {
  // Users
  users: {
    list: (params?: { page?: number; limit?: number; search?: string; admin_filter?: string }) => {
      const query = new URLSearchParams(params as any).toString();
      return apiRequest(`/admin/users${query ? `?${query}` : ''}`);
    },
    get: (userId: string) => apiRequest(`/admin/users/${userId}`),
    update: (userId: string, data: any) => apiRequest(`/admin/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
    delete: (userId: string) => apiRequest(`/admin/users/${userId}`, {
      method: 'DELETE',
    }),
  },

  // Purchases
  purchases: {
    list: (params?: { page?: number; limit?: number; status?: string; search?: string }) => {
      const query = new URLSearchParams(params as any).toString();
      return apiRequest(`/admin/purchases${query ? `?${query}` : ''}`);
    },
    get: (purchaseId: string) => apiRequest(`/admin/purchases/${purchaseId}`),
    unlock: (purchaseId: string, reason: string) => apiRequest(`/admin/purchases/${purchaseId}/unlock`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    }),
    refund: (purchaseId: string, reason: string, refund_stripe: boolean) => apiRequest(`/admin/purchases/${purchaseId}/refund`, {
      method: 'POST',
      body: JSON.stringify({ reason, refund_stripe }),
    }),
  },

  // Webhooks
  webhooks: {
    list: () => apiRequest('/admin/webhooks'),
    retry: (sessionId: string) => apiRequest(`/admin/webhooks/${sessionId}/retry`, {
      method: 'POST',
    }),
  },

  // Support Tickets
  support: {
    tickets: {
      list: (params?: { status?: string; page?: number; limit?: number }) => {
        const query = new URLSearchParams(params as any).toString();
        return apiRequest(`/admin/support/tickets${query ? `?${query}` : ''}`);
      },
      get: (ticketId: string) => apiRequest(`/admin/support/tickets/${ticketId}`),
      update: (ticketId: string, data: { status?: string; assigned_to?: string }) => apiRequest(`/admin/support/tickets/${ticketId}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
      reply: (ticketId: string, message: string, internal: boolean = false) => apiRequest(`/admin/support/tickets/${ticketId}/reply`, {
        method: 'POST',
        body: JSON.stringify({ message, internal }),
      }),
    },
  },

  // Audit Log
  auditLog: {
    list: (params?: { page?: number; limit?: number; action?: string }) => {
      const query = new URLSearchParams(params as any).toString();
      return apiRequest(`/admin/audit-log${query ? `?${query}` : ''}`);
    },
  },

  // Statistics
  stats: {
    get: () => apiRequest('/admin/stats'),
  },
};

// User-facing support API
export const supportApi = {
  tickets: {
    create: (data: { subject: string; message: string; email?: string; priority?: string; category?: string }) =>
      apiRequest('/support/tickets', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    list: () => apiRequest('/support/tickets'),
  },
};