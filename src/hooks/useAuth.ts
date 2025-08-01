import { useEffect, useState } from "react";
import { getToken, saveToken, removeToken } from "../services/authService";
import { jwtDecode } from "jwt-decode";
import api from "../services/api";

// interface DecodedToken {
//   exp: number;
//   role?: string;
//   [key: string]: unknown;
// }

interface DecodedToken {
  exp: number;
  role?: string;
  email?: string;
  FullName?: string;
  FirstName?: string;
  LastName?: string;
  [key: string]: unknown;
}

export function useAuth() {
  const [user, setUser] = useState<DecodedToken | null>(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(getToken());

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    let decoded: DecodedToken;
    try {
      decoded = jwtDecode<DecodedToken>(token);
    } catch {
      removeToken();
      setUser(null);
      setLoading(false);
      return;
    }

    const exp = decoded.exp * 1000;
    const role = String(
      decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ||
        ""
    );

    const email = String(
      decoded[
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"
      ] || ""
    );

    const FullName = String(decoded["FullName"] || "");

    const currentTime = Date.now();
    const timeUntilExpiry = exp - currentTime;

    if (timeUntilExpiry <= 0) {
      silentRefresh();
      setLoading(false);
      return;
    }

    setUser({ ...decoded, role, email, FullName, exp });

    setLoading(false);

    const refreshBefore = timeUntilExpiry - 60000;

    const timer = setTimeout(
      () => {
        silentRefresh();
      },
      refreshBefore > 0 ? refreshBefore : 0
    );

    return () => clearTimeout(timer);
  }, [token]);

  const silentRefresh = async () => {
    try {
      const response = await api.post(
        "/Auth/refresh-token",
        {},
        { withCredentials: true }
      );
      const newToken = response.data.token;
      saveToken(newToken);
      setToken(newToken);

      const newDecoded = jwtDecode<DecodedToken>(newToken);
      const newExp = newDecoded.exp * 1000;
      const newRole = String(
        newDecoded[
          "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
        ] || ""
      );

      const newEmail = String(
        newDecoded[
          "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"
        ] || ""
      );

      const newFullName = String(newDecoded["FullName"] || "");

      setUser({
        ...newDecoded,
        role: newRole,
        email: newEmail,
        FullName: newFullName,
        exp: newExp,
      });
    } catch {
      removeToken();
      setUser(null);
      window.location.href = "/signin";
    }
  };

  return {
    user,
    isAuthenticated: !!user,
    loading,
    token,
  };
}
