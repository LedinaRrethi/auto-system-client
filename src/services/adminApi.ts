import api from "./api";



export async function fetchUsers(page = 1, pageSize = 10) {
  const response = await api.get(`/Admin/users`, {
    params: {
      page,
      pageSize,
      sortField: "CreatedOn",
      sortOrder: "desc",
    },
    withCredentials: true,
  });
  return response.data;
}

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
