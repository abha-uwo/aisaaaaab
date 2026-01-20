import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
    baseURL: 'http://localhost:5000/api/aibase', // Backend URL for AIBASE agent
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to attach JWT token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // No auto-redirect to login for AIOffice integration
        return Promise.reject(error);
    }
);

export default api;
