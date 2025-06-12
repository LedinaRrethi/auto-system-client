import axios from "axios";

const BASE_URL = "https://localhost:7134/api/Admin";

export async function fetchUsers(page = 1, pageSize = 10) {
  const response = await axios.get(`${BASE_URL}/users`, {
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
  const response = await axios.post(`${BASE_URL}/users/${userId}/status`, newStatus, {
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });
  return response.data;
}
