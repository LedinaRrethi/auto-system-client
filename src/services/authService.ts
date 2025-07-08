import { AxiosError } from "axios";
import { RegisterDTO } from "../types/RegisterDTO";
import api from "./api";
import { jwtDecode } from "jwt-decode";

export function saveToken(token: string) {
  sessionStorage.setItem("authToken", token);
}

export function getToken(): string | null {
  return sessionStorage.getItem("authToken");
}

export function removeToken() {
  sessionStorage.removeItem("authToken");
  // sessionStorage.clear();
}

export async function registerUser(user: RegisterDTO) {
  const response = await api.post("/Auth/register", user);
  return response.data;
}

export async function login(email: string, password: string) {
  try {
    const response = await api.post("/Auth/login", { email, password });
    saveToken(response.data.token);

    const decoded = jwtDecode<{ [key: string]: string }>(response.data.token);
    const userRole = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
    
    sessionStorage.setItem("userRole", userRole);
    return response.data;
  } catch (error: unknown) {
    let message = "Login failed. Please try again.";
    console.error("ERR FULL:", error);

    if (typeof error === "object" && error !== null && "response" in error && (error as AxiosError).response) {
      const axiosErr = error as AxiosError<{ error: string }>;
      if (axiosErr.response?.data?.error) {
        message = axiosErr.response.data.error;
      }
    }

    throw new Error(message);
  }
}

export async function logout() {
  try {
    const response = await api.post("/Auth/logout");
    console.log("Logout response:", response.data);
    removeToken();
    await new Promise((res) => setTimeout(res, 1500));
    window.location.href = "/signin";
  } catch (error) {
    console.error("Logout failed:", error);
  }
}
