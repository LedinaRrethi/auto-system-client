import { useEffect, useState, ReactNode, useCallback } from "react";
import { countUnseenNotifications, getUnseenNotifications } from "../services/notificationService";
import { Notificationn } from "../types/Notification/Notificationn";
import { NotificationContext } from "./NotificationContextHelper";


export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<Notificationn[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = useCallback(async () => {
    const token = sessionStorage.getItem("authToken");
    if (!token) return;

    try {
      const unseen = await getUnseenNotifications();
      const count = await countUnseenNotifications();
      setNotifications(unseen.slice(0, 6));
      setUnreadCount(count);
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    }
  }, []);

  const markAsReadLocally = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.idpK_Notification !== id));
    setUnreadCount((prev) => Math.max(prev - 1, 0));
  };

  const markAllAsReadLocally = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  return (
    <NotificationContext.Provider
      value={{ unreadCount, notifications, fetchNotifications, markAsReadLocally, markAllAsReadLocally }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
