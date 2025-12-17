import { useState } from "react";
import { useAuth } from "../providers/AuthProvider";
import { syncUser } from "../services/auth.service";
import { AuthState, SyncRequest, UserProfile } from "../types/auth.type";

export function useGetMe() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const auth = useAuth();

  const fetchProfile = async (): Promise<UserProfile> => {
    setLoading(true);
    setError(null);

    try {
      const idToken = auth.idToken;
      const syncReq: SyncRequest = { idToken };
      const response = await syncUser(syncReq);

      console.log("data sync", response);

      const authState: AuthState = {
        isLoggedIn: true,
        idToken,
      };
      await auth.setSession(authState);
      return response.data;
    } catch (err: any) {
      setError(err.message ?? "Get profile failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { fetchProfile, loading, error };
}