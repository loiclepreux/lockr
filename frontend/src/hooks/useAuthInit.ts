import { useEffect, useState } from "react";
import { AuthApi } from "../api/auth.api";
import { useAuthStore } from "../stores/useAuthStore";

export const useAuthInit = () => {
    const [isLoading, setIsLoading] = useState(true);

    const setAccessToken = useAuthStore((state) => state.setAccessToken);
    const setUser = useAuthStore((state) => state.setUser);
    const clearAuth = useAuthStore((state) => state.clearAuth);

    useEffect(() => {
        const storedAuth = window.localStorage.getItem("auth-storage");

        if (storedAuth) {
            try {
                const parsed = JSON.parse(storedAuth);

                if (parsed?.state?.accessToken && parsed?.state?.user) {
                    setAccessToken(parsed.state.accessToken);
                    setUser(parsed.state.user);
                    setIsLoading(false);
                    return;
                }
            } catch {
                window.localStorage.removeItem("auth-storage");
            }
        }

        AuthApi.refresh()
            .then(async ({ accessToken, user }) => {
                setAccessToken(accessToken);

                if (user?.id) {
                    setUser(user);
                } else {
                    const meRes = await AuthApi.me();
                    setUser(meRes.data);
                }
            })
            .catch(() => {
                clearAuth();
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [setAccessToken, setUser, clearAuth]);

    return { isLoading };
};
