import axios from "axios";
import { InspectionRequestList } from "../types/InspectionApproval/InspectionList";
import { PaginationQuery } from "../types/PaginationQuery";

interface PaginatedResponse<T> {
  items: T[];
  page: number;
  pageSize: number;
  hasNextPage: boolean;
}

export const fetchMyInspections = async (
  query: PaginationQuery
): Promise<PaginatedResponse<InspectionRequestList>> => {
  try {
    const params = new URLSearchParams();

    if (query.search) params.append("search", query.search);
    if (query.page) params.append("page", query.page.toString());
    if (query.pageSize) params.append("pageSize", query.pageSize.toString());
    if (query.sortField) params.append("sortField", query.sortField);
    if (query.sortOrder) params.append("sortOrder", query.sortOrder);

    const response = await axios.get("/api/Inspection/my-requests", {
      params,
    });

    return response.data;
  } catch (err) {
    console.error("fetchMyInspections error:", err);
    throw err;
  }
};
