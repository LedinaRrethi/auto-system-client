import { StatusCount } from "./StatusCount";

export interface AdminDashboardData {
  totalUsers: StatusCount;
  totalVehicleRequests: StatusCount;
  notifications: number;
}