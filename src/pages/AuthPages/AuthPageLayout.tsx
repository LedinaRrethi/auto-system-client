import React from "react";
import GridShape from "../../components/common/GridShape";
import { Link } from "react-router-dom";
import ThemeTogglerTwo from "../../components/common/ThemeTogglerTwo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative p-6 bg-white z-1 dark:bg-gray-900 sm:p-0">
      <div className="relative flex flex-col justify-center w-full h-screen lg:flex-row dark:bg-gray-900 sm:p-0">
        {children}
        <div className="items-center hidden w-full h-full lg:w-1/2 bg-brand-950 dark:bg-white/5 lg:grid">
          <div className="relative flex items-center justify-center z-1">
            {/* <!-- ===== Common Grid Shape Start ===== --> */}
            <GridShape />

      
            <div className="flex flex-col items-center text-center px-4">
              <Link
                to="/"
                className="mb-2 text-white text-3xl sm:text-4xl font-bold tracking-wide"
              >
                AutoSystem
              </Link>
              <p className="text-gray-300 dark:text-white/70 text-base sm:text-lg max-w-xs sm:max-w-md">
                Register. Inspect. Manage.<br />
                A complete portal for vehicle registration, inspections, and public safety.
              </p>
            </div>

          </div>
        </div>
        <div className="fixed z-50 hidden bottom-6 right-6 sm:block">
          <ThemeTogglerTwo />
        </div>
      </div>
    </div>
  );
}
