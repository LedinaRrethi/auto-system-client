import { HiCheck, HiX } from "react-icons/hi";
import { InspectionRequestList } from "../../../types/InspectionApproval/InspectionList";

interface Props {
  request: InspectionRequestList;
  onAction: (id: string, action: "approve" | "reject") => void;
}

export default function InspectionButtons({ request, onAction }: Props) {
  const baseButtonClass =
    "flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200 hover:scale-105";

  const isPending = request.status === "Pending";
  const isApproved = request.status === "Approved";
  const isRejected = request.status === "Rejected";

  return (
    <div className="flex gap-2">
      <button
        title={
          isPending
            ? "Approve Inspection"
            : isApproved
            ? "Inspection Approved"
            : "Approve Inspection"
        }
        onClick={() => isPending && onAction(request.idpK_InspectionRequest, "approve")}
        disabled={!isPending}
        className={`${baseButtonClass} ${
          isPending
            ? "bg-green-100 text-green-600 hover:bg-green-200 hover:text-green-700 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-800/50"
            : "bg-green-50 text-green-400 cursor-not-allowed dark:bg-green-900/20 dark:text-green-600"
        }`}
      >
        <HiCheck className="w-4 h-4" />
      </button>

      <button
        title={
          isPending
            ? "Reject Inspection"
            : isRejected
            ? "Inspection Rejected"
            : "Reject Inspection"
        }
        onClick={() => isPending && onAction(request.idpK_InspectionRequest, "reject")}
        disabled={!isPending}
        className={`${baseButtonClass} ${
          isPending
            ? "bg-red-100 text-red-600 hover:bg-red-200 hover:text-red-700 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-800/50"
            : "bg-red-50 text-red-400 cursor-not-allowed dark:bg-red-900/20 dark:text-red-600"
        }`}
      >
        <HiX className="w-4 h-4" />
      </button>
    </div>
  );
}
