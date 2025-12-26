import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  UserCredential
} from "firebase/auth";

import { auth } from "../../../shared/lib/firebase";
import { LoginRequest, LoginResponse } from "../types";
import { RegisterFirebaseRequest, RegisterFirebaseResponse } from "../types/auth.type";

export const loginFirebase = async (req: LoginRequest) => {
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

export const registerFirebase = async (req: RegisterFirebaseRequest): Promise<RegisterFirebaseResponse> => {
  const { auth, email, password } = req;
  const cred: UserCredential = await createUserWithEmailAndPassword(auth, email, password);
  const res: RegisterFirebaseResponse = {
    idToken: await cred.user.getIdToken()
  };
  return res;
};