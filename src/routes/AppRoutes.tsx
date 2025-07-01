import { Routes, Route } from "react-router-dom";
import { SignIn, SignUp } from "../features/auth";
import ProtectedRoute from "./ProtectedRoute";
import VehicleRegistrationPage from "../features/user/view/VehicleRegistrationPage";
import UserApprovalPage from "../features/admin/view/UserApprovalPage";
import VehicleRequestApprovalPage from "../features/admin/view/VehicleRequestApprovalPage";
import FineRegistrationPage from "../features/police/view/FineRegistrationPage";
import FinePage from "../features/user/view/FinePage";
import InspectionPage from "../features/user/view/InspectionPage";
import InspectionApprovalPage from "../features/specialist/view/InspectionApprovalPage";
import NotFound from "../pages/OtherPage/NotFound";

const AppRoutes = () => {
  return (
    <Routes>
      {/* 🔐 Auth Routes */}
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />

      {/* <Route path="/redirect" element={<RoleRedirect />} /> */}

      <Route
        path="/vehicle-registration"
        element={
          <ProtectedRoute roles={["Individ"]}>
            <VehicleRegistrationPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user-approval"
        element={
          <ProtectedRoute roles={["Admin"]}>
            <UserApprovalPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/vehicle-request-approval"
        element={
          <ProtectedRoute roles={["Admin"]}>
            <VehicleRequestApprovalPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/fine-registration"
        element={
          <ProtectedRoute roles={["Polic"]}>
            <FineRegistrationPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-fines"
        element={
          <ProtectedRoute roles={["Individ"]}>
            <FinePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-inspections"
        element={
          <ProtectedRoute roles={["Individ"]}>
            <InspectionPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/inspection-approval"
        element={
          <ProtectedRoute roles={["Specialist"]}>
            <InspectionApprovalPage />
          </ProtectedRoute>
        }
      />

      {/* <Route path="/unauthorized" element={<UnauthorizedPage />} /> */}

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
