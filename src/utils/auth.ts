import axios from "axios";

const API_URL = "https://localhost:7134/api/account";

// Token helpers
export function saveToken(token: string) {
  sessionStorage.setItem("authToken", token);
}

export function getToken(): string | null {
  return sessionStorage.getItem("authToken");
}

export function removeToken() {
  sessionStorage.removeItem("authToken");
  sessionStorage.clear();
}

// Auth API

export async function register(user: {
  firstName: string;
  fatherName: string;
  lastName: string;
  birthDate: Date;
  email: string;
  password: string;
}) {
  const response = await api.post(`${API_URL}/register`, user);
  return response.data;
}

export async function login(email: string, password: string) {
  const response = await axios.post(
    `${API_URL}/login`,
    { email, password },
    { withCredentials: true }
  );

  saveToken(response.data.token);
  return response.data;
}

export async function logout() {
  try {
    await axios.post(`${API_URL}/logout`, {}, { withCredentials: true });
    removeToken();
    window.location.href = "/signin";
  } catch (error) {
    console.error("Logout failed:", error);
  }
}

// Axios instance with interceptors
const api = axios.create({
  baseURL: "https://localhost:7134/api",
  withCredentials: true,
});

api.interceptors.request.use(config => {
  const token = getToken();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const res = await axios.post(`${API_URL}/refresh-token`, {}, { withCredentials: true });
        const newToken = res.data.token;
        saveToken(newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        removeToken();
        window.location.href = "/signin";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
