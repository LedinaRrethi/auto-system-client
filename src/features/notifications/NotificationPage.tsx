import { useEffect, useState } from "react";
import ComponentCard from "../../components/common/ComponentCard";
import Switch from "../../components/form/switch/Switch";
import {
  getAllNotifications,
  getUnseenNotifications,
  markAllAsSeen,
  markOneAsSeen,
} from "../../services/notificationService";
import { useNavigate } from "react-router-dom";
import { Notificationn, NotificationnType } from "../../types/Notification/Notificationn";

export default function NotificationPage() {
  const [notifications, setNotifications] = useState<Notificationn[]>([]);
  const [showOnlyUnread, setShowOnlyUnread] = useState<boolean>(false);
  const navigate = useNavigate();

  const fetchData = async () => {
    const data = showOnlyUnread ? await getUnseenNotifications() : await getAllNotifications();
    setNotifications(data);
  };

  useEffect(() => {
    fetchData();
  }, [showOnlyUnread]);

  const handleMarkAllAsRead = async () => {
    await markAllAsSeen();
    fetchData();
  };

  const handleCardClick = async (notification: Notificationn) => {
    if (!notification.isSeen) {
      await markOneAsSeen(notification.idpK_Notification);
    }
    navigate(`/notifications/${notification.idpK_Notification}`);
  };

  return (
    <ComponentCard
      title="Notifications"
      desc="View and manage all your system notifications"
      actionButton={{
        text: "Mark All as Read",
        onClick: handleMarkAllAsRead,
      }}
    >
      <div className="mb-4 flex justify-end">
        <Switch label="Show only unread" defaultChecked={false} onChange={(checked) => setShowOnlyUnread(checked)} />
      </div>

      {notifications.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">No notifications found.</p>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification.idpK_Notification}
              onClick={() => handleCardClick(notification)}
              className={`p-4 rounded-lg shadow cursor-pointer transition-all ${
                notification.isSeen ? "bg-gray-50 dark:bg-gray-800" : "bg-blue-50 dark:bg-blue-900/10"
              }`}
            >
              <div className="flex justify-between items-center mb-1">
                <h3 className="font-medium text-gray-900 dark:text-white">{notification.title || "Notification"}</h3>
                <span className="text-xs text-gray-500">{new Date(notification.createdOn).toLocaleString()}</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">{notification.message}</p>
              <span
                className={`inline-block mt-2 text-xs px-2 py-1 rounded-full ${
                  notification.type === NotificationnType.FineIssued
                    ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                    : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                }`}
              >
                {notification.type}
              </span>
            </div>
          ))}
        </div>
      )}
    </ComponentCard>
  );
}
