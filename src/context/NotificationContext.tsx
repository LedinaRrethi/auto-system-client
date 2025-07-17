import { useEffect, useState, ReactNode, useCallback, useRef } from "react";
import * as signalR from "@microsoft/signalr";
import { jwtDecode } from "jwt-decode";
import toast from "react-hot-toast";

import { countUnseenNotifications, getUnseenNotifications} from "../services/notificationService";
import { Notificationn } from "../types/Notification/Notificationn";
import { NotificationContext } from "./NotificationContextHelper";

const API_URL = import.meta.env.VITE_API_URL_SIGNALR;

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<Notificationn[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const connectionRef = useRef<signalR.HubConnection | null>(null);

  const isTokenValid = (token: string | null): boolean => {
    try {
      if (!token) return false;
      const decoded = jwtDecode<{ exp: number }>(token);
      return decoded.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  };

  const fetchNotifications = useCallback(async () => {
    try {
      const [unseen, count] = await Promise.all([
        getUnseenNotifications(),
        countUnseenNotifications(),
      ]);
      setNotifications(unseen.slice(0, 6));
      setUnreadCount(count);
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  useEffect(() => {
    const token = sessionStorage.getItem("authToken");

    // nqse token nuk eshte apo eshte kriju nje lidhje , nuk krijoj lidhje tjt me signalR
    if (!isTokenValid(token) || connectionRef.current) return; 

    //krijoj lidhje me SignalR duke perdor token per autorizim dhe WebSocket si transport
    const hub = new signalR.HubConnectionBuilder()
      .withUrl(API_URL, {
        accessTokenFactory: () => token!,
        transport: signalR.HttpTransportType.WebSockets,
      })
      .withAutomaticReconnect()
      .build();

    connectionRef.current = hub; // e ruaj lidhjen ne ref

    //kur vjen njoftim nga serveri
    hub.on("SendNotification", async (notification: Notificationn) => {

      //pres 2 sekonda dhe marr te dhenat nga db , per tu siguru qe ruajtja ka ndodh
      setTimeout(fetchNotifications, 2000);

      toast.custom((t) => (
        <div className="bg-orange-50 border border-orange-200 shadow-lg rounded-md p-4 mb-3 pr-6 max-w-sm w-full flex justify-between items-start">
          <div className="flex flex-col">
            <p className="font-semibold text-orange-800">{notification.title}</p>
            <p className="text-sm text-orange-700 mt-1">{notification.message}</p>
          </div>
          <button onClick={() => toast.remove(t.id)} className="ml-4 text-orange-400 hover:text-orange-800">
            ×
          </button>
        </div>
      ), {
        duration: 8000,
        position: "bottom-right",
        id: notification.idpK_Notification,
      });
    });

    //pasi lidhja eshte vendos,gjej userId nga token per te lidh userin me SignalR
    hub.start()
      .then(async () => {
        const decoded = jwtDecode<{ [key: string]: string }>(token!);
        const userId = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
        if (userId) {
          try {
            //dergon userID te serveri per ta lidh m eConnectionId ne SignalR
            await hub.invoke("GetConnectionId", userId);
          } catch (err) {
            console.error("Invoke GetConnectionId failed", err);
          }
        }
      })
      .catch((err) => console.error("SignalR error:", err));

      //mbyll lidhjen
    return () => {
      hub.stop().catch(console.error);
      connectionRef.current = null;
    };
  }, [fetchNotifications]);

  const markAsReadLocally = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.idpK_Notification !== id));
    setUnreadCount((prev) => Math.max(prev - 1, 0));
  };

  const markAllAsReadLocally = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  return (
    <NotificationContext.Provider
      value={{
        unreadCount,
        notifications,
        fetchNotifications,
        markAsReadLocally,
        markAllAsReadLocally,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
