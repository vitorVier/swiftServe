import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { API_CONFIG } from "@/config/api.config";

const api = axios.create({
    baseURL: API_CONFIG.BASE_URL,
    timeout: API_CONFIG.TIMEOUT,
    headers: {
        "Content-Type": "application/json",
    }
})

// O token é gerenciado pelo AuthContext usando api.defaults.headers.common["Authorization"]
api.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem("@token:restaurante");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error)
    }
);

// Interceptor - Remove o token em caso de erro 401
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            await AsyncStorage.removeItem("@token:restaurante");
            await AsyncStorage.removeItem("@user:restaurante");
        }

        return Promise.reject(error);
    }
);

export default api;