import api from "./api";

// Ruan token ne sessionStorage
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

//  Regjistrim i perdoruesit te ri
export async function registerUser(user: {
  firstName: string;
  fatherName: string;
  lastName: string;
  birthDate: Date;
  email: string;
  personalId: string;
  password: string;
  role: string;
  specialistNumber?: string;
  directorate?: string;
}) {
  const response = await api.post("/account/register", user);
  return response.data;
}

//  Login: merr token nga backend
export async function login(email: string, password: string) {
  const response = await api.post("/account/login", { email, password });
  saveToken(response.data.token);
  return response.data;
}

// Logout: pastron token-in dhe redirect te signin
export async function logout() {
  try {
    const response = await api.post("/account/logout");
    console.log("Logout response:", response.data);
    removeToken();
    await new Promise((res) => setTimeout(res, 1500));
    window.location.href = "/signin";
  } catch (error) {
    console.error("Logout failed:", error);
  }
}
