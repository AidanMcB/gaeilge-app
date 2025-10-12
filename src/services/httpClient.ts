import axios from 'axios';
import { useAuthStore } from '@/stores/useAuthStore';

const httpClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
});

httpClient.interceptors.request.use(
    (config) => {
        const authStore = useAuthStore();
        
        // Add guest mode header if user is in guest mode
        if (authStore.isGuestMode) {
            config.headers['X-Guest-Mode'] = 'true';
        } else {
            // Add auth token for authenticated users
            const userAuthToken = localStorage.getItem('gaeilgeAuthToken');
            if (userAuthToken) {
                config.headers['Authorization'] = `Bearer ${userAuthToken}`;
            }
        }
        
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default httpClient;
