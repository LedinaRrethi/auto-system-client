import { HiCheck, HiX } from "react-icons/hi";
import { VehicleRequestList } from "../../../types/Vehicle/VehicleRequestList";

interface Props {
  vehicle: VehicleRequestList;
  onAction: (vehicle: VehicleRequestList, action: "approve" | "reject") => void;
}

export default function VehicleRequestActionButtons({ vehicle, onAction }: Props) {
  const baseButtonClass = "flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200";

  const isPending = vehicle.status === "Pending";

  return (
    <div className="flex gap-2">
      <button
        type="button"
        aria-label="Approve Request"
        title="Approve Request"
        onClick={() => isPending && onAction(vehicle, "approve")}
        className={`${baseButtonClass} ${
          isPending
            ? "hover:scale-105 bg-green-100 text-green-600 hover:bg-green-200 hover:text-green-700 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-800/50"
            : "bg-green-100 text-green-300 cursor-not-allowed opacity-60 dark:bg-green-900/20"
        }`}
        disabled={!isPending}
      >
        <HiCheck className="w-4 h-4" />
      </button>

      <button
        type="button"
        aria-label="Reject Request"
        title="Reject Request"
        onClick={() => isPending && onAction(vehicle, "reject")}
        className={`${baseButtonClass} ${
          isPending
            ? "hover:scale-105 bg-red-100 text-red-600 hover:bg-red-200 hover:text-red-700 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-800/50"
            : "bg-red-100 text-red-300 cursor-not-allowed opacity-60 dark:bg-red-900/20"
        }`}
        disabled={!isPending}
      >
        <HiX className="w-4 h-4" />
      </button>
    </div>
  );
}
