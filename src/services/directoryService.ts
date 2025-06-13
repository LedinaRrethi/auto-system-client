import api from "./api";

// Merr listen e drejtorive nga backend
export async function getDirectorates() {
  const response = await api.get("/Directorate");
  return response.data;
}
