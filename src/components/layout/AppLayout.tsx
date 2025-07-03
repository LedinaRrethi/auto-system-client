import { SidebarProvider, useSidebar } from "../../context/SidebarContext";
import { Outlet } from "react-router";
import AppHeader from "./AppHeader";
import Backdrop from "./Backdrop";
import AppSidebar from "./AppSidebar";
import { useNotificationHub } from "../../hooks/useNotificationHub";
import { useAuth } from "../../hooks/useAuth";
import toast from "react-hot-toast";
import { X } from "lucide-react";

const LayoutContent = () => {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();
  const { token, loading } = useAuth();

  useNotificationHub(token, (notification) => {
    toast.custom((t) => (
      <div
        className="bg-orange-50 border border-orange-200 shadow-lg rounded-md p-4 mb-3 pr-6 max-w-sm w-full flex justify-between items-start"
        role="alert"
      >
        <div className="flex flex-col">
          <p className="font-semibold text-orange-800">{notification.title}</p>
          <p className="text-sm text-orange-700 mt-1">{notification.message}</p>
        </div>
        <button
          onClick={() => toast.remove(t.id)} 
          className="ml-4 text-orange-400 hover:text-orange-800 transition"
        >
          <X size={18} />
        </button>
      </div>
    ), {
      duration: 8000,
      position: "bottom-right",
      id: notification.id || undefined,
    });
  });

  if (loading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen xl:flex">
      <div>
        <AppSidebar />
        <Backdrop />
      </div>

      <div
        className={`flex-1 transition-all duration-300 ease-in-out ${
          isExpanded || isHovered ? "lg:ml-[290px]" : "lg:ml-[90px]"
        } ${isMobileOpen ? "ml-0" : ""}`}
      >
        <AppHeader />
        <div className="p-4 mx-auto max-w-[--breakpoint-2xl] md:p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

const AppLayout = () => {
  return (
    <SidebarProvider>
      <LayoutContent />
    </SidebarProvider>
  );
};

export default AppLayout;
