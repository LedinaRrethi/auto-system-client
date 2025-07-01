import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { JSX } from "react";

interface Props {
  children: JSX.Element;
  roles: string[];
}

const ProtectedRoute = ({ children, roles }: Props) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) return <Navigate to="/signin" replace />;
  if (!user || !roles.includes(user.role)) return <Navigate to="/unauthorized" replace />;

  return children;
};

export default ProtectedRoute;
