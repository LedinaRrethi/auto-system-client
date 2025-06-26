import axios from "axios";
import { getToken, removeToken, saveToken } from "./authService";

const API_URL = "https://localhost:7134/api";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Vendos automatikisht token ne cdo kerkese
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// riprovon automatikisht nese token ka skaduar
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const isLoginRequest = originalRequest.url?.includes("/Auth/login");
if (error.response?.status === 401 && !originalRequest._retry && !isLoginRequest) {

    // if (error.response?.status === 401 && !originalRequest._retry) {
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
