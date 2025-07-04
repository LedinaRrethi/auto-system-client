import api from "./api";

export const getAllNotifications = async (): Promise<Notification[]> => {
  const response = await api.get<Notification[]>("/Notification/all");
  return response.data;
};

export const getUnseenNotifications = async (): Promise<Notification[]> => {
  const response = await api.get<Notification[]>("/Notification/unseen");
  return response.data;
};

export const countUnseenNotifications = async (): Promise<number> => {
  const response = await api.get<number>("/Notification/count-unseen");
  return response.data;
};

export const markAllAsSeen = async (): Promise<void> => {
  await api.put("/Notification/mark-all-seen");
};

export const markOneAsSeen = async (notificationId: string): Promise<void> => {
  await api.put(`/Notification/mark-one-seen/${notificationId}`);
};
