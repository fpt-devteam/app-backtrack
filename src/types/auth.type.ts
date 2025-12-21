import { Auth } from "firebase/auth";

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  status: boolean;
  idToken: string;
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

export type SyncRequest = {
  idToken: string;
};

export type SyncResponse = {
  data: UserProfile;
};

export type UserProfile = {
  id: string;
  email: string;
  displayName: string;
};

export type RegisterCredentials = LoginRequest & {
  displayName?: string;
};

export type AuthState = {
  isLoggedIn: boolean;
  idToken: string;
};



