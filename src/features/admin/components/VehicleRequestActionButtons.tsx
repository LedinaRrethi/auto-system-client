// File: components/VehicleRequestActionButtons.tsx
import { HiCheck, HiX } from "react-icons/hi";
import { VehicleRequest } from "../../../types/VehicleRequest";

interface Props {
  request: VehicleRequest;
  onAction: (request: VehicleRequest, action: "approve" | "reject") => void;
}

export default function VehicleRequestActionButtons({ request, onAction }: Props) {
  const baseButtonClass =
    "flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200 hover:scale-105";

  return (
    <>
      <button
        title="Approve Request"
        onClick={() => onAction(request, "approve")}
        className={`${baseButtonClass} bg-green-100 text-green-600 hover:bg-green-200 hover:text-green-700 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-800/50`}
      >
        <HiCheck className="w-4 h-4" />
      </button>
      <button
        title="Reject Request"
        onClick={() => onAction(request, "reject")}
        className={`${baseButtonClass} bg-red-100 text-red-600 hover:bg-red-200 hover:text-red-700 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-800/50`}
      >
        <HiX className="w-4 h-4" />
      </button>
    </>
  );
}
