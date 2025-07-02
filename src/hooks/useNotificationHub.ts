import { useEffect } from "react";
import * as signalR from "@microsoft/signalr";
import { Notification } from "../types/Notification"; 
import { jwtDecode } from "jwt-decode";

export const useNotificationHub = (onNotification: (data: Notification) => void) => {
  useEffect(() => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl("https://localhost:7134/Notify", {
        accessTokenFactory: () => sessionStorage.getItem("token") ?? ""
      })
      .withAutomaticReconnect()
      .build();

    connection.on("SendNotification", (notification: Notification) => {
      console.log("Notification received:", notification);
      onNotification(notification);
    });
connection.start()
  .then(() => {
    console.log("✅ Connected to NotificationHub");

    // Merr tokenin nga sessionStorage
    const token = sessionStorage.getItem("token");

    if (token) {
      try {
        const decoded = jwtDecode<{ [key: string]: string }>(token);
        const userId = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];

        if (userId) {
          connection.invoke("GetConnectionId", userId);
        } else {
          console.warn("userId (nameidentifier) not found in token.");
        }
      } catch (err) {
        console.error("Failed to decode JWT:", err);
      }
    }
  })
  .catch(err => console.error("SignalR connection error:", err));

    return () => {
      connection.stop();
    };
  }, [onNotification]);
};
