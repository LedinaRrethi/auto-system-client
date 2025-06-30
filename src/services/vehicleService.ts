import { VehicleRegister } from "../types/Vehicle/VehicleRegister";
import { PaginationQuery } from "../types/PaginationQuery";
import { PaginatedResponse } from "../types/PaginatedResponse";
import api from "./api";
import { Vehicle } from "../types/Vehicle/Vehicle";
import { VehicleUpdate } from "../types/Vehicle/VehicleUpdate";

export const fetchVehicles = async (query: PaginationQuery): Promise<PaginatedResponse<Vehicle>> => {
  const response = await api.get("/VehicleRequest/my-requests", {
    params: {
      page: query.page,
      pageSize: query.pageSize,
      search: query.search ?? "",
      sortField: query.sortField ?? "CreatedOn",
      sortOrder: query.sortOrder ?? "desc",
    },
  });

  return response.data;
};

export const registerVehicle = async (data: VehicleRegister): Promise<void> => {
  await api.post("/VehicleRequest/register", data);
};

export const updateVehicle = async (vehicleId: string, data: VehicleUpdate): Promise<void> => {
  if (!vehicleId) throw new Error("Invalid vehicle IDD");
  await api.put(`/VehicleRequest/request-update/${vehicleId}`, data);
};

export const deleteVehicle = async (vehicleId: string): Promise<void> => {
  await api.delete(`/VehicleRequest/request-delete/${vehicleId}`);
};

export const fetchVehicleById = async (vehicleId: string): Promise<Vehicle> => {
  const response = await api.get(`/VehicleRequest/by-id/${vehicleId}`);
  return response.data;
};
