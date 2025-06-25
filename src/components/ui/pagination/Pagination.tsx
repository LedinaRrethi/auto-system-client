import { HiChevronLeft, HiChevronRight } from "react-icons/hi";

interface PaginationProps {
  currentPage: number;
  hasNextPage: boolean;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  hasNextPage,
  onPageChange,
}: PaginationProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 gap-4">
      {/* Show current page */}
      <div className="text-sm text-gray-600 dark:text-gray-300">
        Page <span className="font-medium">{currentPage}</span>
      </div>

      <div className="inline-flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
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
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!hasNextPage}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium border flex items-center gap-1 transition-colors duration-200 ${
            !hasNextPage
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
