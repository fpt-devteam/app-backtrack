import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  UserCredential
} from "firebase/auth";

import { publicClient } from "../api/common/client";
import { auth } from "../lib/firebase";
import { LoginRequest, LoginResponse, RegisterFirebaseRequest, RegisterFirebaseResponse, SyncRequest, SyncResponse } from "../types/auth.type";

export const loginFirebase = async (req: LoginRequest): Promise<LoginResponse> => {
  const { email, password } = req;

  if (!email || !password) throw new Error("Email and password are required");
  const normalizedEmail = email.trim().toLowerCase();

  const res: LoginResponse = { idToken: "" };
  try {
    const response = await signInWithEmailAndPassword(auth, normalizedEmail, password);
    res.idToken = await response.user.getIdToken();
  } catch (error: any) {
    console.error(error);
  }
  return res;
};

export const syncUser = async (req: SyncRequest): Promise<SyncResponse> => {
  const { idToken } = req;
  const response = await publicClient.post('core/users', {}, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`,
    },
  });

  const res = response.data as SyncResponse;
  return res;
};

export const registerFirebase = async (req: RegisterFirebaseRequest): Promise<RegisterFirebaseResponse> => {
  const { auth, email, password } = req;
  const cred: UserCredential = await createUserWithEmailAndPassword(auth, email, password);
  const res: RegisterFirebaseResponse = {
    idToken: await cred.user.getIdToken()
  };
  return res;
}