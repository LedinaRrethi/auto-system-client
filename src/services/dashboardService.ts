import { AdminDashboardData } from "../types/Dashboard/AdminDashboardData";
import { PoliceDashboardData } from "../types/Dashboard/PoliceDashboardData";
import { SpecialistDashboardData } from "../types/Dashboard/SpecialistDashboardData";
import { UserDashboardData } from "../types/Dashboard/UserDashboardData";
import api from "./api";

//Admin Dashboard  
export const getAdminDashboard = async (): Promise<AdminDashboardData> => {
  const response = await api.get<AdminDashboardData>("/Dashboard/admin");
  return response.data;
};

// Specialist Dashboard 
export const getSpecialistDashboard = async (): Promise<SpecialistDashboardData> => {
  const response = await api.get<SpecialistDashboardData>("/Dashboard/specialist");
  return response.data;
};

// Police Dashboard 
export const getPoliceDashboard = async (): Promise<PoliceDashboardData> => {
  const response = await api.get<PoliceDashboardData>("/Dashboard/police");
  return response.data;
};

// User Dashboard - GET /api/Dashboard/user
export const getUserDashboard = async (): Promise<UserDashboardData> => {
  const response = await api.get<UserDashboardData>("/Dashboard/user");
  return response.data;
};