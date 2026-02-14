import axios from "axios";

// API Configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "https://shrill-amphibian-estate-backend-f9bf3bf3.koyeb.app/api",
  headers: { 
    "Content-Type": "application/json" 
  },
  withCredentials: true, // Add this for CORS with credentials
  timeout: 30000, // 30 seconds timeout
});

// Request interceptor - Attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('API Request:', config.method.toUpperCase(), config.baseURL + config.url); // Debug log
    return config;
  },
  (error) => {
    console.error("Request Error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor - Handle auth errors and logging
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Log error for debugging
    if (error.response) {
      console.error("API Error Response:", error.response.data);
      console.error("Status:", error.response.status);
    } else if (error.request) {
      console.error("API Error - No Response:", error.request);
    } else {
      console.error("API Error:", error.message);
    }

    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;