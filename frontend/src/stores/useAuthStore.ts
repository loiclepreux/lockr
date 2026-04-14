import { create } from "zustand";
import type { IUser } from "../types/IUser";

// useAuthStore — Le store Zustand pour l'authentification
//Il stocke :
//   - Le token JWT (reçu du backend après login)
//   - Les infos de l'utilisateur connecté (sans le mot de passe !)
//   - Un booléen isAuthenticated pour simplifier les vérifications
//
// Il persiste les données dans le localStorage pour survivre au refresh.

// On crée un type sans le password pour ne jamais le stocker côté client
type SafeUser = Omit<IUser, "password">;

interface AuthState {
    // --- Données ---
    token: string | null;
    user: SafeUser | null;
    isAuthenticated: boolean;

    // --- Actions ---
    login: (token: string, user: SafeUser) => void;
    logout: () => void;
    setUser: (user: SafeUser) => void;
}

const useAuthStore = create<AuthState>((set) => ({
    // --- État initial ---
    // On récupère depuis le localStorage au cas où l'utilisateur a refresh la page
    token: localStorage.getItem("token"),
    user: JSON.parse(localStorage.getItem("user") || "null"),
    isAuthenticated: !!localStorage.getItem("token"),

    // --- Action : login ---
    // Appelée après un POST /auth/login réussi
    login: (token, user) => {
        // Sauvegarde permanente (survit au refresh)
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        // Mise à jour du store (met à jour l'interface immédiatement)
        set({ token, user, isAuthenticated: true });
    },

    // --- Action : logout ---
    // Nettoie tout et remet l'état à "non connecté"
    logout: () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        set({ token: null, user: null, isAuthenticated: false });
    },

    // --- Action : setUser ---
    // Met à jour les infos user (ex: après modification du profil dans MyAccount)
    setUser: (user) => {
        localStorage.setItem("user", JSON.stringify(user));
        set({ user });
    }
}));

export default useAuthStore;
