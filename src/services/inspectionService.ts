import { InspectionRequestCreateDTO } from "../types/Inspection";
import api from "./api";

export const createInspectionRequest = async (data: InspectionRequestCreateDTO): Promise<void> => {
  await api.post("/InspectionRequest/request", data);
};
