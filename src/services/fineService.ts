import { FineCreate } from "../types/Fine/FineCreate";
import { FineFilter } from "../types/Fine/FineFilter";
import { FineResponse } from "../types/Fine/FineResponse";
import { PaginationQuery } from "../types/PaginationQuery";
import { PaginatedResponse } from "../types/PaginatedResponse";
import api from "./api";

// 1. Create fine (for Police)
export async function createFine(data: FineCreate): Promise<void> {
  await api.post("/Fine", data);
}

// 2. Get fines for logged-in Individ
export const getMyFines = async (
  query: PaginationQuery & FineFilter
): Promise<PaginatedResponse<FineResponse>> => {
  const response = await api.get("/Fine/my-fines", {
    params: {
      page: query.page,
      pageSize: query.pageSize,
      search: query.search ?? "",
      sortField: query.sortField ?? "CreatedOn",
      sortOrder: query.sortOrder ?? "desc",
      PlateNumber: query.plateNumber ?? "",
      FromDate: query.fromDate ?? "",
      ToDate: query.toDate ?? "",
    },
  });

  return response.data;
};

// 3. Get fines created by logged-in Police
// export const getPoliceFines = async (
//   query: PaginationQuery & FineFilter
// ): Promise<PaginatedResponse<FineResponse>> => {
//   const response = await api.get("/Fine/my-issued-fines", {
//     params: {
//       page: query.page,
//       pageSize: query.pageSize,
//       search: query.search ?? "",
//       sortField: query.sortField ?? "CreatedOn",
//       sortOrder: query.sortOrder ?? "desc",
//       PlateNumber: query.plateNumber ?? "",
//       FromDate: query.fromDate ?? "",
//       ToDate: query.toDate ?? "",
//     },
//   });

//   return response.data;
// };


// 4. Get all fines (Police)
export const getAllFines = async (
  query: PaginationQuery & {
    fromDate?: string;
    toDate?: string;
    plateNumber?: string;
  }
): Promise<PaginatedResponse<FineResponse>> => {
  const response = await api.get("/Fine/all", {
    params: {
      page: query.page,
      pageSize: query.pageSize,
      search: query.search ?? "",
      sortField: query.sortField ?? "CreatedOn",
      sortOrder: query.sortOrder ?? "desc",
      fromDate: query.fromDate,
      toDate: query.toDate,
      plateNumber: query.plateNumber,
    },
  });

  return response.data;
};

// 5. Get recipient details by plate (for fine creation)
export async function fetchVehicleOwnerDetails(plate: string): Promise<{
  isFrom: string;
  firstName: string;
  fatherName: string;
  lastName: string;
  phoneNumber: string;
  personalId: string;
}> {
  const res = await api.get("/Fine/recipient-details", {
    params: { plate },
  });
  return res.data;
}
