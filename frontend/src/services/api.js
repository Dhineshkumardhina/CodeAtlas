import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const API = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 second timeout
});

// Simple cache for GET requests
const requestCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Request interceptor - attach auth token and caching
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add cache control for GET requests
    if (config.method === 'get') {
      const cacheKey = `${config.url}`;
      const cached = requestCache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        // Return cached response
        return Promise.reject({
          response: { data: cached.data },
          isFromCache: true
        });
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - cache and error handling
API.interceptors.response.use(
  (response) => {
    // Cache successful GET responses
    if (response.config.method === 'get') {
      const cacheKey = `${response.config.url}`;
      requestCache.set(cacheKey, {
        data: response.data,
        timestamp: Date.now()
      });
    }
    return response;
  },
  (error) => {
    // Handle cache hits
    if (error.isFromCache) {
      return Promise.resolve(error.response);
    }

    // Enhanced error handling
    const status = error.response?.status;
    const message = error.response?.data?.error || error.message;

    // Handle specific error cases
    if (status === 401) {
      // Token expired or invalid - clear auth
      localStorage.removeItem('token');
      window.location.href = '/login';
    } else if (status === 403) {
      console.error('Access forbidden:', message);
    } else if (status === 404) {
      console.error('Resource not found:', message);
    } else if (status === 429) {
      console.error('Too many requests - rate limited');
    } else if (!error.response) {
      // Network error
      console.error('Network error - server may be offline');
    }

    return Promise.reject(error);
  }
);

// Authenticated user services
export const registerUser = async (userData) => {
  try {
    const response = await API.post('/user/register', userData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Registration failed', { cause: error });
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await API.post('/user/login', credentials);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Login failed', { cause: error });
  }
};

export const getMe = async () => {
  try {
    const response = await API.get('/user/me');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to fetch user profile', { cause: error });
  }
};

// Repository analysis services
export const analyzeRepository = async (repoUrl) => {
  try {
    if (!repoUrl || typeof repoUrl !== 'string') {
      throw new Error('Invalid repository URL');
    }

    const response = await API.post('/repository/analyze', { repoUrl });
    return response.data;
  } catch (error) {
    const message = error.response?.data?.error || error.message || 'Repository analysis failed';
    throw new Error(message, { cause: error });
  }
};

export const getAnalysisHistory = async () => {
  try {
    const response = await API.get('/repository/history');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to fetch analysis history', { cause: error });
  }
};

export const deleteAnalysisFromHistory = async (id) => {
  try {
    if (!id) throw new Error('Invalid analysis ID');
    const response = await API.delete(`/repository/${id}`);
    // Clear cache for history after deletion
    requestCache.delete('/repository/history');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to delete analysis', { cause: error });
  }
};

// Health check utility
export const checkServerHealth = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL.replace('/api', '')}/health`, {
      timeout: 5000
    });
    return response.data;
  } catch (error) {
    throw new Error('Server is not responding', { cause: error });
  }
};

export default API;

