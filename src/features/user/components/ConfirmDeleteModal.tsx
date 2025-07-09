import { Modal } from "../../../components/ui/modal";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  plateNumber?: string;
}

export default function ConfirmDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  plateNumber,
}: ConfirmDeleteModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Confirm Deletion">
      <div className="text-sm text-gray-700 dark:text-white pt-4">
        Are you sure you want to delete vehicle <strong>{plateNumber}</strong>?
      </div>
      <div className="flex justify-end mt-6 gap-3">
        <button
          onClick={onClose}
          className="px-4 py-2 rounded-lg border text-sm text-gray-700 dark:text-white"
        >
          Cancel
        </button>
        <button
          onClick={() => {
            onConfirm();
            onClose();
          }}
          className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 text-sm"
        >
          Confirm Delete
        </button>
      </div>
    </Modal>
  );
}
