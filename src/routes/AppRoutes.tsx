import { Routes, Route } from "react-router-dom";
import { SignIn, SignUp } from "../features/auth";
import ProtectedRoute from "./ProtectedRoute";
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
      {/* Public Routes */}
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      {/* Protected routes with layout */}
      <Route element={<AppLayout />}>
        <Route
          element={
            <ProtectedRoute
              allowedRoles={["Admin", "Polic", "Specialist", "Individ"]}
            />
          }
        >
          <Route index element={<Home />} />
        </Route>

        {/* Individ */}
        <Route element={<ProtectedRoute allowedRoles={["Individ"]} />}>
          <Route
            path="/vehicle-registration"
            element={<VehicleRegistrationPage />}
          />
          <Route path="/my-fines" element={<FinePage />} />
          <Route path="/my-inspections" element={<InspectionPage />} />
        </Route>

        {/* Polic */}
        <Route element={<ProtectedRoute allowedRoles={["Polic"]} />}>
          <Route path="/fine-registration" element={<FineRegistrationPage />} />
        </Route>

        {/* Specialist */}
        <Route element={<ProtectedRoute allowedRoles={["Specialist"]} />}>
          <Route
            path="/inspection-approval"
            element={<InspectionApprovalPage />}
          />
        </Route>

        {/* Admin */}
        <Route element={<ProtectedRoute allowedRoles={["Admin"]} />}>
          <Route path="/user-approval" element={<UserApprovalPage />} />
          <Route
            path="/vehicle-request-approval"
            element={<VehicleRequestApprovalPage />}
          />
        </Route>
      </Route>

      {/* Fallback Route for 404 - outside AppLayout */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
