import { useEffect } from "react";
import * as signalR from "@microsoft/signalr";
import { Notification } from "../types/Notification";
import { jwtDecode } from "jwt-decode";

export const useNotificationHub = (token: string | null, onNotification: (data: Notification) => void) => {
  useEffect(() => {
    if (!token) return; 

    const connection = new signalR.HubConnectionBuilder()
      .withUrl("http://localhost:5169/Notify", {
        accessTokenFactory: () => token
      })
      .withAutomaticReconnect()
      .build();

    connection.on("SendNotification", (notification: Notification) => {
      onNotification(notification);
    });

    connection.start()
      .then(() => {
      
        const decoded = jwtDecode<{ [key: string]: string }>(token);
        const userId = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];

        if (userId) {
          connection.invoke("GetConnectionId", userId);
        } else {
          console.warn("UserId not found in token.");
        }
      })
      .catch(err => console.error("SignalR connection error:", err));

    return () => {
      connection.stop();
    };
  }, [token, onNotification]);
};
