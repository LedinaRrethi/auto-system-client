import { FineCreateFormInput } from "../types/Fine/FineCreateFormInput";
import { FineFilterValues } from "../types/Fine/FineFilterValues";
import { FineTableItem } from "../types/Fine/FineResponse";
import api from "./api"; 

export async function createFine(data: FineCreateFormInput): Promise<void> {
  await api.post("/Fine", data);
}

export async function getMyFines(filter: FineFilterValues, page = 1, pageSize = 10): Promise<FineTableItem[]> {
  const params = new URLSearchParams();

  if (filter.plateNumber) params.append("PlateNumber", filter.plateNumber);
  if (filter.fromDate) params.append("FromDate", filter.fromDate.toISOString());
  if (filter.toDate) params.append("ToDate", filter.toDate.toISOString());

  params.append("page", page.toString());
  params.append("pageSize", pageSize.toString());

  const res = await api.get(`/Fine/my-fines?${params.toString()}`);
  return res.data;
}

export async function searchFinesByPlate(plate: string, page = 1, pageSize = 10): Promise<FineTableItem[]> {
  const res = await api.get(`/Fine/search?plate=${encodeURIComponent(plate)}&page=${page}&pageSize=${pageSize}`);
  return res.data;
}

export async function getAllFines(
  page = 1,
  pageSize = 10
): Promise<FineTableItem[]> {
  const res = await api.get(`/Fine/all?page=${page}&pageSize=${pageSize}`);
  return res.data.items;
}

export async function fetchVehicleOwnerDetails(plateNumber: string) {
  const res = await api.get(`/Fine/owner-details?plate=${encodeURIComponent(plateNumber)}`);
  return res.data;
}
