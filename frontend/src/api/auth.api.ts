import { api } from "../utils/axios-client";
import axios from "axios";
import type {
    AuthPayload,
    AuthResponse,
    SigninData,
    SignupData,
} from "../types/auth.types.ts";
import type { IUser } from "../types/IUser";
import type { IResponse } from "../types/IResponse.ts";
export type MeResponse = IResponse<IUser>;

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
        const { data } = await api.get("user/me");
        return data;
    }
    // ⚠️ Appel direct axios — contourne volontairement l'intercepteur
    // pour éviter la boucle infinie si le refresh token est lui-même invalide
    static async refresh(): Promise<AuthPayload> {
        const { data: response } = await axios.get(
            `${import.meta.env.VITE_API_URL}/auth/refresh`,
            { withCredentials: true },
        );
        return response.data;
    }

    static async logout(): Promise<void> {
        await api.post("auth/logout", {}, { withCredentials: true });
    }
}
