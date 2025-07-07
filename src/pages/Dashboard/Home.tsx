// import EcommerceMetrics from "../../components/ecommerce/EcommerceMetrics";
// import MonthlySalesChart from "../../components/ecommerce/MonthlySalesChart";
// import StatisticsChart from "../../components/ecommerce/StatisticsChart";
// import MonthlyTarget from "../../components/ecommerce/MonthlyTarget";
// import RecentOrders from "../../components/ecommerce/RecentOrders";
// import DemographicCard from "../../components/ecommerce/DemographicCard";
// import PageMeta from "../../components/common/PageMeta";

// export default function Home() {
//   return (
//     <>
//       <PageMeta
//         title="React.js Ecommerce Dashboard | TailAdmin - React.js Admin Dashboard Template"
//         description="This is React.js Ecommerce Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
//       />
//       <div className="grid grid-cols-12 gap-4 md:gap-6">
//         <div className="col-span-12 space-y-6 xl:col-span-7">
//           <EcommerceMetrics />

//           <MonthlySalesChart />
//         </div>

//         <div className="col-span-12 xl:col-span-5">
//           <MonthlyTarget />
//         </div>

//         <div className="col-span-12">
//           <StatisticsChart />
//         </div>

//         <div className="col-span-12 xl:col-span-5">
//           <DemographicCard />
//         </div>

//         <div className="col-span-12 xl:col-span-7">
//           <RecentOrders />
//         </div>
//       </div>
//     </>
//   );
// }

import { useEffect, useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import ComponentCard from "../../components/common/ComponentCard";
import { getAdminDashboard, getPoliceDashboard, getSpecialistDashboard, getUserDashboard } from "../../services/dashboardService";
import { AdminDashboardData } from "../../types/Dashboard/AdminDashboardData";
import { PoliceDashboardData } from "../../types/Dashboard/PoliceDashboardData";
import { SpecialistDashboardData } from "../../types/Dashboard/SpecialistDashboardData";
import { UserDashboardData } from "../../types/Dashboard/UserDashboardData";


type UserRole = "Admin" | "Police" | "Specialist" | "Individ";

export default function Home() {
  const [role, setRole] = useState<UserRole | null>(null);
  const [adminData, setAdminData] = useState<AdminDashboardData | null>(null);
  const [policeData, setPoliceData] = useState<PoliceDashboardData | null>(null);
  const [specialistData, setSpecialistData] = useState<SpecialistDashboardData | null>(null);
  const [userData, setUserData] = useState<UserDashboardData | null>(null);

  useEffect(() => {
    const storedRole = sessionStorage.getItem("userRole") as UserRole | null;
    setRole(storedRole);

    if (!storedRole) return;

    switch (storedRole) {
      case "Admin":
        getAdminDashboard().then(setAdminData);
        break;
      case "Police":
        getPoliceDashboard().then(setPoliceData);
        break;
      case "Specialist":
        getSpecialistDashboard().then(setSpecialistData);
        break;
      case "Individ":
        getUserDashboard().then(setUserData);
        break;
      default:
        break;
    }
  }, []);

  return (
    <>
      <PageMeta title="Dashboard | AutoSystem" description="Role-based dashboard with real data" />

      <div className="grid grid-cols-12 gap-4 md:gap-6">

        {role === "Admin" && adminData && (
          <>
            <ComponentCard title="Users (Approved)" desc="Total Approved Users">
              <p className="text-2xl font-semibold">{adminData.totalUsers.Approved}</p>
            </ComponentCard>
            <ComponentCard title="Users (Pending)" desc="Users awaiting approval">
              <p className="text-2xl font-semibold">{adminData.totalUsers.Pending}</p>
            </ComponentCard>
            <ComponentCard title="Vehicle Requests (Pending)">
              <p className="text-2xl font-semibold">{adminData.totalVehicleRequests.Pending}</p>
            </ComponentCard>
            <ComponentCard title="Notifications">
              <p className="text-2xl font-semibold">{adminData.notifications}</p>
            </ComponentCard>
          </>
        )}

        {role === "Police" && policeData && (
          <>
            <ComponentCard title="Total Fines Issued">
              <p className="text-2xl font-semibold">{policeData.fines}</p>
            </ComponentCard>
            <ComponentCard title="Notifications">
              <p className="text-2xl font-semibold">{policeData.notifications}</p>
            </ComponentCard>
          </>
        )}

        {role === "Specialist" && specialistData && (
          <>
            <ComponentCard title="Inspections Approved">
              <p className="text-2xl font-semibold">{specialistData.inspections.Approved}</p>
            </ComponentCard>
            <ComponentCard title="Inspections Pending">
              <p className="text-2xl font-semibold">{specialistData.inspections.Pending}</p>
            </ComponentCard>
            <ComponentCard title="Notifications">
              <p className="text-2xl font-semibold">{specialistData.notifications}</p>
            </ComponentCard>
          </>
        )}

        {role === "Individ" && userData && (
          <>
            <ComponentCard title="My Fines">
              <p className="text-2xl font-semibold">{userData.myFinesCount}</p>
            </ComponentCard>
            <ComponentCard title="Vehicle Requests (Approved)">
              <p className="text-2xl font-semibold">{userData.myVehicleRequestsCount.Approved}</p>
            </ComponentCard>
            <ComponentCard title="Inspection Requests (Approved)">
              <p className="text-2xl font-semibold">{userData.myInspectionRequestCount.Approved}</p>
            </ComponentCard>
            <ComponentCard title="Notifications">
              <p className="text-2xl font-semibold">{userData.notifications}</p>
            </ComponentCard>
          </>
        )}

      </div>
    </>
  );
}
