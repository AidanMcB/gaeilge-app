import axios from 'axios';

const httpClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
});

httpClient.interceptors.request.use(
    (config) => {
        const userAuthToken = localStorage.getItem('gaeilgeAuthToken');
        if (userAuthToken) {
            config.headers['Authorization'] = `Bearer ${userAuthToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default httpClient;
