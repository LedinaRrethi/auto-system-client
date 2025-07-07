import { jwtDecode } from "jwt-decode";
import { Navigate, Outlet } from "react-router-dom";

interface Props {
  allowedRoles: string[];
}

const ProtectedRoute = ({ allowedRoles }: Props) => {
  const token = sessionStorage.getItem("authToken");

  if (!token) return <Navigate to="/signin" replace />;

  try {
    const decoded = jwtDecode<{ [key: string]: string }>(token);
    const userRole = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

    sessionStorage.setItem("userRole", userRole);

    if (!allowedRoles.includes(userRole)) {
      return <Navigate to="/unauthorized" replace />;
    }

    return <Outlet />;
  } catch {
    return <Navigate to="/signin" replace />;
  }
};

export default ProtectedRoute;
