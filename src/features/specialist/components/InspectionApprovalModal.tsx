import { useState } from "react";
import { Modal } from "../../../components/ui/modal";
import TextArea from "../../../components/form/input/TextArea";
import Label from "../../../components/form/Label";
import Button from "../../../components/ui/button/Button";
import DropzoneComponent from "../../../components/form/form-elements/DropZone";
import { HiCheckCircle } from "react-icons/hi";
import { HiExclamationTriangle } from "react-icons/hi2";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (comment: string, files: File[]) => void; // updated
  action: "approve" | "reject";
  loading?: boolean;
  comment: string;
  setComment: (text: string) => void;
}

export default function InspectionApprovalModal({
  isOpen,
  onClose,
  onConfirm,
  action,
  loading = false,
  comment,
  setComment,
}: Props) {
  const [files, setFiles] = useState<File[]>([]);

  const isApprove = action === "approve";

  const btnText = isApprove ? "Yes, Approve" : "Yes, Reject";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isApprove ? "Approve Request" : "Reject Request"}
      titleIcon={
        isApprove ? (
          <HiCheckCircle className="text-green-600 w-5 h-5" />
        ) : (
          <HiExclamationTriangle className="text-red-600 w-5 h-5" />
        )
      }
    >
      <div className="text-sm text-gray-700 dark:text-gray-300 mb-5">
        <p className="font-semibold">
          {isApprove
            ? "Are you sure you want to approve this inspection?"
            : "Are you sure you want to reject this inspection?"}
        </p>
        <p className="mt-1">
          {isApprove
            ? "It will be marked as passed."
            : "Please explain the reason for rejection below."}
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Label>Comment</Label>
          <TextArea
            rows={4}
            placeholder="Optional comment..."
            value={comment}
            onChange={setComment}
          />
        </div>

        <div>
          <Label>Attach PDF Documents</Label>
          <DropzoneComponent files={files} setFiles={setFiles} />
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <button
            type="button"
            disabled={loading}
            onClick={() => onConfirm(comment, files)}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              isApprove
                ? "bg-green-600 text-white hover:bg-green-700"
                : "bg-red-600 text-white hover:bg-red-700"
            } disabled:opacity-50`}
          >
            {btnText}
          </button>
        </div>
      </div>
    </Modal>
  );
}
