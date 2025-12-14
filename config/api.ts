import Constants from 'expo-constants';

// Get API base URL from environment variables
export const API_BASE_URL =
  Constants.expoConfig?.extra?.BACKEND_API || 'http://localhost:5000'; // fallback for development

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  auth: {
    login: '/auth/login',
    signupCustomer: '/auth/signup/customer',
    signupHelper: '/auth/signup/helper',
    logout: '/auth/logout',
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
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        errorData?.message || `API Error: ${response.statusText}`,
      );
    }

    return await response.json();
  } catch (error) {
    console.error('API Call Error:', error);
    throw error;
  }
};
