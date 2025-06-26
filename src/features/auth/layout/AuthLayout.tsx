import React from "react";
import { Car, ClipboardList, FileText } from "lucide-react";
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
      <div className="hidden lg:flex fixed right-0 top-0 h-screen w-1/2 items-center justify-center bg-slate-900 dark:bg-gray-900 z-20">
        <div className="text-center px-8 z-10 max-w-lg">
          <div className="mb-8">
            <GridShape />
          </div>
          
          {/* AutoSystem Logo */}
          <div className="mb-6">
            <div className="dark:hidden">
              <h1 className="text-4xl sm:text-5xl font-bold tracking-wide leading-tight">
                <span className="text-blue-400">Auto</span>
                <span className="text-white">System</span>
              </h1>
            </div>
            <div className="hidden dark:block">
              <h1 className="text-4xl sm:text-5xl font-bold tracking-wide leading-tight">
                <span className="text-blue-400">Auto</span>
                <span className="text-white">System</span>
              </h1>
            </div>
          </div>
          
          {/* DPSHTRR Official Description */}
          <div className="space-y-4 mb-8">
            <p className="text-blue-200 text-lg font-semibold">
              DPSHTRR Official Portal
            </p>
            <p className="text-gray-300 dark:text-gray-400 text-base leading-relaxed">
              Comprehensive vehicle management system for registration, technical inspections, and traffic violations in Albania.
            </p>
          </div>
          
          {/* Service Categories */}
          <div className="grid grid-cols-1 gap-3 text-left max-w-sm mx-auto">
            <div className="flex items-center space-x-3 p-3 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <Car className="w-4 h-4 text-white" />
              </div>
              <span className="text-white text-sm font-medium">Vehicle Registration</span>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <ClipboardList className="w-4 h-4 text-white" />
              </div>
              <span className="text-white text-sm font-medium">Technical Inspections</span>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <FileText className="w-4 h-4 text-white" />
              </div>
              <span className="text-white text-sm font-medium">Traffic Fines Management</span>
            </div>
          </div>
          
          {/* Official Footer */}
          <div className="mt-8 pt-4 border-t border-gray-700">
            <p className="text-xs text-gray-400">
              Official Government Portal - Republic of Albania
            </p>
          </div>
        </div>
      </div>

      {/* Theme Toggler */}
      <div className="fixed bottom-6 right-6 z-50 hidden sm:block">
        <ThemeTogglerTwo />
      </div>
    </div>
  );
}
