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
      .then(({ accessToken, user }) => {
        setAccessToken(accessToken);
        setUser(user);
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
