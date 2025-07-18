//import PageMeta from "../../../components/common/PageMeta";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import ComponentCard from "../../../components/common/ComponentCard";
import Alert from "../../../components/ui/alert/Alert";
import Pagination from "../../../components/ui/pagination/Pagination";
import { HiSearch } from "react-icons/hi";
import { User } from "../../../types/User";
import { fetchUsers, updateUserStatus } from "../../../services/adminApi";
import UserApprovalTable from "../components/UserApprovalTable";
import UserApprovalModal from "../components/UserApprovalModal";
import { useCallback, useEffect, useState, useRef } from "react";

export default function UserApprovalPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(5);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [submittedSearch, setSubmittedSearch] = useState("");
  
  const [isLoading, setIsLoading] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState<"approve" | "reject" | "deactivate" | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const [alert, setAlert] = useState<{
    variant: "success" | "info" | "error";
    title: string;
    message: string;
  } | null>(null);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const loadUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetchUsers({
        page,
        pageSize,
        search: submittedSearch,
        sortField: "CreatedOn",
        sortOrder: "desc",
      });
      setUsers(res.items);
      setHasNextPage(res.hasNextPage);

      if (res.items.length === 0) {
        setAlert({
          variant: "info",
          title: "No Users",
          message: res.message || "No users found.",
        });
      } else {
        setAlert(null);
      }
    } catch (err) {
      console.error("Error fetching users:", err);
      setAlert({
        variant: "error",
        title: "Error",
        message: "Failed to load users.",
      });
    } finally {
      setIsLoading(false);
    }
  }, [page, pageSize, submittedSearch]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  useEffect(() => {
    const timeout = setTimeout(() => setAlert(null), 3000);
    return () => clearTimeout(timeout);
  }, [alert]);

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      setSubmittedSearch(searchTerm);
      setPage(1); 
    }, 600); 

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [searchTerm]);

  const openModal = (user: User, action: "approve" | "reject" | "deactivate") => {
    setSelectedUser(user);
    setModalAction(action);
    setModalOpen(true);
  };

  const handleModalConfirm = async () => {
    if (!selectedUser || !modalAction) return;

    const newStatus = modalAction === "approve" ? "Approved" : "Rejected";

    try {
      await updateUserStatus(selectedUser.id, newStatus);
      setUsers((prev) => prev.map((u) => (u.id === selectedUser.id ? { ...u, status: newStatus } : u)));
      setAlert({
        variant: "success",
        title: "Success",
        message: `User successfully ${newStatus.toLowerCase()}.`,
      });
    } catch {
      setAlert({
        variant: "error",
        title: "Error",
        message: `Failed to ${modalAction} user.`,
      });
    } finally {
      setModalOpen(false);
      setSelectedUser(null);
      setModalAction(null);
    }
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      setSubmittedSearch(searchTerm);
      setPage(1);
    }
  };

  return (
    <>
      {/* <PageMeta title="User Approval | AutoSystem" description="Manage and approve system users" /> */}
      <PageBreadcrumb pageTitle="User Approval" />

      <div className="space-y-4">
        {alert && <Alert variant={alert.variant} title={alert.title} message={alert.message} />}

        <ComponentCard
          title="User Approval"
          desc="Here you can view, approve, or reject user registrations. Only approved users can access the system functionalities."
        >
          <div className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
              <input
                type="text"
                placeholder="Search by name, role, email..."
                autoComplete="off"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-200 bg-transparent py-2.5 pl-10 pr-4 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-white/[0.03] dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
            />
            </div>
          </div>

          <div className={`transition-all duration-300 ${isLoading ? 'opacity-50' : 'opacity-100'}`}>
            {users.length === 0 && !isLoading ? (
              <div className="flex justify-center items-center py-10">
                <p className="text-lg text-gray-500 dark:text-gray-400">No users to display.</p>
              </div>
            ) : (
              <UserApprovalTable users={users} onAction={openModal} />
            )}
          </div>

          {isLoading && users.length === 0 && (
            <div className="flex justify-center items-center py-10">
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-gray-300 border-t-brand-500"></div>
                <p className="text-lg text-gray-500 dark:text-gray-400">Loading users...</p>
              </div>
            </div>
          )}

          <UserApprovalModal
            isOpen={modalOpen}
            action={modalAction}
            user={selectedUser}
            onConfirm={handleModalConfirm}
            onCancel={() => {
              setModalOpen(false);
              setSelectedUser(null);
              setModalAction(null);
            }}
          />

          <Pagination currentPage={page} hasNextPage={hasNextPage} onPageChange={setPage} />
        </ComponentCard>
      </div>
    </>
  );
}
