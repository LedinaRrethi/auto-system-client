import { StatusCount } from "./StatusCount";

export interface UserDashboardData {
  myFinesCount: number;
  myVehicleRequestsCount: StatusCount;
  myInspectionRequestCount: StatusCount;
  notifications: number;
}