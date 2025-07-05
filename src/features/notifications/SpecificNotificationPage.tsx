import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ComponentCard from "../../components/common/ComponentCard";
import { getAllNotifications, markOneAsSeen } from "../../services/notificationService";
import { Notificationn, NotificationnType } from "../../types/Notification/Notificationn";
import { AlertTriangle, CheckCircle, FileText, CalendarDays, Clock, Eye, Mail } from "lucide-react";

export default function SpecificNotificationPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [notification, setNotification] = useState<Notificationn | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNotification = async () => {
      if (!id) {
        setError("No notification ID provided");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const allNotifications = await getAllNotifications();
        const foundNotification = allNotifications.find((n) => n.idpK_Notification === id);

        if (!foundNotification) {
          setError("Notification not found");
          setLoading(false);
          return;
        }

        setNotification(foundNotification);

        if (!foundNotification.isSeen) {
          await markOneAsSeen(foundNotification.idpK_Notification);
          setNotification((prev) => (prev ? { ...prev, isSeen: true } : null));
        }
      } catch (err) {
        setError("Failed to load notification");
        console.error("Error fetching notification:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotification();
  }, [id]);

  const getNotificationIcon = (type: NotificationnType) => {
    switch (type) {
      case NotificationnType.FineIssued:
        return <AlertTriangle size={24} className="text-red-500" />;
      case NotificationnType.InspectionResult:
        return <CheckCircle size={24} className="text-green-500" />;
      case NotificationnType.General:
      default:
        return <FileText size={24} className="text-blue-500" />;
    }
  };

  const getNotificationColor = (type: NotificationnType) => {
    switch (type) {
      case NotificationnType.FineIssued:
        return {
          bg: "bg-red-50 dark:bg-red-900/10",
          border: "border-red-200 dark:border-red-800",
          badge: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
        };
      case NotificationnType.InspectionResult:
        return {
          bg: "bg-green-50 dark:bg-green-900/10",
          border: "border-green-200 dark:border-green-800",
          badge: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
        };
      case NotificationnType.General:
      default:
        return {
          bg: "bg-blue-50 dark:bg-blue-900/10",
          border: "border-blue-200 dark:border-blue-800",
          badge: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
        };
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      time: date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !notification) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-4xl mx-auto">
          <ComponentCard
            title="Error"
            desc="Unable to load notification"
            actionButton={{
              text: "← Back to Notifications",
              onClick: () => navigate("/notifications"),
            }}
          >
            <div className="text-center py-12">
              <AlertTriangle size={48} className="text-red-500 mb-4 mx-auto" />
              <p className="text-gray-500 dark:text-gray-400 text-lg">{error || "Notification not found"}</p>
            </div>
          </ComponentCard>
        </div>
      </div>
    );
  }

  const colors = getNotificationColor(notification.type);
  const { date, time } = formatDate(notification.createdOn);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        <ComponentCard
          title="Notification Details"
          desc="View detailed information about this notification"
          actionButton={{
            text: "← Back to Notifications",
            onClick: () => navigate("/notifications"),
          }}
        >
          <div className="space-y-6">
            {/* Header */}
            <div className={`p-6 rounded-xl border-2 ${colors.bg} ${colors.border}`}>
              <div className="flex items-start gap-4">
                <div>{getNotificationIcon(notification.type)}</div>
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-2">
                    <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {notification.title || "Notification"}
                    </h1>
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${colors.badge}`}
                      >
                        {notification.type}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm ${
                          notification.isSeen
                            ? "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                            : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                        }`}
                      >
                        {notification.isSeen ? <Eye size={14} /> : <Mail size={14} />}
                        {notification.isSeen ? "Read" : "Unread"}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-3">{notification.message}</p>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <CalendarDays size={16} /> {date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={16} /> {time}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Notification Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Detail label="Notification ID" value={`#${notification.idpK_Notification}`} />
                <Detail label="Type" value={notification.type} />
                <Detail label="Status" value={notification.isSeen ? "Read" : "Unread"} />
                <Detail label="Created" value={new Date(notification.createdOn).toLocaleString()} />
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
              <div className="flex flex-wrap gap-3">
                <ActionButton text="← Back to All Notifications" onClick={() => navigate("/notifications")} />
                {notification.type === NotificationnType.FineIssued && (
                  <ActionButton text="View My Fines" color="red" onClick={() => navigate("/my-fines")} />
                )}
                {notification.type === NotificationnType.InspectionResult && (
                  <ActionButton text="View My Inspections" color="green" onClick={() => navigate("/my-inspections")} />
                )}
                {notification.type === NotificationnType.General && (
                  <ActionButton text="Go to Dashboard" color="blue" onClick={() => navigate("/dashboard")} />
                )}
              </div>
            </div>
          </div>
        </ComponentCard>
      </div>
    </div>
  );
}

const Detail = ({ label, value }: { label: string; value: string }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
    <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 p-2 rounded">{value}</p>
  </div>
);

const ActionButton = ({ text, onClick, color = "gray" }: { text: string; onClick: () => void; color?: string }) => {
  const border = `border-${color}-300 dark:border-${color}-600`;
  const textColor = `text-${color}-700 dark:text-${color}-300`;
  const bg = `bg-${color}-50 dark:bg-${color}-900/20`;
  const hover = `hover:bg-${color}-100 dark:hover:bg-${color}-900/30`;
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center px-4 py-2 border ${border} rounded-lg text-sm font-medium ${textColor} ${bg} ${hover} transition-colors`}
    >
      {text}
    </button>
  );
};
