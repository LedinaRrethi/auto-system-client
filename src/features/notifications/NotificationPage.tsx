import { useEffect, useState } from "react";
import { Bell, CheckCircle, FileText, AlertTriangle, Mail, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import Alert from "../../components/ui/alert/Alert";
import Button from "../../components/ui/button/Button";
import Switch from "../../components/form/switch/Switch";
import { getAllNotifications, getUnseenNotifications, markAllAsSeen, markOneAsSeen } from "../../services/notificationService";
import { Notificationn, NotificationnType } from "../../types/Notification/Notificationn";

export default function NotificationPage() {
  const [notifications, setNotifications] = useState<Notificationn[]>([]);
  const [showOnlyUnread, setShowOnlyUnread] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const navigate = useNavigate();

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = showOnlyUnread ? await getUnseenNotifications() : await getAllNotifications();
      setNotifications(data);
    } catch {
      setErrorMsg("Failed to load notifications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [showOnlyUnread]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSuccessMsg(null);
      setErrorMsg(null);
    }, 3000);
    return () => clearTimeout(timer);
  }, [successMsg, errorMsg]);

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsSeen();
      setSuccessMsg("All notifications marked as read.");
      fetchData();
    } catch {
      setErrorMsg("Failed to mark all as read.");
    }
  };

  const handleCardClick = async (notification: Notificationn) => {
    try {
      if (!notification.isSeen) {
        await markOneAsSeen(notification.idpK_Notification);
      }
      navigate(`/notifications/${notification.idpK_Notification}`);
    } catch {
      setErrorMsg("Failed to update notification status.");
    }
  };

  const getNotificationIcon = (type: NotificationnType) => {
    switch (type) {
      case NotificationnType.FineIssued:
        return <AlertTriangle size={18} className="text-red-500" />;
      case NotificationnType.InspectionResult:
        return <CheckCircle size={18} className="text-green-500" />;
      case NotificationnType.General:
      default:
        return <FileText size={18} className="text-blue-500" />;
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
    <>
      <PageMeta title="Notifications | AutoSystem" description="Manage and view your notifications." />
      <PageBreadcrumb pageTitle="Notifications" />

      <div className="space-y-6">
        {successMsg && <Alert variant="success" title="Success" message={successMsg} />}
        {errorMsg && <Alert variant="error" title="Error" message={errorMsg} />}

        <ComponentCard
          title="Notifications"
          desc="View and manage all your system notifications."
          actionButton={{
            text: "Mark All as Read",
            onClick: handleMarkAllAsRead,
          }}
        >
          <div className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {notifications.length} notification{notifications.length !== 1 ? "s" : ""}
              </span>
              {!showOnlyUnread && (
                <span className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 px-2 py-1 rounded-full ml-2">
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
                {showOnlyUnread ? "You're all caught up!" : "New notifications will appear here."}
              </p>
              <div className="mt-4">
                <Button onClick={() => navigate("/")} className="bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600">
                  Back to Home
                </Button>
              </div>
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
                    <span className="text-xs text-gray-500">
                      {new Date(notification.createdOn).toLocaleString()}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 dark:text-gray-300">{notification.message ?? ""}</p>

                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <span className={`inline-block text-xs px-2 py-1 rounded-full ${getNotificationColor(notification.type)}`}>
                      {notification.type}
                    </span>

                    <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
                      notification.isSeen
                        ? "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                        : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                    }`}>
                      {notification.isSeen ? <Eye size={14} /> : <Mail size={14} />}
                      {notification.isSeen ? "Read" : "Unread"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ComponentCard>
      </div>
    </>
  );
}
