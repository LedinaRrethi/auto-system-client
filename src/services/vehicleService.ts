import { VehicleRequest } from "../types/VehicleRequest";
import api from "./api";


export async function fetchVehicles() {
  const response = await api.get("/VehicleRequest/my-requests"); 
  return response.data; 
}

export const registerVehicle = async (data: VehicleRequest) => {
  return await api.post("/VehicleRequest/register", data);
};

export const updateVehicle = async (vehicleId: string, data: VehicleRequest) => {
  return await api.put(`/VehicleRequest/request-update/${vehicleId}`, data);
};

export const deleteVehicle = async (vehicleId: string) => {
  return await api.delete(`/VehicleRequest/request-delete/${vehicleId}`);
};
