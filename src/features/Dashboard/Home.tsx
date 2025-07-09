import { useEffect, useState } from "react";
import {
  Users,
  Car,
  FileText,
  Bell,
  Shield,
  CheckCircle,
  AlertTriangle,
  XCircle,
} from "lucide-react";
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
import { Link } from "react-router-dom";

type UserRole = "Admin" | "Police" | "Specialist" | "Individ";

const MetricCard = ({
  icon: Icon,
  title,
  value,
  description,
  to,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  value: string | number;
  description?: string;
  to?: string;
}) => {
  const CardContent = (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 min-h-[190px] flex flex-col justify-between relative overflow-hidden group cursor-pointer">
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-500/5 to-purple-600/5 rounded-full transform translate-x-8 -translate-y-8 group-hover:scale-110 transition-transform duration-300"></div>

      <div className="relative z-10">
        <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-md mb-4 group-hover:shadow-lg group-hover:scale-105 transition-all duration-300">
          <Icon className="text-white size-7" />
        </div>

        <h3 className="text-base font-semibold text-gray-800 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
          {title}
        </h3>

        <div className="mb-3">
          <span className="font-bold dark:text-white text-2xl sm:text-3xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {typeof value === "number" ? value.toLocaleString() : value}
          </span>
        </div>
      </div>

      {description && (
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-auto relative z-10">
          {description}
        </p>
      )}
    </div>
  );

  return to ? <Link to={to}>{CardContent}</Link> : CardContent;
};

const LoadingCard = () => (
  <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm animate-pulse min-h-[190px] flex flex-col justify-between">
    <div>
      <div className="w-14 h-14 bg-gray-200 dark:bg-gray-700 rounded-xl mb-4"></div>
      <div className="w-3/4 h-4 bg-gray-200 dark:bg-gray-700 rounded mb-3"></div>
      <div className="w-1/2 h-8 bg-gray-200 dark:bg-gray-700 rounded mb-3"></div>
      <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
    </div>
  </div>
);

