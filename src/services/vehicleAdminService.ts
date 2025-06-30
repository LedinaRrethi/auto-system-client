import { VehicleRequestList } from "../types/Vehicle/VehicleRequestList";
import { PaginationQuery } from "../types/PaginationQuery";
import { PaginatedResponse } from "../types/PaginatedResponse";
import api from "./api";
import { VehicleChangeStatus } from "../types/Vehicle/VehicleChangeStatus";

export const getAllVehicleRequests = async (query: PaginationQuery): Promise<PaginatedResponse<VehicleRequestList>> => {
  const res = await api.get("/AdminVehicleRequest/all", {
    params: {
      ...query,
      sortField: query.sortField ?? "CreatedOn",
      sortOrder: query.sortOrder ?? "desc",
    },
  });
  return res.data;
};

export const updateRequestStatus = async (requestId: string, data: VehicleChangeStatus): Promise<void> => {
  await api.post(`/AdminVehicleRequest/update-status/${requestId}`, data);
};
