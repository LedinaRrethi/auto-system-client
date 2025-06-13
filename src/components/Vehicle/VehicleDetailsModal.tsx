import { Modal } from "../ui/modal";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentData: Record<string, unknown>;
  requestedData: Record<string, unknown>;
  comment?: string;
}

export function VehicleDetailsModal({
  isOpen,
  onClose,
  currentData,
  requestedData,
  comment,
}: Props) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-3xl mx-auto">
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-4">Vehicle Request Details</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <h4 className="font-semibold mb-2">Current Data</h4>
            <pre className="bg-gray-100 p-3 rounded text-sm whitespace-pre-wrap">
              {JSON.stringify(currentData, null, 2)}
            </pre>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Requested Data</h4>
            <pre className="bg-gray-100 p-3 rounded text-sm whitespace-pre-wrap">
              {JSON.stringify(requestedData, null, 2)}
            </pre>
          </div>
        </div>

        {comment && (
          <div className="mb-4">
            <h4 className="font-semibold mb-1">User Comment:</h4>
            <p className="text-sm text-gray-700">{comment}</p>
          </div>
        )}

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
}
