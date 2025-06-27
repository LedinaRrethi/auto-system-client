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

export default function UserApprovalModal({
  isOpen,
  action,
  user,
  onConfirm,
  onCancel,
}: Props) {
  if (!user || !action) return null;

  const actionText = {
    approve: "approve",
    reject: "reject",
    deactivate: "deactivate",
  }[action];

  const actionColor = {
    approve: "text-green-600",
    reject: "text-red-600",
    deactivate: "text-yellow-600",
  }[action];

  const actionButtonStyle = {
    approve: "bg-green-600 hover:bg-green-700",
    reject: "bg-red-600 hover:bg-red-700",
    deactivate: "bg-yellow-500 hover:bg-yellow-600",
  }[action];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onCancel}
      className="max-w-md mx-4"
      titleIcon={
        action === "approve" ? (
          <HiCheck className="text-green-600 w-5 h-5" />
        ) : (
          <HiX className="text-red-600 w-5 h-5" />
        )
      }
      title={`${actionText.charAt(0).toUpperCase() + actionText.slice(1)} User`}
    >
      <div className="p-6">
        <div className="mb-6">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Are you sure you want to{" "}
            <span className={`font-semibold ${actionColor}`}>{actionText}</span>{" "}
            the following user?
          </p>

          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-medium text-gray-700 dark:text-gray-300">Name:</span>
                <span className="text-gray-900 dark:text-white">
                  {`${user.firstName} ${user.fatherName} ${user.lastName}`}
                </span>
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
                  color={
                    user.status === "Approved"
                      ? "success"
                      : user.status === "Rejected"
                      ? "error"
                      : "warning"
                  }
                >
                  {user.status}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <Button
            onClick={onConfirm}
            className={`px-4 py-2 text-white ${actionButtonStyle}`}
          >
            {actionText.charAt(0).toUpperCase() + actionText.slice(1)}
          </Button>
          <Button variant="outline" onClick={onCancel} className="px-4 py-2">
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
}
