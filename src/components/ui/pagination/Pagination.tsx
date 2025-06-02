import { HiChevronLeft, HiChevronRight } from "react-icons/hi";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  startIndex: number;
  endIndex: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 gap-4">
      {/* Showing info */}
      <div className="text-sm text-gray-600 dark:text-gray-300">
        Showing <span className="font-medium">{currentPage}</span> of <span className="font-medium">{totalPages}</span> pages
      </div>

      {/* Navigation buttons */}
      <div className="inline-flex items-center gap-2">
        <button
          onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium border flex items-center gap-1 transition-colors duration-200 ${
            currentPage === 1
              ? "bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed dark:bg-gray-800 dark:border-gray-700"
              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100 dark:bg-gray-800 dark:text-white dark:hover:bg-white/[0.05]"
          }`}
        >
          <HiChevronLeft /> Previous
        </button>

        <button
          onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage === totalPages}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium border flex items-center gap-1 transition-colors duration-200 ${
            currentPage === totalPages
              ? "bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed dark:bg-gray-800 dark:border-gray-700"
              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100 dark:bg-gray-800 dark:text-white dark:hover:bg-white/[0.05]"
          }`}
        >
          Next <HiChevronRight />
        </button>
      </div>
    </div>
  );
}
