import { useState } from "react";
import { useAuth } from "../providers/AuthProvider";
import { loginFirebase, syncUser } from "../services/auth.service";
import { AuthState, LoginRequest, SyncRequest } from "../types/auth.type";

export function useLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const auth = useAuth();

  const login = async (req: LoginRequest) => {
    setLoading(true);
    setError(null);

    try {
      const { idToken } = await loginFirebase(req);

      const syncReq: SyncRequest = { idToken };
      await syncUser(syncReq);

      const authState: AuthState = {
        isLoggedIn: true,
        idToken,
      };
      await auth.setSession(authState);
    } catch (err: any) {
      setError(err.message ?? "Login failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
}