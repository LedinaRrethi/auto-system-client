// src/components/common/ComponentCard.tsx
import React from "react";

interface ComponentCardProps {
  title: string;
  desc?: string;
  children: React.ReactNode;
  actionButton?: {
    text: string;
    onClick: () => void;
  };
}

export default function ComponentCard({ title, desc, children, actionButton }: ComponentCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{title}</h3>
          {desc && <p className="text-sm text-gray-500 dark:text-gray-300">{desc}</p>}
        </div>
        {actionButton && (
          <button
            onClick={actionButton.onClick}
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
          >
            {actionButton.text}
          </button>
        )}
      </div>
      <div>{children}</div>
    </div>
  );
}