export default function DashboardPage() {
  const [role, setRole] = useState<UserRole | null>(null);
  const [adminData, setAdminData] = useState<AdminDashboardData | null>(null);
  const [policeData, setPoliceData] = useState<PoliceDashboardData | null>(
    null
  );
  const [specialistData, setSpecialistData] =
    useState<SpecialistDashboardData | null>(null);
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
        if (storedRole === "Specialist")
          setSpecialistData(await getSpecialistDashboard());
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

    if (role === "Admin" && adminData) {
      const totalUsers =
        (adminData.totalUsers.Approved ?? 0) +
        (adminData.totalUsers.Pending ?? 0) +
        (adminData.totalUsers.Rejected ?? 0);
      const totalVehicles =
        (adminData.totalVehicleRequests.Approved ?? 0) +
        (adminData.totalVehicleRequests.Pending ?? 0) +
        (adminData.totalVehicleRequests.Rejected ?? 0);
      return [
        <MetricCard
          key="admin-users"
          icon={Users}
          title="Total Users"
          value={totalUsers}
          description={`Approved: ${adminData.totalUsers.Approved ?? 0}, Pending: ${adminData.totalUsers.Pending ?? 0}, Rejected: ${adminData.totalUsers.Rejected ?? 0}`}
          to="/user-approval"
        />,

        <MetricCard
          key="admin-vehicles"
          icon={Car}
          title="Vehicle Requests"
          value={totalVehicles}
          description={`Approved: ${adminData.totalVehicleRequests.Approved ?? 0}, Pending: ${adminData.totalVehicleRequests.Pending ?? 0}, Rejected: ${adminData.totalVehicleRequests.Rejected ?? 0}`}
          to="/vehicle-request-approval"
        />,
        <MetricCard
          key="admin-notif"
          icon={Bell}
          title="Notifications"
          value={adminData.notifications}
          description="Unread notifications"
          to="/notifications"
        />,
      ];
    }

    if (role === "Police" && policeData) {
      return [
        <MetricCard
          key="police-fines"
          icon={Shield}
          title="Total Fines"
          value={policeData.fines ?? 0}
          description="All issued fines"
          to="/fine-registration"
        />,
        <MetricCard
          key="police-notif"
          icon={Bell}
          title="Notifications"
          value={policeData.notifications ?? 0}
          description="Unread notifications"
          to="/notifications"
        />,
      ];
    }

    if (role === "Specialist" && specialistData) {
      const totalInspections =
        (specialistData.inspections.Approved ?? 0) +
        (specialistData.inspections.Pending ?? 0) +
        (specialistData.inspections.Rejected ?? 0);
      return [
        <MetricCard
          key="spec-inspections"
          icon={CheckCircle}
          title="Total Inspections"
          value={totalInspections}
          description={`Approved: ${specialistData.inspections.Approved ?? 0}, Pending: ${specialistData.inspections.Pending ?? 0}, Rejected: ${specialistData.inspections.Rejected ?? 0}`}
          to="/inspection-approval"
        />,
        <MetricCard
          key="spec-notif"
          icon={Bell}
          title="Notifications"
          value={specialistData.notifications ?? 0}
          description="Unread notifications"
          to="/notifications"
        />,
      ];
    }

    if (role === "Individ" && userData) {
      const totalVehicles =
        (userData.myVehicleRequestsCount.Approved ?? 0) +
        (userData.myVehicleRequestsCount.Pending ?? 0) +
        (userData.myVehicleRequestsCount.Rejected ?? 0);
      const totalInspections =
        (userData.myInspectionRequestCount.Approved ?? 0) +
        (userData.myInspectionRequestCount.Pending ?? 0) +
        (userData.myInspectionRequestCount.Rejected ?? 0);
      return [
        <MetricCard
          key="user-fines"
          icon={AlertTriangle}
          title="My Fines"
          value={userData.myFinesCount ?? 0}
          description="Total fines issued"
          to="/my-fines"
        />,
        <MetricCard
          key="user-vehicles"
          icon={Car}
          title="My Vehicles"
          value={totalVehicles}
          description={`Approved: ${userData.myVehicleRequestsCount.Approved ?? 0}, Pending: ${userData.myVehicleRequestsCount.Pending ?? 0}, Rejected: ${userData.myVehicleRequestsCount.Rejected ?? 0}`}
          to="/vehicle-registration"
        />,
        <MetricCard
          key="user-inspections"
          icon={FileText}
          title="My Inspections"
          value={totalInspections}
          description={`Approved: ${ userData.myInspectionRequestCount.Approved ?? 0}, Pending: ${userData.myInspectionRequestCount.Pending ?? 0}, Rejected: ${userData.myInspectionRequestCount.Rejected ?? 0}`}
          to="/my-inspections"
        />,
        <MetricCard
          key="user-notif"
          icon={Bell}
          title="Notifications"
          value={userData.notifications}
          description="Unread notifications"
          to="/notifications"
        />,
      ];
    }

    return [];
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50/30 dark:from-gray-900 dark:to-gray-800 p-4">
        <div className="p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-red-300 dark:border-red-700 text-center max-w-md w-full">
          <XCircle className="w-16 h-16 text-red-500 mb-4 mx-auto" />
          <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-2">
            Error
          </h2>
          <p className="text-gray-600 dark:text-gray-300">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 dark:from-gray-900 dark:to-gray-800 p-4 sm:p-6 lg:p-8">
      {/* Header Section */}
      <div className="mb-8 sm:mb-12">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl sm:text-3xl lg:text-4xl font-bold mb-2 sm:mb-4 text-gray-800 dark:text-white">
            Dashboard
          </h1>
          <p className="text-base sm:text-md text-gray-600 dark:text-gray-300">
            Welcome back! Here's your overview.
          </p>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {renderCards()}
        </div>
      </div>
    </div>
  );
}
