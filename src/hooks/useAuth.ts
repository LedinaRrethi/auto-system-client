import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { getToken } from "../services/authService";

interface DecodedToken {
  role: string;
  exp: number;
  [key: string]: any;
}

export function useAuth() {
  const [user, setUser] = useState<DecodedToken | null>(null);

  useEffect(() => {
    const token = getToken();
    if (!token) return;

    try {
      const decoded: DecodedToken = jwtDecode(token);
      if (decoded.exp * 1000 > Date.now()) {
        setUser(decoded);
      }
    } catch {
      setUser(null);
    }
  }, []);

  return {
    user,
    isAuthenticated: !!user,
  };
}
