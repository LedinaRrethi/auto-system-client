import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../../components/ui/table";
import Badge from "../../../components/ui/badge/Badge";
import { User } from "../../../types/User";
import UserActionButtons from "./UserActionButtons";

interface Props {
  users: User[];
  onAction: (user: User, action: "approve" | "reject" | "deactivate") => void;
}

export default function UserApprovalTable({ users, onAction }: Props) {
  return (
    <div className="max-w-full overflow-x-auto">
      <Table className="w-full min-w-[1000px]">
        <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
          <TableRow>
            <TableCell className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Name</TableCell>
            <TableCell className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Role</TableCell>
            <TableCell className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Email</TableCell>
            <TableCell className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Status</TableCell>
            <TableCell className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Registered</TableCell>
            <TableCell className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Actions</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="px-5 py-4 text-sm text-gray-700 dark:text-white">
                {`${user.firstName} ${user.fatherName} ${user.lastName}`}
              </TableCell>
              <TableCell className="px-5 py-4 text-sm text-gray-700 dark:text-white">{user.role}</TableCell>
              <TableCell className="px-5 py-4 text-sm text-gray-700 dark:text-white">{user.email}</TableCell>
              <TableCell className="px-5 py-4 text-sm">
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
              </TableCell>
              <TableCell className="px-5 py-4 text-sm text-gray-600 dark:text-gray-300">
                {new Date(user.createdOn).toLocaleDateString()}
              </TableCell>
              <TableCell className="px-5 py-4 text-sm text-left">
                <div className="flex items-center gap-3">
                  <UserActionButtons user={user} onAction={onAction} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
