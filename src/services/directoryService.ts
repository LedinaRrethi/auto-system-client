import api from "./api";

export async function getDirectorates() {
  const response = await api.get("/Directorate");
  return response.data;
}
