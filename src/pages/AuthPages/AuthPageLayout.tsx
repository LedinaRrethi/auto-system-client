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
    <div className="relative w-full h-screen bg-white dark:bg-gray-900">
      <div className="flex h-full flex-col lg:flex-row">
        {/* Left Side: Form Section (scrolls internally if needed, but fits screen) */}
        <div className="flex flex-col justify-center w-full lg:w-1/2 p-6 sm:p-10">
          <div className="w-full max-w-xl mx-auto overflow-y-auto max-h-[calc(100vh-40px)]">
            {children}
          </div>
        </div>

        {/* Right Side: Logo + Illustration */}
        <div className="hidden lg:flex items-center justify-center w-1/2 bg-brand-950 dark:bg-white/5 relative">
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

        <div className="fixed bottom-6 right-6 z-50 hidden sm:block">
          <ThemeTogglerTwo />
        </div>
      </div>
    </div>
  );
}

