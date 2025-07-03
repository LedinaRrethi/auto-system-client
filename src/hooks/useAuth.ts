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
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = getToken();
    setToken(storedToken);

    if (!storedToken) {
      setLoading(false);
      return;
    }

    try {
      const decoded = jwtDecode<{ [key: string]: string }>(storedToken);
      const exp = Number(decoded.exp);
      if (exp * 1000 > Date.now()) {
        const role = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
        setUser({ ...decoded, role, exp });
      } else {
        setUser(null);
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
    token, 
  };
}
