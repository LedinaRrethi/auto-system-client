import { InspectionRequestCreateDTO } from "../types/Inspection/InspectionRequestCreate";
import { MyInspectionsRequest } from "../types/Inspection/MyInspectionsRequest";
import api from "./api";

export const createInspectionRequest = async (data: InspectionRequestCreateDTO): Promise<void> => {
  await api.post("/InspectionRequest/request", data);
};


export const getMyInspectionRequests = async (): Promise<MyInspectionsRequest[]> => {
  const response = await api.get("/InspectionRequest/my-requests");
  return response.data;
};
