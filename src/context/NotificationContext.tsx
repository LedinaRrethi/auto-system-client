import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import { countUnseenNotifications, getUnseenNotifications } from "../services/notificationService";
import { Notificationn } from "../types/Notification/Notificationn";

interface NotificationContextType {
  unreadCount: number;
  notifications: Notificationn[];
  fetchNotifications: () => Promise<void>;
  markAsReadLocally: (notificationId: string) => void;
  markAllAsReadLocally: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotificationContext = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error("useNotificationContext must be used within NotificationProvider");
  return context;
};

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<Notificationn[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = useCallback(async () => {
    const unseen = await getUnseenNotifications();
    const count = await countUnseenNotifications();
    setNotifications(unseen.slice(0, 6));
    setUnreadCount(count);
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
