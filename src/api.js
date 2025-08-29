import axios from "axios";
import { authStore } from "./store/authStore";

const instance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true
});

// Request interceptor - access token is HTTP-only cookie, automatically sent
instance.interceptors.request.use((config) => {
    console.log('Request interceptor:', { 
        url: config.url, 
        withCredentials: config.withCredentials
    });
    
    // Access token is HTTP-only cookie, automatically sent with requests
    // No need to manually add Authorization header
    return config;
});

// Response interceptor to handle token refresh
instance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        const auth = authStore();
        

        console.log('Response interceptor error:', error.response?.status, error.config?.url);
        console.log('Auth state:', { hasRefreshToken: !!auth.refreshToken, isRetry: !!originalRequest._retry });

        // If error is 401 (Unauthorized) and we haven't tried to refresh yet
        if (error.response?.status === 401 && !originalRequest._retry && auth.refreshToken) {
            console.log('Attempting token refresh...');
            originalRequest._retry = true;

            try {
                // Call refresh token endpoint with refresh token in body
                // Access token will be sent automatically as HTTP-only cookie
                const refreshResponse = await axios.post(
                    `${import.meta.env.VITE_API_BASE_URL}/auth/refresh`,
                    { duplication_refresh_token: auth.refreshToken },
                    { withCredentials: true }
                );

                console.log('Refresh response:', refreshResponse.data);

                // Update refresh token if a new one is provided
                if (refreshResponse.data.refreshToken) {
                    auth.setRefreshToken(refreshResponse.data.refreshToken);
                    console.log('Refresh token updated');
                }
                
                // Access token is automatically updated as HTTP-only cookie by backend
                console.log('Access token refreshed via HTTP-only cookie, retrying original request...');
                
                // Retry original request - new access token cookie will be automatically sent
                return instance(originalRequest);
            } catch (refreshError) {
                console.error('Token refresh failed:', refreshError);
                
                // Refresh failed, logout user and redirect to login
                // auth.logout();
                // window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        } else {
            console.log('Not attempting refresh:', {
                status: error.response?.status,
                isRetry: !!originalRequest._retry,
                hasRefreshToken: !!auth.refreshToken
            });
        }

        return Promise.reject(error);
    }
);

export default instance;