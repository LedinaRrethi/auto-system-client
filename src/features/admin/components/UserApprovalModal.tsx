import { HiCheck, HiX } from "react-icons/hi";
import { Modal } from "../../../components/ui/modal";
import Badge from "../../../components/ui/badge/Badge";
import Button from "../../../components/ui/button/Button";
import { User } from "../../../types/User";

interface Props {
  isOpen: boolean;
  action: "approve" | "reject" | "deactivate" | null;
  user: User | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function UserApprovalModal({ isOpen, action, user, onConfirm, onCancel }: Props) {
  if (!user || !action) return null;

  const actionText = action === "approve" ? "approve" : action === "deactivate" ? "deactivate" : "reject";

  const actionColor = action === "approve" ? "text-green-600" : "text-red-600";

  return (
    <Modal isOpen={isOpen} onClose={onCancel} className="max-w-md mx-4" titleIcon= {action === "approve" ? <HiCheck className="text-green-600 w-5 h-5"  /> : <HiX className="text-red-600 w-5 h-5"  />} title={action === "approve" ? "Approve User" : action === "deactivate" ? "Deactivate User" : "Reject User"}>
      <div className="p-6">
        <div className="mb-6">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Are you sure you want to <span className={`font-semibold ${actionColor}`}>{actionText}</span> the following
            user?
          </p>

          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-medium text-gray-700 dark:text-gray-300">Name:</span>
                <span className="text-gray-900 dark:text-white">{`${user.firstName} ${user.fatherName} ${user.lastName}`}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700 dark:text-gray-300">Email:</span>
                <span className="text-gray-900 dark:text-white">{user.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700 dark:text-gray-300">Role:</span>
                <span className="text-gray-900 dark:text-white">{user.role}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700 dark:text-gray-300">Current Status:</span>
                <Badge
                  size="sm"
                  color={user.status === "Approved" ? "success" : user.status === "Rejected" ? "error" : "warning"}
                >
                  {user.status}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <Button variant={action === "approve" ? "primary" : "outline"} onClick={onConfirm} className="px-4 py-2">
            {action === "approve" ? "Approve" : action === "deactivate" ? "Deactivate" : "Reject"}
          </Button>
          <Button variant="outline" onClick={onCancel} className="px-4 py-2">
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
}
