import { api } from "../utils/axios-client.ts";
import type { SigninData, SignupData } from "../types/auth.type.ts";
import axios from "axios";

export type MeResponse = {
    user: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        password: string;
    };
};

export type AuthResponse = {
    user: MeResponse["user"];
    accessToken: string;
};

export class AuthApi {
    static async signin(body: SigninData): Promise<AuthResponse> {
        const { data } = await api.post("auth/signin", body);
        return data;
    }

    static async signup(body: SignupData): Promise<MeResponse> {
        const { data } = await api.post("auth/signup", body);
        return data;
    }

    static async me(): Promise<MeResponse> {
        const { data } = await api.get("auth/me");
        return data;
    }

    static async refresh(): Promise<AuthResponse> {
        const { data } = await axios.get(
            `${import.meta.env.VITE_API_URL}/auth/refresh`,
            {
                withCredentials: true,
            },
        );
        return data;
    }

    static async changeEmail(newEmail: string): Promise<MeResponse> {
        const { data } = await api.post("auth/change-email", { newEmail });
        return data;
    }

    static async logout(): Promise<void> {
        await api.post("auth/logout", {}, { withCredentials: true });
    }
}
