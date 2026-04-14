import type { IUser } from "./IUser.ts";

export interface SignupData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface SigninData {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: IUser;
  accessToken: string;
}

export interface MeResponse {
  user: IUser;
}
