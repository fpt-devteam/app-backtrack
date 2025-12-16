import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";

import { auth } from "../lib/firebase";
import { LoginCredentials } from "../types/auth.type";

export type RegisterCredentials = LoginCredentials & {
  displayName?: string;
};

export const login = async (credential: LoginCredentials) => {
  const { email, password } = credential;

  if (!email || !password) throw new Error("Email and password are required");

  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email.trim(),
      password
    );
    return userCredential.user;
  } catch (error: any) {
    throw new Error("Login failed");
  }
};

export const signup = async (credential: RegisterCredentials) => {
  const { email, password, displayName } = credential;

  if (!email || !password) throw new Error("Email and password are required");
  if (password.length < 6) throw new Error("Password must be at least 6 characters");

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email.trim(),
      password
    );

    // Optional: set display name
    if (displayName?.trim()) {
      await updateProfile(userCredential.user, { displayName: displayName.trim() });
    }

    return userCredential.user;
  } catch (error: any) {
    const code = error?.code;
    switch (code) {
      case "auth/email-already-in-use":
        throw new Error("Email is already in use");
      case "auth/invalid-email":
        throw new Error("Invalid email address");
      case "auth/weak-password":
        throw new Error("Password is too weak");
      default:
        throw new Error("Sign up failed");
    }
  }
};
