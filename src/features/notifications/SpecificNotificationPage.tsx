import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { getAllNotifications, markOneAsSeen } from "../../services/notificationService";
import { Notificationn, NotificationnType } from "../../types/Notification/Notificationn";
import { AlertTriangle, CheckCircle, FileText, CalendarDays, Clock, Eye, Mail } from "lucide-react";
import Alert from "../../components/ui/alert/Alert";

export default function SpecificNotificationPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [notification, setNotification] = useState<Notificationn | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNotification = async () => {
      if (!id) {
        setError("No notification ID provided.");
        setLoading(false);
        return;
      }

      try {
        const all = await getAllNotifications();
        const found = all.find((n) => n.idpK_Notification === id);

        if (!found) {
          setError("Notification not found.");
        } else {
          setNotification(found);
          if (!found.isSeen) {
            await markOneAsSeen(found.idpK_Notification);
            setNotification({ ...found, isSeen: true });
          }
        }
      } catch {
        setError("Failed to load notification.");
      } finally {
        setLoading(false);
      }
    };

    fetchNotification();
  }, [id]);

  const getIcon = (type: NotificationnType) => {
    switch (type) {
      case NotificationnType.FineIssued:
        return <AlertTriangle size={24} className="text-red-500" />;
      case NotificationnType.InspectionResult:
        return <CheckCircle size={24} className="text-green-500" />;
      default:
        return <FileText size={24} className="text-blue-500" />;
    }
  };

  const getColors = (type: NotificationnType) => {
    switch (type) {
      case NotificationnType.FineIssued:
        return { bg: "bg-red-50 dark:bg-red-900/10", badge: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300" };
      case NotificationnType.InspectionResult:
        return { bg: "bg-green-50 dark:bg-green-900/10", badge: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" };
      default:
        return { bg: "bg-blue-50 dark:bg-blue-900/10", badge: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300" };
    }
  };

  const formatDateTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return {
      date: date.toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" }),
      time: date.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" }),
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <>
      <PageMeta title="Notification Details | AutoSystem" description="Detailed view of your notification." />
      <PageBreadcrumb pageTitle="Notification Details" />

      <div className="space-y-6">
        {error && <Alert variant="error" title="Error" message={error} />}

        {!error && notification && (
          <ComponentCard
            title="Notification Details"
            desc="View detailed information about this notification."
            actionButton={{
              text: "← Back to Notifications",
              onClick: () => navigate("/notifications"),
            }}
          >
            <div className="space-y-6">
              <div className={`p-6 rounded-xl border ${getColors(notification.type).bg}`}>
                <div className="flex items-start gap-4">
                  <div>{getIcon(notification.type)}</div>
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-2">
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {notification.title || "Notification"}
                      </h2>
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getColors(notification.type).badge}`}>
                          {notification.type}
                        </span>
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm ${
                          notification.isSeen
                            ? "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                            : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                        }`}>
                          {notification.isSeen ? <Eye size={14} /> : <Mail size={14} />}
                          {notification.isSeen ? "Read" : "Unread"}
                        </span>
                      </div>
                    </div>

                    <p className="text-gray-600 dark:text-gray-300 mb-3">{notification.message}</p>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <CalendarDays size={16} /> {formatDateTime(notification.createdOn).date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={16} /> {formatDateTime(notification.createdOn).time}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
                <div className="flex flex-wrap gap-3">
                  <ActionButton text="← Back to Notifications" onClick={() => navigate("/notifications")} />
                  {notification.type === NotificationnType.FineIssued && (
                    <ActionButton text="View My Fines" color="red" onClick={() => navigate("/my-fines")} />
                  )}
                  {notification.type === NotificationnType.InspectionResult && (
                    <ActionButton text="View My Inspections" color="green" onClick={() => navigate("/my-inspections")} />
                  )}
                </div>
              </div>
            </div>
          </ComponentCard>
        )}
      </div>
    </>
  );
}

const ActionButton = ({ text, onClick, color = "gray" }: { text: string; onClick: () => void; color?: string }) => {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center px-4 py-2 border border-${color}-300 dark:border-${color}-600 rounded-lg text-sm font-medium text-${color}-700 dark:text-${color}-300 bg-${color}-50 dark:bg-${color}-900/20 hover:bg-${color}-100 dark:hover:bg-${color}-900/30 transition-colors`}
    >
      {text}
    </button>
  );
};
