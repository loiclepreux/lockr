import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthApi, type MeResponse } from "../api/auth.api";
import type { AuthResponse, SigninData, SignupData } from "../types/auth.types";

import { useAuthStore } from "../stores/useAuthStore";
import { useToastStore } from "../stores/useToastStore";

export function useSignin() {
    const setUser = useAuthStore((state) => state.setUser);
    const setAccesToken = useAuthStore((state) => state.setAccessToken);

    const queryClient = useQueryClient();
    const addToast = useToastStore((s) => s.addToast);

    return useMutation<AuthResponse, Error, SigninData>({
        mutationFn: (payload) => AuthApi.signin(payload),
        onSuccess: (res) => {
            setUser(res.data.user);
            setAccesToken(res.data.accessToken);
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

export function useLogout() {
    const clearAuth = useAuthStore((state) => state.clearAuth);
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
            clearAuth();
            queryClient.removeQueries({ queryKey: ["session"] });
            addToast("Déconnexion réussie", "success");
        },
    });
}

export function useChangeEmail() {
    const setUser = useAuthStore((state) => state.setUser);
    const addToast = useToastStore((s) => s.addToast);

    return useMutation<MeResponse, Error, string>({
        // mutationFn commentée → on désactive le hook jusqu'à ce que AuthApi.changeEmail existe
        mutationFn: () =>
            Promise.reject(new Error("changeEmail non implémenté")),
        onSuccess: (res) => {
            setUser(res.data);
            addToast("Email modifié avec succès", "success");
        },
        onError: () => {
            addToast("Échec de la modification de l'email", "error");
        },
    });
}

export function useMe() {
    const setUser = useAuthStore((state) => state.setUser);

    return useQuery<MeResponse, Error>({
        queryKey: ["session"],
        queryFn: async () => {
            const res = await AuthApi.me();
            setUser(res.data);
            return res;
        },
        retry: false,
        refetchOnWindowFocus: false,
    });
}
