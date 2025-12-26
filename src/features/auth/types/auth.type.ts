import { Auth } from "firebase/auth";
import { LoginRequest } from "./auth.dto";

export type UserProfile = {
  id: string;
  email: string;
  displayName: string;
};


export type RegisterFirebaseRequest = {
  auth: Auth;
  email: string;
  password: string;
};

export type RegisterFirebaseResponse = {
  idToken: string;
};

export type RegisterRequest = LoginRequest & {
  confirmPassword: string;
};

export type RegisterResponse = {
  idToken: string;
};

export type RegisterCredentials = LoginRequest & {
  displayName?: string;
};

export type AuthState = {
  isLoggedIn: boolean;
  idToken: string;
};
