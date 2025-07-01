import { Modal } from "../../../components/ui/modal";
import TextArea from "../../../components/form/input/TextArea";
import Label from "../../../components/form/Label";
import Button from "../../../components/ui/button/Button";

interface VehicleApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (comment: string) => void;
  action: "approve" | "reject" | null;
  loading?: boolean;
  comment: string;
  setComment: (value: string) => void;
}

export default function VehicleApprovalModal({
  isOpen,
  onClose,
  onConfirm,
  action,
  loading = false,
  comment,
  setComment,
}: VehicleApprovalModalProps) {
  if (!action) return null;

  const isApprove = action === "approve";
  const modalTitle = isApprove ? "Approve Vehicle Request" : "Reject Vehicle Request";
  const buttonText = isApprove ? "Yes, Approve" : "Yes, Reject";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={modalTitle}>
      <div className="text-sm text-gray-700 dark:text-gray-300 mb-5 leading-relaxed">
        <p className="font-semibold text-base">
          {isApprove
            ? "Are you sure you want to approve this vehicle request?"
            : "Are you sure you want to reject this vehicle request?"}
        </p>
        <p className="mt-1">
          {isApprove
            ? "Once approved, the request will be activated."
            : "This action cannot be undone. You may explain the reason below."}
        </p>
      </div>

      <div className="space-y-5">
        <div>
          <Label>Comment for the requester</Label>
          <TextArea rows={4} placeholder="Optional comment..." value={comment} onChange={setComment} />
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <button
            type="button"
            onClick={() => onConfirm(comment)}
            disabled={loading}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              isApprove ? "bg-green-600 text-white hover:bg-green-700" : "bg-red-600 text-white hover:bg-red-700"
            } disabled:opacity-50`}
          >
            {buttonText}
          </button>
        </div>
      </div>
    </Modal>
  );
}
