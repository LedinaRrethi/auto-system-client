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
  const buttonText = isApprove ? "Approve Request" : "Reject Request";
  const sentence = isApprove
    ? "Do you want to approve this vehicle registration/modification request?"
    : "Please confirm you want to reject this vehicle request. Optionally, explain why.";

  const buttonClass = isApprove
    ? "bg-green-600 text-white hover:bg-green-700"
    : "bg-red-600 text-white hover:bg-red-700";

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">{sentence}</p>
      <div className="space-y-4">
        <div>
          <Label>Comment for the vehicle owner</Label>
          <TextArea
            rows={4}
            placeholder="Optional comment..."
            value={comment}
            onChange={setComment}
          />
        </div>
        <div className="flex justify-end gap-4">
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
