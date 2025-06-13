import { Modal } from "../../../components/ui/modal";
import TextArea from "../../../components/form/input/TextArea";
import Label from "../../../components/form/Label";
import Button from "../../../components/ui/button/Button";

interface VehicleApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (comment: string) => void;
  action: "approve" | "reject";
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
  const isApprove = action === "approve";
  const title = isApprove ? "Approve Vehicle Request" : "Reject Vehicle Request";
  const buttonText = isApprove ? "Approve" : "Reject";
  const sentence = isApprove
    ? " ✅ Are you sure you want to approve this vehicle request?Once approved, it will become active in the system."
    : " ⚠️ Are you sure you want to reject this vehicle request?  Provide a reason below if necessary.";

  const buttonClass = isApprove
    ? "bg-green-600 text-white hover:bg-green-700"
    : "bg-red-600 text-white hover:bg-red-700";

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-2xl font-bold mb-3 text-gray-800 dark:text-white">{title}</h2>
      <p className="text-base text-gray-700 dark:text-gray-300 mb-5 leading-relaxed">{sentence}</p>
      <div className="space-y-5">
        <div>
          <Label>Comment for the vehicle owner</Label>
          <TextArea
            rows={4}
            placeholder="Optional comment..."
            value={comment}
            onChange={setComment}
          />
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <button
            type="button"
            onClick={() => onConfirm(comment)}
            disabled={loading}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${buttonClass} disabled:opacity-50`}
          >
            {buttonText}
          </button>
        </div>
      </div>
    </Modal>
  );
}
