import { useEffect, useState } from "react";
import { Bell, CheckCircle, FileText, AlertTriangle } from "lucide-react";
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
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = showOnlyUnread ? await getUnseenNotifications() : await getAllNotifications();
      setNotifications(data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [showOnlyUnread]);

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsSeen();
      fetchData();
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  const handleCardClick = async (notification: Notificationn) => {
    try {
      if (!notification.isSeen) {
        await markOneAsSeen(notification.idpK_Notification);
      }
      navigate(`/notifications/${notification.idpK_Notification}`);
    } catch (error) {
      console.error("Error handling notification click:", error);
    }
  };

  const getNotificationIcon = (type: NotificationnType) => {
    switch (type) {
      case NotificationnType.FineIssued:
        return <AlertTriangle size={20} className="text-red-500" />;
      case NotificationnType.InspectionResult:
        return <CheckCircle size={20} className="text-green-500" />;
      case NotificationnType.General:
      default:
        return <FileText size={20} className="text-blue-500" />;
    }
  };

  const getNotificationColor = (type: NotificationnType) => {
    switch (type) {
      case NotificationnType.FineIssued:
        return "text-red-600 bg-red-50 dark:bg-red-900/20";
      case NotificationnType.InspectionResult:
        return "text-green-600 bg-green-50 dark:bg-green-900/20";
      case NotificationnType.General:
      default:
        return "text-blue-600 bg-blue-50 dark:bg-blue-900/20";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <ComponentCard
          title="Notifications"
          desc="View and manage all your system notifications"
          actionButton={{
            text: "Mark All as Read",
            onClick: handleMarkAllAsRead,
          }}
        >
          <div className="mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {notifications.length} notification{notifications.length !== 1 ? "s" : ""}
              </span>
              {!showOnlyUnread && (
                <span className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 px-2 py-1 rounded-full">
                  {notifications.filter((n) => !n.isSeen).length} unread
                </span>
              )}
            </div>
            <Switch
              label="Show only unread"
              defaultChecked={false}
              onChange={(checked) => setShowOnlyUnread(checked)}
            />
          </div>

          {loading ? (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">Loading...</div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-12">
              <Bell size={48} className="mx-auto text-gray-400 dark:text-gray-500 mb-4" />
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                {showOnlyUnread ? "No unread notifications" : "No notifications found"}
              </p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                {showOnlyUnread ? "All caught up!" : "You'll see new notifications here when they arrive"}
              </p>
            </div>
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
                    <h3 className="flex items-center gap-2 font-medium text-gray-900 dark:text-white">
                      {getNotificationIcon(notification.type)}
                      {notification.title || "Notification"}
                    </h3>
                    <span className="text-xs text-gray-500">{new Date(notification.createdOn).toLocaleString()}</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{notification.message ?? ""}</p>
                  <span
                    className={`inline-block mt-2 text-xs px-2 py-1 rounded-full ${getNotificationColor(
                      notification.type
                    )}`}
                  >
                    {notification.type}
                  </span>
                </div>
              ))}
            </div>
          )}
        </ComponentCard>
      </div>
    </div>
  );
}
