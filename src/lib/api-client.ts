import axios from "axios";

// Create an axios instance with base configuration
const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api",
    headers: {
        "Content-Type": "application/json",
    },
});

// Add request interceptor for JWT if needed
apiClient.interceptors.request.use(
    (config) => {
        const token = typeof window !== "undefined" ? localStorage.getItem("auth-token") : null;
        
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        
        return config;
    },
    (error) => Promise.reject(error)
);

// Add response interceptor for error handling
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle unauthorized errors (e.g., redirect to login)
        if (error.response?.status === 401) {
            if (typeof window !== "undefined") {
                localStorage.removeItem("auth-token");
                // Optional: window.location.href = "/login";
            }
        }
        return Promise.reject(error);
    }
);

export default apiClient;
