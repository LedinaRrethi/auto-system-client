import axios from "axios";
import { getToken, removeToken, saveToken } from "./authService";

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

let isRefreshing = false;

// Vendos automatikisht token ne cdo kerkese
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// riprovon automat. nese token ka skaduar
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

     if (!originalRequest || !error.response) {
      return Promise.reject(error);
    }

    const isLoginRequest = originalRequest.url?.includes("/Auth/login");
    const isRefreshRequest = originalRequest.url?.includes("/Auth/refresh-token");

    if (error.response?.status === 401 && !originalRequest._retry && !isLoginRequest && !isRefreshRequest) {
      if (isRefreshing) {
        return Promise.reject(error); 
      }
      
      isRefreshing = true;
      originalRequest._retry = true;

      try {
        const res = await api.post("/Auth/refresh-token", {}, { withCredentials: true });
        const newToken = res.data.token;
        saveToken(newToken);

        api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        isRefreshing = false;  
        return api(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;  
        removeToken();
        window.location.href = "/signin";
        return Promise.reject(refreshError);
      }
    }

    // Nese refresh ose login kthen 401 , behet direkt logout
    if (error.response?.status === 401 && isRefreshRequest) {
      removeToken();
      window.location.href = "/signin";
    }

    return Promise.reject(error);
  }
);


export default api;