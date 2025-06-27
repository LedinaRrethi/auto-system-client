import { PaginationQuery } from "../types/PaginationQuery";
import { User } from "../types/User";
import api from "./api";

interface PaginatedResponse<T> {
  items: T[];
  page: number;
  pageSize: number;
  hasNextPage: boolean;
}

export const fetchUsers = async (
  query: PaginationQuery
): Promise<PaginatedResponse<User>> => {
  try {
    const params = new URLSearchParams();

    if (query.search) params.append("search", query.search);
    if (query.page) params.append("page", query.page.toString());
    if (query.pageSize) params.append("pageSize", query.pageSize.toString());
    if (query.sortField) params.append("sortField", query.sortField);
    if (query.sortOrder) params.append("sortOrder", query.sortOrder);

    const response = await api.get<PaginatedResponse<User>>("/Admin/users", {
      params,
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    console.error("fetchUsers error:", error);
    throw error;
  }
};


export async function updateUserStatus(userId: string, newStatus: string) {
  const response = await api.post(
    `/Admin/users/${userId}/status`, 
    JSON.stringify(newStatus), {
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });
  return response.data;
}
