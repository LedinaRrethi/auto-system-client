import { FineCreate } from "../types/Fine/FineCreate";
import { FineFilter } from "../types/Fine/FineFilter";
import { FineResponse } from "../types/Fine/FineResponse";
import api from "./api";

// 1. Create fine (for Police)
export async function createFine(data: FineCreate): Promise<void> {
  await api.post("/Fine", data);
}

// 2. Get fines for logged-in Individ
export async function getMyFines(
  filter: FineFilter,
  page = 1,
  pageSize = 10
): Promise<{ items: FineResponse[]; page: number; hasNextPage: boolean }> {
  const params = new URLSearchParams();

  if (filter.fromDate) params.append("FromDate", filter.fromDate);
  if (filter.toDate) params.append("ToDate", filter.toDate);
  if (filter.page) params.append("page", filter.page.toString());
  else params.append("page", page.toString());
  if (filter.pageSize) params.append("pageSize", filter.pageSize.toString());
  else params.append("pageSize", pageSize.toString());

  const res = await api.get(`/Fine/my-fines?${params.toString()}`);
  return res.data;
}

// 3. Search fines by plate (Police)
export async function searchFinesByPlate(plate: string, page = 1, pageSize = 10): Promise<FineResponse[]> {
  const res = await api.get(`/Fine/search?plate=${encodeURIComponent(plate)}&page=${page}&pageSize=${pageSize}`);
  return res.data.items;
}

// 4. Get all fines (Police)
export async function getAllFines(page = 1, pageSize = 10): Promise<FineResponse[]> {
  const res = await api.get(`/Fine/all?page=${page}&pageSize=${pageSize}`);
  return res.data.items;
}

// 5. Get recipient details by plate (for fine creation)
export async function fetchVehicleOwnerDetails(plate: string): Promise<{
  isFrom: string;
  firstName: string;
  fatherName: string;
  lastName: string;
  phoneNumber: string;
  personalId: string;
}> {
  const res = await api.get(`/Fine/recipient-details?plate=${encodeURIComponent(plate)}`);
  return res.data;
}

// 6. Get fines created by logged-in Police
export async function getPoliceFines(
  filter: FineFilter,
  page = 1,
  pageSize = 10
): Promise<{ items: FineResponse[]; page: number; hasNextPage: boolean }> {
  const params = new URLSearchParams();

  if (filter.plateNumber) params.append("PlateNumber", filter.plateNumber);
  if (filter.fromDate) params.append("FromDate", filter.fromDate);
  if (filter.toDate) params.append("ToDate", filter.toDate);
  params.append("page", page.toString());
  params.append("pageSize", pageSize.toString());

  const res = await api.get(`/Fine/my-issued-fines?${params.toString()}`);
  return res.data;
}
