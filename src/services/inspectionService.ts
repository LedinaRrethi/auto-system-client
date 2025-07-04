import { InspectionRequestCreateDTO } from "../types/Inspection/InspectionRequestCreate";
import { MyInspectionsRequest } from "../types/Inspection/MyInspectionsRequest";
import { MyVehiclePlate } from "../types/MyVehiclePlate";
import { PaginationQuery } from "../types/PaginationQuery";
import api from "./api";

interface PagedResponse<T> {
  items: T[];
  page: number;
  pageSize: number;
  hasNextPage: boolean;
}

export const createInspectionRequest = async (data: InspectionRequestCreateDTO): Promise<void> => {
  await api.post("/InspectionRequest/request", data);
};

export const getMyInspectionRequests = async (
  query: PaginationQuery
): Promise<PagedResponse<MyInspectionsRequest>> => {
  const response = await api.get("/InspectionRequest/my-requests-paged", {
    params: query,
  });
  return response.data;
};

export const fetchMyVehiclePlates = async (): Promise<MyVehiclePlate[]> => {
  const response = await api.get("/Inspection/my-vehicles");
  return response.data;
};
