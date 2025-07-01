import { useEffect, useState } from "react";
import { getToken } from "../services/authService";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  exp: number;
  role?: string;
  [key: string]: unknown;
}

export function useAuth() {
  const [user, setUser] = useState<DecodedToken | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const decoded = jwtDecode<{ [key: string]: string }>(token);

      const exp = Number(decoded.exp);
      if (exp * 1000 > Date.now()) {
        const role = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
        setUser({ ...decoded, role, exp }); 
      }
    } catch {
      setUser(null);
    }

    setLoading(false);
  }, []);

  return {
    user,
    isAuthenticated: !!user,
    loading,
  };
}
