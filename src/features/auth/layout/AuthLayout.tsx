import React from "react";
import { Link } from "react-router-dom";
import GridShape from "../../../components/common/GridShape";
import ThemeTogglerTwo from "../../../components/common/ThemeTogglerTwo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full bg-white dark:bg-gray-900 flex flex-col lg:flex-row">
      {/* Left Side: Form Section */}
      <div className="w-full lg:w-1/2 flex justify-center items-center overflow-y-auto px-4 py-6">
        <div className="w-full max-w-xl">{children}</div>
      </div>

      {/* Right Side: Illustration + Logo */}
      <div className="hidden lg:flex fixed right-0 top-0 h-screen w-1/2 items-center justify-center bg-brand-950 dark:bg-white/5 z-20">
        <div className="text-center px-6 z-10">
          <GridShape />
          <Link to="/" className="mb-2 text-white text-3xl sm:text-4xl font-bold tracking-wide block">
            AutoSystem
          </Link>
          <p className="text-gray-300 dark:text-white/70 text-base sm:text-lg max-w-xs sm:max-w-md mx-auto">
            Register. Inspect. Manage.
            <br />A complete portal for vehicle registration, inspections, and public safety.
          </p>
        </div>
      </div>

      {/* Theme Toggler */}
      <div className="fixed bottom-6 right-6 z-50 hidden sm:block">
        <ThemeTogglerTwo />
      </div>
    </div>
  );
}
