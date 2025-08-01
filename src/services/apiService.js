import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { config, API_CONFIG, isProduction } from '../config/environment';

// Create axios instance with production configuration
const apiClient = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: API_CONFIG.timeout,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor for authentication
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error getting auth token:', error);
    }
    
    // Add request timestamp for debugging
    if (!isProduction()) {
      config.metadata = { startTime: new Date() };
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    // Log response time in development
    if (!isProduction() && response.config.metadata) {
      const endTime = new Date();
      const duration = endTime - response.config.metadata.startTime;
      console.log(`API Response: ${response.config.url} - ${duration}ms`);
    }
    
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Handle 401 Unauthorized - token refresh logic
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Clear invalid token
        await AsyncStorage.removeItem('access_token');
        
        // Redirect to login or refresh token logic here
        // For now, we'll just reject the request
        return Promise.reject(error);
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        return Promise.reject(error);
      }
    }
    
    // Handle network errors
    if (!error.response) {
      console.error('Network error:', error.message);
      return Promise.reject({
        message: 'Network error. Please check your internet connection.',
        isNetworkError: true,
      });
    }
    
    // Handle server errors
    if (error.response.status >= 500) {
      console.error('Server error:', error.response.status, error.response.data);
      return Promise.reject({
        message: 'Server error. Please try again later.',
        status: error.response.status,
        isServerError: true,
      });
    }
    
    return Promise.reject(error);
  }
);

// Retry logic for failed requests
const retryRequest = async (requestFn, retryCount = 0) => {
  try {
    return await requestFn();
  } catch (error) {
    if (retryCount < API_CONFIG.retryAttempts && shouldRetry(error)) {
      await new Promise(resolve => setTimeout(resolve, API_CONFIG.retryDelay * (retryCount + 1)));
      return retryRequest(requestFn, retryCount + 1);
    }
    throw error;
  }
};

// Determine if request should be retried
const shouldRetry = (error) => {
  // Retry on network errors
  if (error.isNetworkError) return true;
  
  // Retry on 5xx server errors
  if (error.isServerError) return true;
  
  // Retry on specific HTTP status codes
  const retryableStatuses = [408, 429, 500, 502, 503, 504];
  if (error.response && retryableStatuses.includes(error.response.status)) {
    return true;
  }
  
  return false;
};

// API service methods
export const apiService = {
  // GET request
  get: async (url, config = {}) => {
    return retryRequest(() => apiClient.get(url, config));
  },
  
  // POST request
  post: async (url, data = {}, config = {}) => {
    return retryRequest(() => apiClient.post(url, data, config));
  },
  
  // PUT request
  put: async (url, data = {}, config = {}) => {
    return retryRequest(() => apiClient.put(url, data, config));
  },
  
  // DELETE request
  delete: async (url, config = {}) => {
    return retryRequest(() => apiClient.delete(url, config));
  },
  
  // PATCH request
  patch: async (url, data = {}, config = {}) => {
    return retryRequest(() => apiClient.patch(url, data, config));
  },
  
  // Upload file
  upload: async (url, formData, config = {}) => {
    const uploadConfig = {
      ...config,
      headers: {
        ...config.headers,
        'Content-Type': 'multipart/form-data',
      },
    };
    return retryRequest(() => apiClient.post(url, formData, uploadConfig));
  },
  
  // Download file
  download: async (url, config = {}) => {
    const downloadConfig = {
      ...config,
      responseType: 'blob',
    };
    return retryRequest(() => apiClient.get(url, downloadConfig));
  },
};

// Error handling utilities
export const handleApiError = (error) => {
  if (error.isNetworkError) {
    return {
      title: 'Connection Error',
      message: 'Please check your internet connection and try again.',
      type: 'network',
    };
  }
  
  if (error.isServerError) {
    return {
      title: 'Server Error',
      message: 'Something went wrong on our end. Please try again later.',
      type: 'server',
    };
  }
  
  if (error.response?.status === 401) {
    return {
      title: 'Authentication Error',
      message: 'Please login again to continue.',
      type: 'auth',
    };
  }
  
  if (error.response?.status === 403) {
    return {
      title: 'Access Denied',
      message: 'You don\'t have permission to perform this action.',
      type: 'permission',
    };
  }
  
  if (error.response?.status === 404) {
    return {
      title: 'Not Found',
      message: 'The requested resource was not found.',
      type: 'notFound',
    };
  }
  
  if (error.response?.status === 422) {
    return {
      title: 'Validation Error',
      message: error.response.data?.message || 'Please check your input and try again.',
      type: 'validation',
    };
  }
  
  // Default error
  return {
    title: 'Error',
    message: error.message || 'Something went wrong. Please try again.',
    type: 'unknown',
  };
};

export default apiService; 