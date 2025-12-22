import { useState } from "react";
import { useAuth } from "../../../providers/AuthProvider";
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
      const { status, idToken } = await loginFirebase(req);
      if (!status) {
        setError("Invalid email or password!");
        return;
      }

      const syncReq: SyncRequest = { idToken };
      await syncUser(syncReq);

      const authState: AuthState = { isLoggedIn: true, idToken };
      await auth.setSession(authState);
    } catch (err: any) {
      console.error("Login error:", err);
      setError("Login failed! Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
}