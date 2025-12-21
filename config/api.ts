import Constants from 'expo-constants';

// Get API base URL from environment variables
export const API_BASE_URL =
  Constants.expoConfig?.extra?.BACKEND_API || 'http://localhost:5000'; // fallback for development

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  auth: {
    login: '/auth/login',
    loginMobile: '/auth/login/mobile',
    signupCustomer: '/auth/signup/customer',
    signupHelper: '/auth/signup/helper',
    logout: '/auth/logout',
    me: '/auth/me',
    getUser: (id: string) => `/auth/user/${id}`,
    updateUser: (id: string) => `/auth/user/${id}`,
  },
  // Booking
  booking: {
    create: '/booking/create',
    update: (id: string) => `/booking/update/${id}`,
    all: '/booking/all',
    refund: '/booking/refund',
  },
  // Scheduler
  scheduler: {
    byCustomerId: (customerId: string) => `/scheduler?customerId=${customerId}`,
  },
  // Service
  service: {
    types: '/servicetype/all',
    typeById: (id: string) => `/servicetype/${id}`,
  },
};

// Helper function to construct full URL
export const getApiUrl = (endpoint: string): string => {
  return `${API_BASE_URL}${endpoint}`;
};

// Helper function for API calls
export const apiCall = async <T = any>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> => {
  try {
    const url = getApiUrl(endpoint);
    const method = options?.method || 'GET';

    // Don't add Content-Type for GET requests
    const headers: Record<string, string> = {
      ...options?.headers,
    } as Record<string, string>;

    // Only add Content-Type for non-GET requests
    if (method !== 'GET' && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json';
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    // Parse response text first
    const text = await response.text();
    let result;

    try {
      result = text ? JSON.parse(text) : null;
    } catch (e) {
      // If JSON parse fails
      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }
      throw new Error('Invalid response format');
    }

    if (!response.ok) {
      throw new Error(result?.message || `API Error: ${response.statusText}`);
    }

    return result;
  } catch (error) {
    console.error('API Call Error:', error);
    throw error;
  }
};
