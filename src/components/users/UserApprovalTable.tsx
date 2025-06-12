import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import { HiSearch, HiCheck, HiX } from "react-icons/hi";
import { User } from "../../types/User";
import { useState, useMemo, useEffect } from "react";
import Pagination from "../ui/pagination/Pagination";
import Button from "../ui/button/Button";
import Alert from "../ui/alert/Alert";
import UserApprovalModal from "./UserApprovalModal";
import { fetchUsers, updateUserStatus } from "../../api/adminApi";

export default function UserApprovalTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [orderByAsc, setOrderByAsc] = useState(false);
  const itemsPerPage = 5;

  const [modalOpen, setModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState<
    "approve" | "reject" | "deactivate" | null
  >(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const result = await fetchUsers(currentPage, itemsPerPage);
        const mapped = result.users.map((u: User) => ({
          id: u.id,
          firstName: u.firstName,
          fatherName: u.fatherName,
          lastName: u.lastName,
          email: u.email,
          role: u.role,
          status: u.status,
          createdOn: u.createdOn,
        }));

        setUsers(mapped);
      } catch (err) {
        console.error("Failed to fetch users:", err);
      }
    };

    loadUsers();
  }, [currentPage]);

  const [alert, setAlert] = useState<{
    variant: "success" | "error";
    title: string;
    message: string;
  } | null>(null);

  const openModal = (
    id: string,
    action: "approve" | "reject" | "deactivate"
  ) => {
    const user = users.find((u) => u.id === id);
    setSelectedUserId(id);
    setSelectedUser(user || null);
    setModalAction(action);
    setModalOpen(true);
  };

  const handleModalConfirm = async () => {
  if (!selectedUserId || !modalAction) return;

  let newStatus: "Approved" | "Rejected";

  if (modalAction === "approve") {
    newStatus = "Approved";
  } else {
    // për "reject" dhe "deactivate", vendosim "Rejected"
    newStatus = "Rejected";
  }

  try {
    await updateUserStatus(selectedUserId, newStatus); 

    setUsers((prev) =>
      prev.map((user) =>
        user.id === selectedUserId
          ? {
              ...user,
              status: newStatus,
            }
          : user
      )
    );

    setAlert({
      variant: "success",
      title: "Success",
      message: `User successfully ${newStatus.toLowerCase()}.`,
    });

    setTimeout(() => setAlert(null), 3000);
  } catch (error) {
    console.error("Failed to update user status:", error);
    setAlert({
      variant: "error",
      title: "Error",
      message: `Failed to ${modalAction} user.`,
    });
    setTimeout(() => setAlert(null), 3000);
  } finally {
    setModalOpen(false);
    setSelectedUserId(null);
    setSelectedUser(null);
    setModalAction(null);
  }
};

  const handleModalCancel = () => {
    setModalOpen(false);
    setSelectedUserId(null);
    setSelectedUser(null);
    setModalAction(null);
  };

  const filteredUsers = useMemo(() => {
    const sorted = [...users].sort((a, b) => {
      const dateA = new Date(a.createdOn).getTime();
      const dateB = new Date(b.createdOn).getTime();
      return orderByAsc ? dateA - dateB : dateB - dateA;
    });

    return sorted.filter((v) => {
      const fullName = `${v.firstName} ${v.fatherName} ${v.lastName}`;
      const searchMatch =
        fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.email.toLowerCase().includes(searchTerm.toLowerCase());
      const statusMatch = statusFilter ? v.status === statusFilter : true;
      return searchMatch && statusMatch;
    });
  }, [users, searchTerm, statusFilter, orderByAsc]);

  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredUsers.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredUsers, currentPage]);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, filteredUsers.length);

  const getActionButtons = (user: User) => {
    const baseButtonClass =
      "flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200 hover:scale-105";

    switch (user.status) {
      case "Pending":
        return (
          <>
            <button
              title="Approve User"
              onClick={() => openModal(user.id, "approve")}
              className={`${baseButtonClass} bg-green-100 text-green-600 hover:bg-green-200 hover:text-green-700 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-800/50`}
            >
              <HiCheck className="w-4 h-4" />
            </button>
            <button
              title="Reject User"
              onClick={() => openModal(user.id, "reject")}
              className={`${baseButtonClass} bg-red-100 text-red-600 hover:bg-red-200 hover:text-red-700 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-800/50`}
            >
              <HiX className="w-4 h-4" />
            </button>
          </>
        );
      case "Approved":
        return (
          <>
            <button
              title="User is Active"
              disabled
              className={`${baseButtonClass} bg-green-50 text-green-400 cursor-not-allowed dark:bg-green-900/20 dark:text-green-600`}
            >
              <HiCheck className="w-4 h-4" />
            </button>
            <button
              title="Deactivate User"
              onClick={() => openModal(user.id, "deactivate")}
              className={`${baseButtonClass} bg-red-100 text-red-600 hover:bg-red-200 hover:text-red-700 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-800/50`}
            >
              <HiX className="w-4 h-4" />
            </button>
          </>
        );
      case "Rejected":
        return (
          <>
            <button
              title="Approve User"
              onClick={() => openModal(user.id, "approve")}
              className={`${baseButtonClass} bg-green-100 text-green-600 hover:bg-green-200 hover:text-green-700 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-800/50`}
            >
              <HiCheck className="w-4 h-4" />
            </button>
            <button
              title="User is Rejected"
              disabled
              className={`${baseButtonClass} bg-red-50 text-red-400 cursor-not-allowed dark:bg-red-900/20 dark:text-red-600`}
            >
              <HiX className="w-4 h-4" />
            </button>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <>
      {alert && (
        <div className="fixed top-4 right-4 z-50 w-96">
          <Alert
            variant={alert.variant}
            title={alert.title}
            message={alert.message}
          />
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex gap-4 items-center w-full sm:w-auto flex-wrap">
            <div className="relative w-full sm:w-80">
              <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
              <input
                type="text"
                placeholder="Search by name, role, email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-200 bg-transparent py-2.5 pl-10 pr-4 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-900 dark:bg-white/[0.03] dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-11 rounded-lg border border-gray-200 bg-white text-sm text-gray-700 dark:border-gray-800 dark:bg-gray-800 dark:text-white px-4"
            >
              <option value="">All Statuses</option>
              <option value="Approved">Approved</option>
              <option value="Pending">Pending</option>
              <option value="Rejected">Rejected</option>
            </select>
            <Button
              variant="outline"
              onClick={() => setOrderByAsc(!orderByAsc)}
            >
              Order by Date {orderByAsc ? "↑" : "↓"}
            </Button>
          </div>
        </div>

        <div className="max-w-full overflow-x-auto">
          <Table className="w-full min-w-[1000px]">
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                  Name
                </TableCell>
                <TableCell className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                  Role
                </TableCell>
                <TableCell className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                  Email
                </TableCell>
                <TableCell className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                  Status
                </TableCell>
                <TableCell className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                  Registered
                </TableCell>
                <TableCell className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                  Actions
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {paginatedUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="px-5 py-4 text-sm text-gray-700 dark:text-white"> {`${user.firstName} ${user.fatherName} ${user.lastName}`}</TableCell>
                  <TableCell className="px-5 py-4 text-sm text-gray-700 dark:text-white">
                    {user.role}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-sm text-gray-700 dark:text-white">
                    {user.email}
                  </TableCell>
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
                      {getActionButtons(user)}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          startIndex={startIndex}
          endIndex={endIndex}
          totalItems={filteredUsers.length}
          onPageChange={setCurrentPage}
        />
      </div>

      <UserApprovalModal
        isOpen={modalOpen}
        action={modalAction}
        user={selectedUser}
        onCancel={handleModalCancel}
        onConfirm={handleModalConfirm}
      />
    </>
  );
}
