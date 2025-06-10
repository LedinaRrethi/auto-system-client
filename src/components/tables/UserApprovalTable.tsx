import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import { HiPencilAlt, HiTrash, HiSearch } from "react-icons/hi";
import { User } from "../../types/User";
import { useState, useMemo } from "react";
import Pagination from "../ui/pagination/Pagination";
import Button from "../ui/button/Button";

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
    createdAt: "2024-12-01",
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
  const [vehicles, setVehicles] = useState<User[]>(userData);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [orderByAsc, setOrderByAsc] = useState(false);
  const itemsPerPage = 5;

  const filteredVehicles = useMemo(() => {
    const sorted = [...vehicles].sort((a, b) => {
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
  }, [vehicles, searchTerm, statusFilter, orderByAsc]);

  const paginatedVehicles = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredVehicles.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredVehicles, currentPage]);

  const totalPages = Math.ceil(filteredVehicles.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(
    currentPage * itemsPerPage,
    filteredVehicles.length
  );

  const handleEdit = (id: string) => {
    console.log("Edit vehicle:", id);
  };

  const handleDelete = (id: string) => {
    setVehicles((prev) => prev.filter((v) => v.id !== id));
  };



  return (
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
            {paginatedVehicles.map((user) => (
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
                    {user.status === "Approved"
                      ? "Approved"
                      : user.status === "Pending"
                      ? "Pending"
                      : "Rejected"}
                  </Badge>
                </TableCell>
                <TableCell className="px-5 py-4 text-sm text-gray-600 dark:text-gray-300">
                  {new Date(user.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="px-5 py-4 text-sm text-left">
                  <div className="flex items-center gap-3">
                    <button
                      title="Edit"
                      onClick={() => handleEdit(user.id)}
                      className="text-blue-600 hover:text-blue-800 text-xl"
                    >
                      <HiPencilAlt />
                    </button>
                    <button
                      title="Delete"
                      onClick={() => handleDelete(user.id)}
                      className="text-red-600 hover:text-red-800 text-xl"
                    >
                      <HiTrash />
                    </button>
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
        totalItems={filteredVehicles.length}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}


