import { Route, BrowserRouter, Routes } from "react-router-dom";
import { ScrollToTop } from "./components/common/ScrollToTop";
import AppLayout from "./components/layout/AppLayout";
import Home from "./pages/Dashboard/Home";
import UserProfiles from "./features/shared/view/UserProfiles";
import FullCalendar from "@fullcalendar/react";
import Blank from "./features/shared/view/Blank";
import FormElements from "./pages/Forms/FormElements";
import BasicTables from "./pages/Tables/BasicTables";
import VehicleRegistrationPage from "./features/user/view/VehicleRegistrationPage";
import UserApprovalPage from "./features/admin/view/UserApprovalPage";
import Alerts from "./pages/UiElements/Alerts";
import Avatars from "./pages/UiElements/Avatars";
import Badges from "./pages/UiElements/Badges";
import Buttons from "./pages/UiElements/Buttons";
import Images from "./pages/UiElements/Images";
import Videos from "./pages/UiElements/Videos";
import BarChart from "./pages/Charts/BarChart";
import LineChart from "./pages/Charts/LineChart";
import SignIn from "./features/auth/view/SignIn";
import SignUp from "./features/auth/view/SignUp";
import NotFound from "./pages/OtherPage/NotFound";

import { Toaster } from "react-hot-toast";
import VehicleRequestApproval from "./features/admin/view/VehicleRequestApproval";
import FineRegistrationPage from "./features/police/view/FineRegistrationPage";

export default function App() {
  return (
    <>
      <BrowserRouter>
        <ScrollToTop />

        {/* Toaster global */}
        <Toaster position="top-right" reverseOrder={false} />

        <Routes>
          {/* Dashboard Layout */}
          <Route element={<AppLayout />}>
            <Route index path="/" element={<Home />} />

            {/* Others Page */}
            <Route path="/profile" element={<UserProfiles />} />
            <Route path="/calendar" element={<FullCalendar />} />
            <Route path="/blank" element={<Blank />} />

            {/* Forms */}
            <Route path="/form-elements" element={<FormElements />} />

            {/* Tables */}
            <Route path="/basic-tables" element={<BasicTables />} />
            <Route path="/vehicle-registration" element={<VehicleRegistrationPage />} />
            <Route path="/user-approval" element={<UserApprovalPage />} />
            <Route path="/vehicle-request-approval" element={<VehicleRequestApproval />} />
            <Route path="/fine-registration" element={<FineRegistrationPage />} />

            {/* Ui Elements */}
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/avatars" element={<Avatars />} />
            <Route path="/badge" element={<Badges />} />
            <Route path="/buttons" element={<Buttons />} />
            <Route path="/images" element={<Images />} />
            <Route path="/videos" element={<Videos />} />

            {/* Charts */}
            <Route path="/line-chart" element={<LineChart />} />
            <Route path="/bar-chart" element={<BarChart />} />
          </Route>

          {/* Auth Layout */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}
