import { create } from "zustand";
import type { IUser } from "../types/IUser";

export type AuthState = {
    user: IUser | null;
    accessToken: string | null;
    isAuthenticated: boolean;

    login: (accessToken: string, user: IUser) => void;
    logout: () => void; // clearAuth supprimé — c'était un doublon exact
    setUser: (user: IUser | null) => void;
    setAccessToken: (token: string | null) => void;
};
const safeParseJSON = <T>(value: string | null): T | null => {
    if (!value || value === "undefined") return null; // on écarte les valeurs invalides
    try {
        return JSON.parse(value) as T;
    } catch {
        return null; // si le JSON est corrompu pour une autre raison, on retourne null proprement
    }
};
export const useAuthStore = create<AuthState>((set) => ({
    // Maintenant la lecture est blindée contre toute valeur corrompue
    user: safeParseJSON<IUser>(localStorage.getItem("user")),
    accessToken: localStorage.getItem("accessToken"),
    isAuthenticated: !!localStorage.getItem("accessToken"),

    login: (accessToken, user) => {
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("user", JSON.stringify(user));
        set({ accessToken, user, isAuthenticated: true });
    },

    logout: () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        set({ accessToken: null, user: null, isAuthenticated: false });
    },

    setUser: (user) => {
        if (user) localStorage.setItem("user", JSON.stringify(user));
        else localStorage.removeItem("user");
        set({ user });
    },

    setAccessToken: (token) => {
        if (token) localStorage.setItem("accessToken", token);
        else localStorage.removeItem("accessToken");
        set({ accessToken: token, isAuthenticated: !!token });
    },
}));

export default useAuthStore;
