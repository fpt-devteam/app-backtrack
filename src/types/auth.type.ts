export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  idToken: string;
};

export type SyncRequest = {
  idToken: string;
};

export type SyncResponse = {
  user: UserProfile;
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
  idToken?: string | null;
};



