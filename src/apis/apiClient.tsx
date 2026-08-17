import axios from 'axios';

/**
 * API CLIENT (AXIOS INSTANCE)
 * ===========================
 * Centralized HTTP client configured with request & response interceptors.
 */
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 30000,   // 30 seconds — allow Render free-tier DB warm-up time
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Request Interceptor: Attach Authorization Bearer Token if logged in
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle HTTP errors & token expiration gracefully
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const data = error.response?.data;

    console.warn('API Warning/Error:', {
      status,
      message: data?.message || error.message,
      url: error.config?.url,
    });

    if (status === 401 || status === 403) {
      localStorage.removeItem('token');
      localStorage.removeItem('kp_computer_user_session');
    }

    // Re-throw the full error so callers can inspect error.response
    return Promise.reject(error);
  }
);

export default apiClient;
