import GridShape from "../../components/common/GridShape";
import { Link } from "react-router-dom";
import PageMeta from "../../components/common/PageMeta";
import { Shield, ShieldX, Lock } from "lucide-react";

export default function Unauthorized() {
  return (
    <>
      <PageMeta
        title="Unauthorized Access | AutoSystem - Vehicle Management System"
        description="Unauthorized access page for AutoSystem - You don't have permission to access this resource"
      />
      <div className="relative flex flex-col items-center justify-center min-h-screen p-6 overflow-hidden z-1">
        <GridShape />
        <div className="mx-auto w-full max-w-[242px] text-center sm:max-w-[472px]">
          <h1 className="mb-8 font-bold text-gray-800 text-title-md dark:text-white/90 xl:text-title-2xl">
            UNAUTHORIZED
          </h1>

          {/* Icon Section */}
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div className="w-32 h-32 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                <ShieldX size={64} className="text-red-500 dark:text-red-400" />
              </div>
              <div className="absolute -top-2 -right-2 w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center">
                <Lock size={24} className="text-orange-500 dark:text-orange-400" />
              </div>
            </div>
          </div>

          <p className="mt-10 mb-6 text-base text-gray-700 dark:text-gray-400 sm:text-lg">
            Sorry, you don't have permission to access this resource. Please contact your administrator or try logging in with appropriate credentials.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
               
            <Link
              to="/signin"
              className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-3.5 text-sm font-medium text-white shadow-theme-xs hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors"
            >
              <Shield size={16} className="mr-2" />
              Login with Different Account
            </Link>
          </div>
        </div>
        
        {/* Footer */}
        <p className="absolute text-sm text-center text-gray-500 -translate-x-1/2 bottom-6 left-1/2 dark:text-gray-400">
          &copy; {new Date().getFullYear()} - AutoSystem
        </p>
      </div>
    </>
  );
}