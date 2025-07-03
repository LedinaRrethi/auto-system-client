import { Routes, Route, Navigate } from "react-router-dom";
import { SignIn, SignUp } from "../features/auth";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute"; // Import the new one
import AppLayout from "../components/layout/AppLayout";

import VehicleRegistrationPage from "../features/user/view/VehicleRegistrationPage";
import FinePage from "../features/user/view/FinePage";
import InspectionPage from "../features/user/view/InspectionPage";
import FineRegistrationPage from "../features/police/view/FineRegistrationPage";
import InspectionApprovalPage from "../features/specialist/view/InspectionApprovalPage";
import UserApprovalPage from "../features/admin/view/UserApprovalPage";
import VehicleRequestApprovalPage from "../features/admin/view/VehicleRequestApprovalPage";
import NotFound from "../pages/OtherPage/NotFound";
import UnauthorizedPage from "../pages/OtherPage/UnauthorizedPage";
import Home from "../pages/Dashboard/Home";

const AppRoutes = () => {
  return (
    <Routes>

      <Route path="/" element={<Navigate to="/signin" replace />} />

      <Route
        path="/signin"
        element={
          <PublicRoute>
            <SignIn />
          </PublicRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <PublicRoute>
            <SignUp />
          </PublicRoute>
        }
      />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      <Route element={<AppLayout />}>
        <Route
          element={
            <ProtectedRoute
              allowedRoles={["Admin", "Police", "Specialist", "Individ"]}
            />
          }
        >
          <Route index element={<Home />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["Individ"]} />}>
          <Route 
          path="/vehicle-registration" 
          element={<VehicleRegistrationPage />} 
          />
          <Route path="/my-fines" element={<FinePage />} />
          <Route path="/my-inspections" element={<InspectionPage />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["Police"]} />}>
          <Route path="/fine-registration" element={<FineRegistrationPage />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["Specialist"]} />}>
          <Route 
          path="/inspection-approval" 
          element={<InspectionApprovalPage />} 
          />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["Admin"]} />}>
          <Route path="/user-approval" element={<UserApprovalPage />} />
          <Route 
          path="/vehicle-request-approval" 
          element={<VehicleRequestApprovalPage />} 
          />
        </Route>
      </Route>

      {/* Fallback Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
