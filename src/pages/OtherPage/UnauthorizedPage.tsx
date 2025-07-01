// import React from 'react';
// import { ArrowLeft, Mail, Phone, Shield } from "lucide-react";
// import PageMeta from '../../components/common/PageMeta';
// import GridShape from '../../components/common/GridShape';

// const UnauthorizedPage: React.FC = () => {
//   const handleGoBack = () => {
//     window.history.back();
//   };

//   const handleContactSupport = () => {
//     window.location.href = "mailto:support@company.com";
//   };

//   return (
//     <>
//       <PageMeta
//         title="React.js 401 Unauthorized | TailAdmin - React.js Admin Dashboard Template"
//         description="This is React.js 401 Unauthorized page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
//       />
//       <div className="relative flex flex-col items-center justify-center min-h-screen p-6 overflow-hidden z-1">
//         <GridShape />
//         <div className="mx-auto w-full max-w-[242px] text-center sm:max-w-[472px]">
//           <h1 className="mb-8 font-bold text-gray-800 text-title-md dark:text-white/90 xl:text-title-2xl">
//             ERROR 401
//           </h1>

//           {/* Icon replacing the SVG image */}
//           <div className="mx-auto w-32 h-32 bg-red-100 rounded-full flex items-center justify-center mb-8 dark:bg-red-900/20">
//             <Shield className="w-16 h-16 text-red-600 dark:text-red-400" />
//           </div>

//           <p className="mt-10 mb-6 text-base text-gray-700 dark:text-gray-400 sm:text-lg">
//             You don't have permission to access this resource. Please contact your administrator or sign in with appropriate credentials.
//           </p>

//           <div className="space-y-3">
//             <button
//               onClick={handleGoBack}
//               className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-5 py-3.5 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 w-full sm
