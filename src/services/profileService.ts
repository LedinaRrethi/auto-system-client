import { UserProfile } from "../types/UserProfile";
import api from "./api";

export async function getMyProfile(): Promise<UserProfile> {
  const response = await api.get<UserProfile>("/Profile/me");
  return response.data;
}
