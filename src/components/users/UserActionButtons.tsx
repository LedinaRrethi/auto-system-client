// File: components/UserActionButtons.tsx
import { HiCheck, HiX } from "react-icons/hi";
import { User } from "../../types/User";

interface Props {
  user: User;
  onAction: (id: string, action: "approve" | "reject" | "deactivate") => void;
}

export default function UserActionButtons({ user, onAction }: Props) {
  const baseButtonClass =
    "flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200 hover:scale-105";

  switch (user.status) {
    case "Pending":
      return (
        <>
          <button
            title="Approve User"
            onClick={() => onAction(user.id, "approve")}
            className={`${baseButtonClass} bg-green-100 text-green-600 hover:bg-green-200 hover:text-green-700 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-800/50`}
          >
            <HiCheck className="w-4 h-4" />
          </button>
          <button
            title="Reject User"
            onClick={() => onAction(user.id, "reject")}
            className={`${baseButtonClass} bg-red-100 text-red-600 hover:bg-red-200 hover:text-red-700 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-800/50`}
          >
            <HiX className="w-4 h-4" />
          </button>
        </>
      );
    case "Approved":
      return (
        <>
          <button
            title="User is Active"
            disabled
            className={`${baseButtonClass} bg-green-50 text-green-400 cursor-not-allowed dark:bg-green-900/20 dark:text-green-600`}
          >
            <HiCheck className="w-4 h-4" />
          </button>
          <button
            title="Deactivate User"
            onClick={() => onAction(user.id, "deactivate")}
            className={`${baseButtonClass} bg-red-100 text-red-600 hover:bg-red-200 hover:text-red-700 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-800/50`}
          >
            <HiX className="w-4 h-4" />
          </button>
        </>
      );
    case "Rejected":
      return (
        <>
          <button
            title="Approve User"
            onClick={() => onAction(user.id, "approve")}
            className={`${baseButtonClass} bg-green-100 text-green-600 hover:bg-green-200 hover:text-green-700 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-800/50`}
          >
            <HiCheck className="w-4 h-4" />
          </button>
          <button
            title="User is Rejected"
            disabled
            className={`${baseButtonClass} bg-red-50 text-red-400 cursor-not-allowed dark:bg-red-900/20 dark:text-red-600`}
          >
            <HiX className="w-4 h-4" />
          </button>
        </>
      );
    default:
      return null;
  }
}