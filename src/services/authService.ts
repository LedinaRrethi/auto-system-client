import { RegisterDTO } from "../types/RegisterDTO";
import api from "./api";

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

export async function registerUser(user: RegisterDTO) {
  const response = await api.post("/Auth/register", user);
  return response.data;
}

export async function login(email: string, password: string) {
  const response = await api.post("/Auth/login", { email, password });
  saveToken(response.data.token);
  return response.data;
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
