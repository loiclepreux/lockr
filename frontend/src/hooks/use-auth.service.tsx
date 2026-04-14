import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { AuthApi } from "../api/auth.api";
import type {
    AuthResponse,
    MeResponse,
    SigninData,
    SignupData,
} from "../types/auth.type";
import { useAuthStore } from "../stores/auth.store";
import { useToastStore } from "../stores/toast.store";

export function useSignin() {
    const { setUser, setAccessToken } = useAuthStore();
    const queryClient = useQueryClient();
    const addToast = useToastStore((s) => s.addToast);

    return useMutation<AuthResponse, Error, SigninData>({
        mutationFn: (payload) => AuthApi.signin(payload),
        onSuccess: (res) => {
            setUser(res.user);
            setAccessToken(res.accessToken);
            queryClient.invalidateQueries({ queryKey: ["session"] });
            addToast("Connexion réussie", "success");
        },
        onError: () => {
            addToast("Échec de la connexion", "error");
        },
    });
}

export function useSignup() {
    const addToast = useToastStore((s) => s.addToast);

    return useMutation<MeResponse, Error, SignupData>({
        mutationFn: (payload) => AuthApi.signup(payload),
        onSuccess: () => {
            addToast("Inscription réussie", "success");
        },
        onError: () => {
            addToast("Échec de l'inscription", "error");
        },
    });
}

export function useRefreshToken() {
    const { setUser, setAccessToken, accessToken } = useAuthStore();

    return useQuery({
        queryKey: ["refresh"],
        queryFn: async () => {
            const res = await AuthApi.refresh();
            setUser(res.user);
            setAccessToken(res.accessToken);
            return res;
        },
        enabled: !accessToken,
        retry: false,
        refetchOnWindowFocus: false,
    });
}

export function useLogout() {
    const { clearAuth } = useAuthStore();
    const queryClient = useQueryClient();
    const addToast = useToastStore((s) => s.addToast);

    return useMutation<void, Error, void>({
        mutationFn: () => AuthApi.logout(),
        onSuccess: () => {
            clearAuth();
            queryClient.removeQueries({ queryKey: ["session"] });
            addToast("Déconnexion réussie", "success");
        },
        onError: () => {
            addToast("Échec de la déconnexion", "error");
        },
    });
}

export function useChangeEmail() {
    const { setUser } = useAuthStore();
    const addToast = useToastStore((s) => s.addToast);

    return useMutation<MeResponse, Error, string>({
        mutationFn: (newEmail) => AuthApi.changeEmail(newEmail),
        onSuccess: (res) => {
            setUser(res.user);
            addToast("Email modifié avec succès", "success");
        },
        onError: () => {
            addToast("Échec de la modification de l'email", "error");
        },
    });
}

export function useMe() {
    const { setUser } = useAuthStore();

    return useQuery<MeResponse, Error>({
        queryKey: ["session"],
        queryFn: async () => {
            const res = await AuthApi.me();
            setUser(res.user);
            return res;
        },
        retry: false,
        refetchOnWindowFocus: false,
    });
}
