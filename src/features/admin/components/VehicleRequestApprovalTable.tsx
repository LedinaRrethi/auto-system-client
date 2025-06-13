import { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import Badge from "../../../components/ui/badge/Badge";
import Pagination from "../../../components/ui/pagination/Pagination";
import Button from "../../../components/ui/button/Button";
import { HiSearch } from "react-icons/hi";
import VehicleApprovalModal from "./VehicleRequestApprovalModal";
import { VehicleRequest } from "../../../types/VehicleRequest";
import VehicleRequestActionButtons from "./VehicleRequestActionButtons";

const mockRequests: VehicleRequest[] = [
  {
    id: "1",
    requestType: "Update",
    plateNumber: "AA123ZZ",
    requesterName: "Elira Dosti",
    requestDataJson: JSON.stringify({ color: "Black", plateNumber: "AA123ZZ" }),
    currentDataSnapshotJson: JSON.stringify({
      color: "White",
      plateNumber: "AA123ZZ",
    }),
    status: "Pending",
    adminComment: "",
    createdOn: "2025-06-10T08:00:00Z",
  },
  {
    id: "2",
    requestType: "Register",
    plateNumber: "BB456YY",
    requesterName: "Ardit Meta",
    requestDataJson: JSON.stringify({ color: "Red", plateNumber: "BB456YY" }),
    currentDataSnapshotJson: "{}",
    status: "Approved",
    adminComment: "Approved after inspection.",
    createdOn: "2025-06-11T10:30:00Z",
  },
];

export default function VehicleRequestApprovalTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<VehicleRequest | null>(
    null
  );
  const [actionType, setActionType] = useState<"approve" | "reject" | null>(
    null
  );
  const [adminComment, setAdminComment] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [orderByAsc, setOrderByAsc] = useState(false);

  const filteredRequests = useMemo(() => {
    const sorted = [...mockRequests].sort((a, b) => {
      const dateA = new Date(a.createdOn).getTime();
      const dateB = new Date(b.createdOn).getTime();
      return orderByAsc ? dateA - dateB : dateB - dateA;
    });

    return sorted.filter((r) => {
      const searchMatch =
        r.plateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.requesterName.toLowerCase().includes(searchTerm.toLowerCase());
      const statusMatch = statusFilter ? r.status === statusFilter : true;
      return searchMatch && statusMatch;
    });
  }, [searchTerm, statusFilter, orderByAsc]);

  const paginatedRequests = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredRequests.slice(start, start + itemsPerPage);
  }, [filteredRequests, currentPage]);

  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);

  const openModal = (request: VehicleRequest, action: "approve" | "reject") => {
    setSelectedRequest(request);
    setActionType(action);
    setAdminComment("");
    setModalOpen(true);
  };

  const handleConfirm = (comment: string) => {
    if (!selectedRequest || !actionType) return;
    console.log("Confirmed", {
      id: selectedRequest.id,
      action: actionType,
      comment,
    });
    setModalOpen(false);
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex gap-4 items-center w-full sm:w-auto flex-wrap">
          <div className="relative w-full sm:w-80">
            <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
            <input
              type="text"
              placeholder="Search by plate or requester..."
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
          <Button variant="outline" onClick={() => setOrderByAsc(!orderByAsc)}>
            Order by Date {orderByAsc ? "↑" : "↓"}
          </Button>
        </div>
      </div>

      <div className="max-w-full overflow-x-auto">
        <Table className="w-full min-w-[1000px]">
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              <TableCell className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                Plate
              </TableCell>
              <TableCell className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Owner</TableCell>
              <TableCell className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Request Type</TableCell>
              <TableCell className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Current</TableCell>
              <TableCell className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Requested</TableCell>
              <TableCell className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Request Date</TableCell>
              <TableCell className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Status</TableCell>
              <TableCell className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Actions</TableCell>
            </TableRow>
          </TableHeader>
           <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {paginatedRequests.map((r) => {
              const current = JSON.parse(r.currentDataSnapshotJson || "{}");
              const requested = JSON.parse(r.requestDataJson || "{}");
              return (
                <TableRow key={r.id}>
                   <TableCell className="px-5 py-4 text-sm text-gray-700 dark:text-white">{r.plateNumber}</TableCell>
                   <TableCell className="px-5 py-4 text-sm text-gray-700 dark:text-white">{r.requesterName}</TableCell>
                   <TableCell className="px-5 py-4 text-sm text-gray-700 dark:text-white">{r.requestType}</TableCell>
                   <TableCell className="px-5 py-4 text-sm text-gray-700 dark:text-white">
                    Color: {current.color || "-"} <br />
                    Plate: {current.plateNumber || r.plateNumber}
                  </TableCell>
                   <TableCell className="px-5 py-4 text-sm text-gray-700 dark:text-white">
                    Color: {requested.color || "-"} <br />
                    Plate: {requested.plateNumber || r.plateNumber}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-sm text-gray-700 dark:text-white">
                    <Badge
                      color={
                        r.status === "Approved"
                          ? "success"
                          : r.status === "Rejected"
                          ? "error"
                          : "warning"
                      }
                    >
                      {r.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-5 py-4 text-sm text-gray-600 dark:text-gray-300">
                    {new Date(r.createdOn).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-sm text-left">
                     <div className="flex items-center gap-3">
                      <VehicleRequestActionButtons request={r} onAction={openModal} />
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        startIndex={(currentPage - 1) * itemsPerPage + 1}
        endIndex={Math.min(currentPage * itemsPerPage, filteredRequests.length)}
        totalItems={filteredRequests.length}
        onPageChange={setCurrentPage}
      />

      <VehicleApprovalModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleConfirm}
        action={actionType!}
        comment={adminComment}
        setComment={setAdminComment}
      />
    </div>
  );
}
