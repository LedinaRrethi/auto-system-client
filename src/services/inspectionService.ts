import { InspectionDocumentFile } from "../types/Inspection/InspectionDocumentFile";
import { InspectionRequestCreateDTO } from "../types/Inspection/InspectionRequestCreate";
import { MyInspectionsRequest } from "../types/Inspection/MyInspectionsRequest";
import { MyVehiclePlate } from "../types/MyVehiclePlate";
import { PaginatedResponse } from "../types/PaginatedResponse";
import { PaginationQuery } from "../types/PaginationQuery";
import api from "./api";

export const createInspectionRequest = async (data: InspectionRequestCreateDTO): Promise<void> => {
  await api.post("/InspectionRequest/request", data);
};

export const getMyInspectionRequests = async (
  query: PaginationQuery
): Promise<PaginatedResponse<MyInspectionsRequest>> => {
  const response = await api.get("/InspectionRequest/my-requests-paged", {
    params: query,
  });
  return response.data;
};

export const fetchMyVehiclePlates = async (): Promise<MyVehiclePlate[]> => {
  const response = await api.get("/Inspection/my-vehicles");
  return response.data;
};


export const fetchInspectionDocument = async (
  id: string
): Promise<InspectionDocumentFile> => {
  const res = await api.get<InspectionDocumentFile>(
    `/InspectionRequest/document/${id}`
  );
  return res.data;
};