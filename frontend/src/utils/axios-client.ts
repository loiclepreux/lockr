import axios, { type AxiosInstance } from "axios";
import { useAuthStore } from "../stores/auth.store.ts";
import { useToastStore } from "../stores/toast.store.ts";
import { AuthApi } from "../api/auth.api";

function axiosClient(): AxiosInstance {
    const api = axios.create({
        baseURL: `${import.meta.env.VITE_API_URL}/`,
        withCredentials: true,
    });

    // ---- REQUEST INTERCEPTOR ----
    api.interceptors.request.use((config) => {
        const { accessToken } = useAuthStore.getState();

        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }

        return config;
    });

    api.interceptors.response.use(
        (res) => res,

        async (error) => {
            const { addToast } = useToastStore.getState();

            if (error.response?.status === 429) {
                const retryAfter = error.response.headers["retry-after"];
                const seconds = retryAfter ? parseInt(retryAfter, 10) : 60;
                addToast(
                    `Trop de tentatives. Réessayez dans ${seconds} secondes.`,
                    "warning",
                );
                return Promise.reject(
                    new Error(
                        `Trop de tentatives. Réessayez dans ${seconds} secondes.`,
                    ),
                );
            }
            if (error.response?.status === 401) {
                const originalRequest = error.config;
                if (originalRequest._retry) return Promise.reject(error);
                originalRequest._retry = true;

                try {
                    const refreshResponse = await AuthApi.refresh();
                    const newAccessToken = refreshResponse.accessToken;
                    const newUser = refreshResponse.user;

                    const { setAccessToken, setUser } = useAuthStore.getState();
                    setAccessToken(newAccessToken);
                    setUser(newUser);

                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                    return api(originalRequest);
                } catch (refreshError) {
                    useAuthStore.getState().clearAuth();
                    window.location.href = "/signin";
                    return Promise.reject(refreshError);
                }
            }

            return Promise.reject(error);
        },
    );

    return api;
}

export const api = axiosClient();
