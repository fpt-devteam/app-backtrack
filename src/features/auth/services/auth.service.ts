import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  UserCredential
} from "firebase/auth";

import { publicClient } from "../../../api/common/client";
import { auth } from "../../../lib/firebase";
import { LoginRequest, LoginResponse, RegisterFirebaseRequest, RegisterFirebaseResponse, SyncRequest, SyncResponse } from "../types/auth.type";

export const loginFirebase = async (req: LoginRequest): Promise<LoginResponse> => {
  const { email, password } = req;

  const res: LoginResponse = {
    status: false,
    idToken: ""
  };

  try {
    const response = await signInWithEmailAndPassword(auth, email, password);
    res.status = true;
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