import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import {  HiSearch, HiCheck, HiX } from "react-icons/hi";
import { User } from "../../types/User";
import { useState, useMemo } from "react";
import Pagination from "../ui/pagination/Pagination";
import Button from "../ui/button/Button";
import { Modal } from "../ui/modal";
import Alert from "../ui/alert/Alert";

const userData: User[] = [
  {
    id: "1",
    name: "Ledina Rrethi",
    role: "Police",
    email: "ledinarrethi@gmail.com",
    status: "Approved",
    createdAt: "2024-12-01",
  },
  {
    id: "2",
    name: "Kristian Rrethi",
    role: "Police",
    email: "kristianrrethi@gmail.com",
    status: "Pending",
    createdAt: "2024-12-10",
  },
  {
    id: "3",
    name: "Anxhela Rrethi",
    role: "Specialist",
    email: "anxhelarrethi@gmail.com",
    status: "Rejected",
    createdAt: "2024-12-01",
  },
];

export default function UserApprovalTable() {
  const [users, setUsers] = useState<User[]>(userData);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [orderByAsc, setOrderByAsc] = useState(false);
  const itemsPerPage = 5;

  const [modalOpen, setModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState<"approve" | "reject" | "deactivate" | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [alert, setAlert] = useState<{
    variant: "success" | "error";
    title: string;
    message: string;
  } | null>(null);

  const openModal = (id: string, action: "approve" | "reject" | "deactivate") => {
    const user = users.find(u => u.id === id);
    setSelectedUserId(id);
    setSelectedUser(user || null);
    setModalAction(action);
    setModalOpen(true);
  };

  const handleModalConfirm = async () => {
    if (!selectedUserId || !modalAction) return;

    try {
      // Simulate API call
      console.log(`${modalAction} user`, selectedUserId);

      // Update user status based on action
      setUsers((prev) =>
        prev.map((user) =>
          user.id === selectedUserId
            ? { 
                ...user, 
                status: modalAction === "approve" 
                  ? "Approved" 
                  : modalAction === "reject" || modalAction === "deactivate"
                  ? "Rejected" 
                  : user.status 
              }
            : user
        )
      );

      // Show success alert
      const actionText = modalAction === "approve" 
        ? "approved" 
        : modalAction === "deactivate" 
        ? "deactivated" 
        : "rejected";
      
      setAlert({
        variant: "success",
        title: "Success",
        message: `User successfully ${actionText}.`,
      });

      // Auto-hide alert after 3 seconds
      setTimeout(() => {
        setAlert(null);
      }, 3000);

    } catch {
      setAlert({
        variant: "error",
        title: "Error",
        message: `Failed to ${modalAction} user.`,
      });

      // Auto-hide alert after 3 seconds
      setTimeout(() => {
        setAlert(null);
      }, 3000);
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
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return orderByAsc ? dateA - dateB : dateB - dateA;
    });

    return sorted.filter((v) => {
      const searchMatch =
        v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
  const endIndex = Math.min(
    currentPage * itemsPerPage,
    filteredUsers.length
  );

  const getModalContent = () => {
    if (!selectedUser || !modalAction) return null;

    const actionText = modalAction === "approve" 
      ? "approve" 
      : modalAction === "deactivate" 
      ? "deactivate" 
      : "reject";
    
    const actionColor = modalAction === "approve" 
      ? "text-green-600" 
      : "text-red-600";

    return (
      <div className="p-6">
        <div className="flex items-center mb-4">
          <div className={`p-2 rounded-full mr-3 ${
            modalAction === "approve" 
              ? "bg-green-100 text-green-600" 
              : "bg-red-100 text-red-600"
          }`}>
            {modalAction === "approve" ? (
              <HiCheck className="w-6 h-6" />
            ) : (
              <HiX className="w-6 h-6" />
            )}
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {modalAction === "approve" ? "Approve User" : 
             modalAction === "deactivate" ? "Deactivate User" : "Reject User"}
          </h3>
        </div>
        
        <div className="mb-6">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Are you sure you want to <span className={`font-semibold ${actionColor}`}>
              {actionText}
            </span> the following user?
          </p>
          
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-medium text-gray-700 dark:text-gray-300">Name:</span>
                <span className="text-gray-900 dark:text-white">{selectedUser.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700 dark:text-gray-300">Email:</span>
                <span className="text-gray-900 dark:text-white">{selectedUser.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700 dark:text-gray-300">Role:</span>
                <span className="text-gray-900 dark:text-white">{selectedUser.role}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700 dark:text-gray-300">Current Status:</span>
                <Badge
                  size="sm"
                  color={
                    selectedUser.status === "Approved"
                      ? "success"
                      : selectedUser.status === "Rejected"
                      ? "error"
                      : "warning"
                  }
                >
                  {selectedUser.status}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <Button
            variant="outline"
            onClick={handleModalCancel}
            className="px-4 py-2"
          >
            Cancel
          </Button>
          <Button
            variant={modalAction === "approve" ? "primary" : "outline"}
            onClick={handleModalConfirm}
            className="px-4 py-2"
          >
            {modalAction === "approve" ? "Approve" : 
             modalAction === "deactivate" ? "Deactivate" : "Reject"}
          </Button>
        </div>
      </div>
    );
  };

  const getActionButtons = (user: User) => {
    const baseButtonClass = "flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200 hover:scale-105";
    
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
      {/* Alert */}
      {alert && (
        <div className="fixed top-4 right-4 z-50 w-96">
          <Alert
            variant={alert.variant}
            title={alert.title}
            message={alert.message}
          />
        </div>
      )}

      {/* Main Table */}
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
              <option
                className="text-black dark:text-white bg-white dark:bg-gray-800"
                value=""
              >
                All Statuses
              </option>
              <option
                className="text-black dark:text-white bg-white dark:bg-gray-800"
                value="Approved"
              >
                Approved
              </option>
              <option
                className="text-black dark:text-white bg-white dark:bg-gray-800"
                value="Pending"
              >
                Pending
              </option>
              <option
                className="text-black dark:text-white bg-white dark:bg-gray-800"
                value="Rejected"
              >
                Rejected
              </option>
            </select>

            <Button variant="outline" onClick={() => setOrderByAsc(!orderByAsc)}>
              Order by Date {orderByAsc ? "↑" : "↓"}
            </Button>
          </div>
        </div>

        <div className="max-w-full overflow-x-auto">
          <Table className="w-full min-w-[1000px]">
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell
                  isHeader
                  className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400"
                >
                  Name
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400"
                >
                  Role
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400"
                >
                  Email
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400"
                >
                  Status
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400"
                >
                  Registered
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400"
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {paginatedUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="px-5 py-4 text-sm text-gray-700 dark:text-white">
                    {user.name}
                  </TableCell>
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
                    {new Date(user.createdAt).toLocaleDateString()}
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

      {/* Confirmation Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={handleModalCancel}
        className="max-w-md mx-4"
      >
        {getModalContent()}
      </Modal>
    </>
  );
}