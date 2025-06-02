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
    <div className="w-full h-screen bg-white dark:bg-gray-900">
      <div className="flex h-full w-full flex-col lg:flex-row">
        {/* Left Side: Form Section */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center items-center px-6 sm:px-8 overflow-y-auto no-scrollbar">
          <div className="w-full max-w-xl py-10">{children}</div>
        </div>

        {/* Right Side: Logo + Illustration */}
        <div className="hidden lg:flex w-1/2 items-center justify-center bg-brand-950 dark:bg-white/5 relative">
          <div className="text-center px-6 z-10">
            <GridShape />
            <Link
              to="/"
              className="mb-2 text-white text-3xl sm:text-4xl font-bold tracking-wide block"
            >
              AutoSystem
            </Link>
            <p className="text-gray-300 dark:text-white/70 text-base sm:text-lg max-w-xs sm:max-w-md mx-auto">
              Register. Inspect. Manage.
              <br />
              A complete portal for vehicle registration, inspections, and public safety.
            </p>
          </div>
        </div>

        {/* Theme Toggler */}
        <div className="fixed bottom-6 right-6 z-50 hidden sm:block">
          <ThemeTogglerTwo />
        </div>
      </div>
    </div>
  );
}

