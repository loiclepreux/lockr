import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthApi } from "../api/auth.api";
import type {
    AuthResponse,
    MeResponse,
    SigninData,
    SignupData,
} from "../types/auth.types";
import { useAuthStore } from "../stores/useAuthStore";
import { useToastStore } from "../stores/useToastStore";

export function useSignin() {
    // On utilise login() directement — une seule action atomique au lieu de deux setters
    const { login } = useAuthStore();
    const queryClient = useQueryClient();
    const addToast = useToastStore((s) => s.addToast);

    return useMutation<AuthResponse, Error, SigninData>({
        mutationFn: (payload) => AuthApi.signin(payload),
        onSuccess: (res) => {
            // res.data contient { accessToken, user } — on respecte la structure AuthResponse
            login(res.data.accessToken, res.data.user);
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

// useRefreshToken supprimé — l'interceptor Axios gère déjà le refresh silencieusement.
// Un useQuery ici créerait un double mécanisme qui entrerait en conflit.

export function useLogout() {
    // logout() remplace clearAuth() qui a été supprimé du store
    const { logout } = useAuthStore();
    const queryClient = useQueryClient();
    const addToast = useToastStore((s) => s.addToast);

    return useMutation<void, Error, void>({
        mutationFn: () => AuthApi.logout(),
        onSuccess: () => {
            logout();
            queryClient.removeQueries({ queryKey: ["session"] });
            addToast("Déconnexion réussie", "success");
        },
        onError: () => {
            // Même en cas d'erreur réseau, on déconnecte localement — l'UX est prioritaire
            logout();
            queryClient.removeQueries({ queryKey: ["session"] });
            addToast("Déconnexion réussie", "success");
        },
    });
}

export function useChangeEmail() {
    const { setUser } = useAuthStore();
    const addToast = useToastStore((s) => s.addToast);

    return useMutation<MeResponse, Error, string>({
        // mutationFn commentée → on désactive le hook jusqu'à ce que AuthApi.changeEmail existe
        mutationFn: () =>
            Promise.reject(new Error("changeEmail non implémenté")),
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
