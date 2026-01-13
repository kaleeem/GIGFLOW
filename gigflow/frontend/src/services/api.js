import axios from 'axios';

/**
 * Axios API Instance
 * Configured for cookie-based authentication
 */

// Use relative paths - works when frontend is served by backend
const api = axios.create({
    baseURL: '', // Empty string = same origin as current page
    withCredentials: true, // Critical for HttpOnly cookies
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor
api.interceptors.request.use(
    (config) => {
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response) {
            // Server responded with error
            const message = error.response.data?.message || 'An error occurred';
            console.error('API Error:', message);
        } else if (error.request) {
            // Request made but no response
            console.error('Network Error: No response from server');
        } else {
            console.error('Error:', error.message);
        }
        return Promise.reject(error);
    }
);

export default api;
