import { useEffect, useState } from "react";
import { Users, Car, FileText, Bell, Shield, CheckCircle, AlertTriangle, XCircle } from "lucide-react";
import {
  getAdminDashboard,
  getPoliceDashboard,
  getSpecialistDashboard,
  getUserDashboard,
} from "../../services/dashboardService";
import { AdminDashboardData } from "../../types/Dashboard/AdminDashboardData";
import { PoliceDashboardData } from "../../types/Dashboard/PoliceDashboardData";
import { UserDashboardData } from "../../types/Dashboard/UserDashboardData";
import { SpecialistDashboardData } from "../../types/Dashboard/SpecialistDashboardData";

type UserRole = "Admin" | "Police" | "Specialist" | "Individ";

const MetricCard = ({
  icon: Icon,
  title,
  value,
  description,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  value: string | number;
  description?: string;
}) => (
  <div className="col-span-12 sm:col-span-6 lg:col-span-4 xl:col-span-3">
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 h-full hover:shadow-lg">
      <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
        <Icon className="text-gray-800 size-6 dark:text-white/90" />
      </div>
      <div className="mt-5">
        <span className="text-sm text-gray-500 dark:text-gray-400">{title}</span>
        {description && <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{description}</p>}
        <div className="mt-3">
          <h4 className="font-bold text-gray-800 text-2xl dark:text-white/90">
            {typeof value === "number" ? value.toLocaleString() : value}
          </h4>
        </div>
      </div>
    </div>
  </div>
);

const LoadingCard = () => (
  <div className="col-span-12 sm:col-span-6 lg:col-span-4 xl:col-span-3">
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 h-full animate-pulse">
      <div className="w-12 h-12 bg-gray-200 rounded-xl dark:bg-gray-700 mb-4"></div>
      <div className="w-24 h-4 bg-gray-200 rounded dark:bg-gray-700 mb-2"></div>
      <div className="w-20 h-4 bg-gray-200 rounded dark:bg-gray-700"></div>
    </div>
  </div>
);

export default function DashboardPage() {
  const [role, setRole] = useState<UserRole | null>(null);
  const [adminData, setAdminData] = useState<AdminDashboardData | null>(null);
  const [policeData, setPoliceData] = useState<PoliceDashboardData | null>(null);
  const [specialistData, setSpecialistData] = useState<SpecialistDashboardData | null>(null);
  const [userData, setUserData] = useState<UserDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDashboard = async () => {
      const storedRole = sessionStorage.getItem("userRole") as UserRole | null;
      setRole(storedRole);
      setLoading(true);

      try {
        if (storedRole === "Admin") setAdminData(await getAdminDashboard());
        if (storedRole === "Police") setPoliceData(await getPoliceDashboard());
        if (storedRole === "Specialist") setSpecialistData(await getSpecialistDashboard());
        if (storedRole === "Individ") setUserData(await getUserDashboard());
      } catch {
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const renderCards = () => {
    if (loading) {
      return Array(4)
        .fill(0)
        .map((_, idx) => <LoadingCard key={idx} />);
    }

    // Admin Cards
    if (role === "Admin" && adminData) {
      const totalUsers = adminData.totalUsers.Approved + adminData.totalUsers.Pending + adminData.totalUsers.Rejected;
      const totalVehicles =
        adminData.totalVehicleRequests.Approved +
        adminData.totalVehicleRequests.Pending +
        adminData.totalVehicleRequests.Rejected;

      return [
        <MetricCard
          key="admin-users"
          icon={Users}
          title="Total Users"
          value={totalUsers}
          description={`Approved: ${adminData.totalUsers.Approved}, Pending: ${adminData.totalUsers.Pending}, Rejected: ${adminData.totalUsers.Rejected}`}
        />,
        <MetricCard
          key="admin-vehicles"
          icon={Car}
          title="Vehicle Requests"
          value={totalVehicles}
          description={`Approved: ${adminData.totalVehicleRequests.Approved}, Pending: ${adminData.totalVehicleRequests.Pending}, Rejected: ${adminData.totalVehicleRequests.Rejected}`}
        />,
        <MetricCard
          key="admin-notif"
          icon={Bell}
          title="Notifications"
          value={adminData.notifications}
          description="Unread notifications"
        />,
      ];
    }

    // Police Cards
    if (role === "Police" && policeData) {
      return [
        <MetricCard
          key="police-fines"
          icon={Shield}
          title="Total Fines"
          value={policeData.fines}
          description="All issued fines"
        />,
        <MetricCard
          key="police-notif"
          icon={Bell}
          title="Notifications"
          value={policeData.notifications}
          description="Unread notifications"
        />,
      ];
    }

    // Specialist Cards
    if (role === "Specialist" && specialistData) {
      const totalInspections =
        specialistData.inspections.Approved + specialistData.inspections.Pending + specialistData.inspections.Rejected;

      return [
        <MetricCard
          key="spec-inspections"
          icon={CheckCircle}
          title="Total Inspections"
          value={totalInspections}
          description={`Approved: ${specialistData.inspections.Approved}, Pending: ${specialistData.inspections.Pending}, Rejected: ${specialistData.inspections.Rejected}`}
        />,
        <MetricCard
          key="spec-notif"
          icon={Bell}
          title="Notifications"
          value={specialistData.notifications}
          description="Unread notifications"
        />,
      ];
    }

    // Individual Cards
    if (role === "Individ" && userData) {
      const totalVehicles =
        userData.myVehicleRequestsCount.Approved +
        userData.myVehicleRequestsCount.Pending +
        userData.myVehicleRequestsCount.Rejected;
      const totalInspections =
        userData.myInspectionRequestCount.Approved +
        userData.myInspectionRequestCount.Pending +
        userData.myInspectionRequestCount.Rejected;

      return [
        <MetricCard
          key="user-fines"
          icon={AlertTriangle}
          title="My Fines"
          value={userData.myFinesCount}
          description="Total fines issued"
        />,
        <MetricCard
          key="user-vehicles"
          icon={Car}
          title="My Vehicle Requests"
          value={totalVehicles}
          description={`Approved: ${userData.myVehicleRequestsCount.Approved}, Pending: ${userData.myVehicleRequestsCount.Pending}, Rejected: ${userData.myVehicleRequestsCount.Rejected}`}
        />,
        <MetricCard
          key="user-inspections"
          icon={FileText}
          title="My Inspections"
          value={totalInspections}
          description={`Approved: ${userData.myInspectionRequestCount.Approved}, Pending: ${userData.myInspectionRequestCount.Pending}, Rejected: ${userData.myInspectionRequestCount.Rejected}`}
        />,
        <MetricCard
          key="user-notif"
          icon={Bell}
          title="Notifications"
          value={userData.notifications}
          description="Unread notifications"
        />,
      ];
    }

    return [];
  };

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-center text-red-500">
        <XCircle className="w-10 h-10 mr-2" />
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Dashboard</h1>
        <div className="grid grid-cols-12 gap-4 md:gap-6">{renderCards()}</div>
      </div>
    </div>
  );
}
