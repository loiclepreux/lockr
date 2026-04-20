import axios, { type AxiosInstance } from "axios";
import { useAuthStore } from "../stores/useAuthStore"; // ← ton nom de fichier
import { AuthApi } from "../api/auth.api";

function axiosClient(): AxiosInstance {
    const api = axios.create({
        baseURL: `${import.meta.env.VITE_API_URL}/`,
        withCredentials: true, // ← indispensable pour que le cookie HttpOnly parte avec chaque requête
    });

    // Le verrou ET la file d'attente en une seule variable
    // null = personne ne refresh
    // Promise<string> = un refresh est en cours, tout le monde attend cette même Promise
    let refreshPromise: Promise<string> | null = null;

    // ---- REQUEST INTERCEPTOR ----
    api.interceptors.request.use((config) => {
        const { accessToken } = useAuthStore.getState();
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    });

    // ---- RESPONSE INTERCEPTOR ----
    api.interceptors.response.use(
        (res) => res,
        async (error) => {
            // 429 — Rate limit
            if (error.response?.status === 429) {
                const retryAfter = error.response.headers["retry-after"];
                const seconds = retryAfter ? parseInt(retryAfter, 10) : 60;
                return Promise.reject(
                    new Error(
                        `Trop de tentatives. Réessayez dans ${seconds} secondes.`,
                    ),
                );
            }

            // 401 — Token expiré
            if (error.response?.status === 401 && !error.config._retry) {
                error.config._retry = true;

                // Si aucun refresh n'est en cours, on en crée un
                // Si un refresh est déjà en cours, on réutilise la même Promise — pas de doublon
                if (!refreshPromise) {
                    refreshPromise = AuthApi.refresh()
                        .then(({ accessToken, user }) => {
                            // Refresh réussi — on met à jour le store en mémoire vive
                            useAuthStore.getState().setAccessToken(accessToken);
                            useAuthStore.getState().setUser(user);
                            return accessToken; // ← la Promise se résout avec le nouveau token
                        })
                        .catch((err) => {
                            // Refresh échoué — session définitivement perdue
                            useAuthStore.getState().clearAuth();
                            window.location.href = "/signin";
                            throw err; // ← on propage l'erreur pour rejeter toutes les Promises en attente
                        })
                        .finally(() => {
                            // On remet le verrou à null — prêt pour un prochain refresh si nécessaire
                            refreshPromise = null;
                        });
                }

                // Toutes les requêtes — première ou suivantes — attendent la même Promise
                // Quand elle se résout, tout le monde reçoit le même nouveau token
                const accessToken = await refreshPromise;
                error.config.headers.Authorization = `Bearer ${accessToken}`;
                return api(error.config); // ← on rejoue la requête originale avec le nouveau token
            }

            return Promise.reject(error);
        },
    );

    return api;
}

export const api = axiosClient();
