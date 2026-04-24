import { useEffect, useState } from "react";
import { AuthApi } from "../api/auth.api";
import { useAuthStore } from "../stores/useAuthStore";

export const useAuthInit = () => {
  const [isLoading, setIsLoading] = useState(true);

  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const setUser = useAuthStore((state) => state.setUser);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  useEffect(() => {
    AuthApi.refresh()
      .then(async ({ accessToken, user }) => {
        setAccessToken(accessToken);
        // Si le refresh retourne déjà un user complet, on l'utilise.
        // Sinon on appelle /user/me pour hydrater le store.
        if (user?.id) {
          setUser(user);
        } else {
          // Le token est valide, on récupère le profil complet
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