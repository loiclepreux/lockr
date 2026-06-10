import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { IUser } from "../types/IUser";

type AuthState = {
    user: IUser | null;
    accessToken: string | null;
    setUser: (user: IUser | null) => void;
    setAccessToken: (token: string | null) => void;
    clearAuth: () => void;
};

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            accessToken: null,

            setUser: (user) => set({ user }),
            setAccessToken: (token) => set({ accessToken: token }),
            clearAuth: () => set({ user: null, accessToken: null }),
        }),
        {
            name: "auth-storage",
        },
    ),
);
