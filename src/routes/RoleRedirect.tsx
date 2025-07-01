import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const RoleRedirect = () => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  switch (user.role) {
    case "Individ":
      return <Navigate to="/home" replace />;
    case "Admin":
      return <Navigate to="/home" replace />;
    case "Polic":
      return <Navigate to="/home" replace />;
    case "Specialist":
      return <Navigate to="/home" replace />;
    default:
      return <Navigate to="/unauthorized" replace />;
  }
};

export default RoleRedirect;
