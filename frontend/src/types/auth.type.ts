import type { IUser } from "./IUser";
import type { IResponse } from "./IResponse"; // ← on importe le contrat partagé

// Ce que le backend retourne dans "data" après un signin ou signup
export type AuthPayload = {
  accessToken: string;
  user: IUser;
};

// AuthResponse utilise maintenant le contrat partagé IResponse<T>
export type AuthResponse = IResponse<AuthPayload>;

export type SigninData = {
  email: string;
  password: string;
};

export type SignupData = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  address?: string;
};