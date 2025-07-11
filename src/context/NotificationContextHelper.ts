import { createContext, useContext } from "react";
import { Notificationn } from "../types/Notification/Notificationn";

interface NotificationContextType {
  unreadCount: number;
  notifications: Notificationn[];
  fetchNotifications: () => Promise<void>;
  markAsReadLocally: (notificationId: string) => void;
  markAllAsReadLocally: () => void;
}

export const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotificationContext = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error("useNotificationContext must be used within NotificationProvider");
  return context;
};