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
    <div className="group relative overflow-hidden rounded-3xl border border-gray-200/50 bg-white p-8 shadow-sm transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1 dark:border-gray-800/50 dark:bg-gradient-to-br dark:from-gray-900/90 dark:to-gray-800/90 backdrop-blur-sm">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-purple-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 dark:from-blue-900/10 dark:to-purple-900/10"></div>
      
      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
          <Icon className="text-white size-8" />
        </div>
        
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
            {title}
          </h3>
          
          {description && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 leading-relaxed">
              {description}
            </p>
          )}
          
          <div className="mt-4">
            <div className="flex items-end gap-2">
              <h4 className="font-bold text-gray-900 text-4xl dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                {typeof value === "number" ? value.toLocaleString() : value}
              </h4>
              <div className="w-2 h-2 bg-green-500 rounded-full mb-3 opacity-60 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Subtle border glow on hover */}
      <div className="absolute inset-0 rounded-3xl border-2 border-transparent bg-gradient-to-r from-blue-500/0 via-purple-500/0 to-blue-500/0 group-hover:from-blue-500/20 group-hover:via-purple-500/20 group-hover:to-blue-500/20 transition-all duration-300 -z-10"></div>
    </div>
  </div>
);

const LoadingCard = () => (
  <div className="col-span-12 sm:col-span-6 lg:col-span-4 xl:col-span-3">
    <div className="rounded-3xl border border-gray-200/50 bg-white p-8 shadow-sm dark:border-gray-800/50 dark:bg-gradient-to-br dark:from-gray-900/90 dark:to-gray-800/90 backdrop-blur-sm animate-pulse">
      <div className="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-2xl mb-6"></div>
      <div className="space-y-3">
        <div className="w-32 h-5 bg-gray-200 rounded-lg dark:bg-gray-700"></div>
        <div className="w-24 h-4 bg-gray-200 rounded dark:bg-gray-700"></div>
        <div className="w-20 h-4 bg-gray-200 rounded dark:bg-gray-700"></div>
      </div>
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
      const totalUsers = (adminData.totalUsers.Approved ?? 0) + (adminData.totalUsers.Pending ?? 0 ) + (adminData.totalUsers.Rejected ?? 0);
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
        />,
        <MetricCard
          key="admin-vehicles"
          icon={Car}
          title="Vehicle Requests"
          value={totalVehicles}
          description={`Approved: ${adminData.totalVehicleRequests.Approved ?? 0}, Pending: ${adminData.totalVehicleRequests.Pending ?? 0}, Rejected: ${adminData.totalVehicleRequests.Rejected ?? 0}`}
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
          value={policeData.fines ?? 0}
          description="All issued fines"
        />,
        <MetricCard
          key="police-notif"
          icon={Bell}
          title="Notifications"
          value={policeData.notifications ?? 0}
          description="Unread notifications"
        />,
      ];
    }

    // Specialist Cards
    if (role === "Specialist" && specialistData) {
      const totalInspections =
        (specialistData.inspections.Approved ?? 0) + (specialistData.inspections.Pending ?? 0 ) + (specialistData.inspections.Rejected ?? 0);

      return [
        <MetricCard
          key="spec-inspections"
          icon={CheckCircle}
          title="Total Inspections"
          value={totalInspections}
          description={`Approved: ${specialistData.inspections.Approved ?? 0}, Pending: ${specialistData.inspections.Pending ?? 0}, Rejected: ${specialistData.inspections.Rejected ?? 0}`}
        />,
        <MetricCard
          key="spec-notif"
          icon={Bell}
          title="Notifications"
          value={specialistData.notifications ?? 0}
          description="Unread notifications"
        />,
      ];
    }

    // Individ Cards
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
        />,
        <MetricCard
          key="user-vehicles"
          icon={Car}
          title="My Vehicle Requests"
          value={totalVehicles}
          description={`Approved: ${userData.myVehicleRequestsCount.Approved ?? 0}, Pending: ${userData.myVehicleRequestsCount.Pending ?? 0}, Rejected: ${userData.myVehicleRequestsCount.Rejected ?? 0}`}
        />,
        <MetricCard
          key="user-inspections"
          icon={FileText}
          title="My Inspections"
          value={totalInspections}
          description={`Approved: ${userData.myInspectionRequestCount.Approved ?? 0}, Pending: ${userData.myInspectionRequestCount.Pending ?? 0}, Rejected: ${userData.myInspectionRequestCount.Rejected ?? 0}`}
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex justify-center items-center">
        <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-red-200 dark:border-red-800">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-2">Error</h2>
          <p className="text-gray-600 dark:text-gray-300">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto p-6 sm:p-8 lg:p-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent dark:from-white dark:via-blue-200 dark:to-purple-200 mb-4">
            Dashboard
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Welcome back! Here's your overview at a glance.
          </p>
        </div>
        
        <div className="grid grid-cols-12 gap-6 md:gap-8">
          {renderCards()}
        </div>
      </div>
    </div>
  );
}