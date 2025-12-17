import { getAuth } from "firebase/auth";
import { useState } from "react";
import { useAuth } from "../providers/AuthProvider";
import { registerFirebase, syncUser } from "../services/auth.service";
import { AuthState, RegisterFirebaseRequest, RegisterFirebaseResponse, RegisterRequest, SyncRequest } from "../types/auth.type";
export function useRegister() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setSession } = useAuth();


  const register = async (req: RegisterRequest) => {
    setLoading(true);
    setError(null);

    try {
      const firebaseReq: RegisterFirebaseRequest = {
        auth: getAuth(),
        email: req.email,
        password: req.password,
      };

      const res: RegisterFirebaseResponse = await registerFirebase(firebaseReq);
      console.log("Register with firebase response:", res);

      const idToken = res.idToken;
      const syncReq: SyncRequest = { idToken };
      await syncUser(syncReq);

      const authState: AuthState = {
        isLoggedIn: true,
        idToken: res.idToken,
      };
      await setSession(authState);
    }
    catch (err: any) {
      setError(err.message ?? "Registration failed");
      console.error(err);
    }
    finally {
      setLoading(false);
    }
  };

  return { register, loading, error };
};