import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, CheckCircle, AlertTriangle, X } from "lucide-react";

import {
  getUnseenNotifications,
  markOneAsSeen,
  countUnseenNotifications,
} from "../../services/notificationService";
import {
  Notificationn,
  NotificationnType,
} from "../../types/Notification/Notificationn";

import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { useNotificationHub } from "../../hooks/useNotificationHub";

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notificationn[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const navigate = useNavigate();

  const token = sessionStorage.getItem("authToken");

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const unseen = await getUnseenNotifications();
      const count = await countUnseenNotifications();
      setNotifications(unseen.slice(0, 6));
      setUnreadCount(count);
    } catch (error) {
      console.error("Failed to load notifications:", error);
    }
  };

  useNotificationHub(token, () => {
    fetchNotifications();
  });

  const handleNotificationClick = async (notification: Notificationn) => {
    try {
      if (!notification.isSeen) {
        await markOneAsSeen(notification.idpK_Notification);
        setNotifications((prev) =>
          prev.filter(
            (n) => n.idpK_Notification !== notification.idpK_Notification
          )
        );
        setUnreadCount((prev) => Math.max(prev - 1, 0));
      }

      setIsOpen(false);
      navigate(`/notifications/${notification.idpK_Notification}`);
    } catch (error) {
      console.error("Failed to mark notification as seen", error);
    }
  };

  const handleViewAll = () => {
    setIsOpen(false);
    navigate("/notifications");
  };

  const getNotificationIcon = (type: NotificationnType) => {
    switch (type) {
      case NotificationnType.FineIssued:
        return { icon: AlertTriangle, color: "bg-red-500" };
      case NotificationnType.InspectionResult:
        return { icon: CheckCircle, color: "bg-green-500" };
      default:
        return { icon: CheckCircle, color: "bg-gray-400" };
    }
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diff = Math.floor((now.getTime() - date.getTime()) / 60000);
    if (diff < 1) return "Just now";
    if (diff < 60) return `${diff}m ago`;
    const hours = Math.floor(diff / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const formatCount = (count: number) => (count > 99 ? "99+" : count);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex items-center justify-center h-11 w-11 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-700 dark:hover:text-white transition"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex items-center justify-center text-[10px] font-bold text-white bg-red-500 rounded-full min-w-[20px] h-5 px-1 shadow-lg">
            {formatCount(unreadCount)}
          </span>
        )}
      </button>

      <Dropdown
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        className="absolute right-0 mt-3 w-80 sm:w-96 flex flex-col rounded-2xl border border-gray-200 bg-white dark:bg-gray-800 p-3 shadow-xl z-50"
      >
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-100 dark:border-gray-700">
          <h5 className="text-sm font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
            <Bell size={16} /> Notifications
            {unreadCount > 0 && (
              <span className="text-xs bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 px-2 py-1 rounded-full">
                {formatCount(unreadCount)} new
              </span>
            )}
          </h5>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white p-1 rounded-full"
          >
            <X size={16} />
          </button>
        </div>

        <ul className="flex flex-col overflow-y-auto max-h-80 custom-scrollbar">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400 text-sm">
              No new notifications
            </div>
          ) : (
            notifications.map((notification) => {
              const { icon: Icon, color } = getNotificationIcon(
                notification.type
              );
              return (
                <DropdownItem
                  key={notification.idpK_Notification}
                  onItemClick={() => handleNotificationClick(notification)}
                  className="flex gap-3 items-start rounded-lg p-3 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <span
                    className={`flex items-center justify-center w-8 h-8 rounded-full ${color}`}
                  >
                    <Icon size={14} className="text-white" />
                  </span>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 dark:text-white truncate max-w-[200px]">
                      {notification.title || "Notification"}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[200px]">
                      {notification.message || "No message"}
                    </p>

                    <div className="flex items-center justify-between mt-1 text-[10px] text-gray-400 dark:text-gray-500">
                      <span>{getTimeAgo(notification.createdOn)}</span>
                      {/* {!notification.isSeen && <span className="w-2 h-2 bg-blue-500 rounded-full"></span>} */}
                    </div>
                  </div>
                </DropdownItem>
              );
            })
          )}
        </ul>

        {notifications.length > 0 && (
          <button
            onClick={handleViewAll}
            className="mt-3 w-full text-sm font-medium text-blue-600 dark:text-blue-400 border border-gray-200 dark:border-gray-700 rounded-lg py-2 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            View All Notifications
          </button>
        )}
      </Dropdown>
    </div>
  );
}
