import { useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Gavel,
  ClipboardCheck,
  Car,
  FileText,
  Shield,
  UserCheck,
} from "lucide-react";
import { useSidebar } from "../../context/SidebarContext";
import { useAuth } from "../../hooks/useAuth";
import { HorizontaLDots } from "../../assets/icons";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path: string; 
};

const ROLES = {
  ADMIN: "Admin",
  POLICE: "Police", 
  SPECIALIST: "Specialist",
  INDIVID: "Individ", 
} as const;

const getNavItemsByRole = (role: string | undefined): NavItem[] => {
  switch (role) {
    case ROLES.ADMIN:
      return [
        {
          icon: <UserCheck size={18} />,
          name: "User Approval",
          path: "/user-approval",
        },
        {
          icon: <Car size={18} />,
          name: "Vehicle Request Approval",
          path: "/vehicle-request-approval",
        },
      ];
    case ROLES.POLICE:
      return [
        {
          icon: <FileText size={18} />,
          name: "Fine Registration",
          path: "/fine-registration",
        },
      ];
    case ROLES.SPECIALIST:
      return [
        {
          icon: <Shield size={18} />,
          name: "Inspection Approval",
          path: "/inspection-approval",
        },
      ];
    case ROLES.INDIVID:
      return [
        {
          icon: <Car size={18} />,
          name: "Vehicle Registration",
          path: "/vehicle-registration",
        },
        {
          icon: <Gavel size={18} />,
          name: "My Fines",
          path: "/my-fines",
        },
        {
          icon: <ClipboardCheck size={18} />,
          name: "My Inspections",
          path: "/my-inspections",
        },
      ];
    default:
      return [];
  }
};

const AppSidebar = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const location = useLocation();
  const { user, loading } = useAuth(); 

  const role = user?.role;
  const navItems = getNavItemsByRole(role);
  
  const isActive = useCallback(
    (path: string) => location.pathname === path,
    [location.pathname]
  );

  if (loading) {
    return (
      <aside className="fixed mt-16 lg:mt-0 top-0 left-0 w-[90px] h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 z-50">
        <div className="p-4 text-gray-400 animate-pulse">Loading sidebar...</div>
      </aside>
    );
  }


  if (!role) {
    return (
      <aside className="fixed mt-16 lg:mt-0 top-0 left-0 w-[90px] h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 z-50">
        <div className="p-4 text-red-500">Unauthorized</div>
      </aside>
    );
  }

  const renderMenuItems = (items: NavItem[]) => (
    <ul className="flex flex-col gap-2"> {/* Reduced gap for better spacing */}
      {items.map((item) => (
        <li key={item.name}>
          <Link
            to={item.path}
            className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 group
              ${
                isActive(item.path)
                  ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 border border-blue-200 dark:border-blue-800"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
              }`}
          >
            <span className="w-5 h-5 flex items-center justify-center flex-shrink-0">
              {item.icon}
            </span>
            {(isExpanded || isHovered || isMobileOpen) && (
              <span className="font-medium text-sm whitespace-nowrap overflow-hidden text-ellipsis">
                {item.name}
              </span>
            )}
          </Link>
        </li>
      ))}
    </ul>
  );

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200
        ${isExpanded || isMobileOpen ? "w-[290px]" : isHovered ? "w-[290px]" : "w-[90px]"}
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Logo Section */}
      <div className={`py-8 flex ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"}`}>
        <Link to="/" className="flex items-center">
          {isExpanded || isHovered || isMobileOpen ? (
            <>
              <div className="dark:hidden">
                <span className="text-3xl font-bold tracking-wide">
                  <span className="text-blue-600">Auto</span>
                  <span className="text-gray-800">System</span>
                </span>
              </div>
              <div className="hidden dark:block">
                <span className="text-3xl font-bold tracking-wide">
                  <span className="text-blue-400">Auto</span>
                  <span className="text-white">System</span>
                </span>
              </div>
            </>
          ) : (
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-800 dark:from-blue-400 dark:to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">A</span>
            </div>
          )}
        </Link>
      </div>

      {/* Navigation Section */}
      <div className="flex flex-col flex-1 overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2 className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 font-semibold ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"}`}>
                {isExpanded || isHovered || isMobileOpen ? "Menu" : <HorizontaLDots className="size-6" />}
              </h2>
              {navItems.length > 0 ? (
                renderMenuItems(navItems)
              ) : (
                <div className="text-gray-400 text-sm p-3">
                  No menu items available
                </div>
              )}
            </div>
          </div>
        </nav>
      </div>

      {/* User Info Section (Optional) */}
      {(isExpanded || isHovered || isMobileOpen) && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Role: <span className="font-medium text-gray-700 dark:text-gray-300">{role}</span>
          </div>
        </div>
      )}
    </aside>
  );
};

export default AppSidebar;