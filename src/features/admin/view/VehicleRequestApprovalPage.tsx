import PageMeta from "../../../components/common/PageMeta";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import ComponentCard from "../../../components/common/ComponentCard";
import Alert from "../../../components/ui/alert/Alert";
import Pagination from "../../../components/ui/pagination/Pagination";
import { HiSearch } from "react-icons/hi";
import { useCallback, useEffect, useState } from "react";
import {
  getAllVehicleRequests,
  updateRequestStatus,
} from "../../../services/vehicleAdminService";
import { VehicleRequestList } from "../../../types/Vehicle/VehicleRequestList";
import VehicleRequestApprovalTable from "../components/VehicleRequestApprovalTable";
import VehicleRequestApprovalModal from "../components/VehicleRequestApprovalModal";
import { VehicleStatus } from "../../../types/enums";

export default function VehicleRequestApprovalPage() {
  const [vehicles, setVehicles] = useState<VehicleRequestList[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(5);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [submittedSearch, setSubmittedSearch] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState<"approve" | "reject" | null>(
    null
  );
  const [selectedVehicle, setSelectedVehicle] =
    useState<VehicleRequestList | null>(null);
  const [comment, setComment] = useState("");

  const [alert, setAlert] = useState<{
    variant: "success" | "info" | "error";
    title: string;
    message: string;
  } | null>(null);

  const loadRequests = useCallback(async () => {
    try {
      const res = await getAllVehicleRequests({
        page,
        pageSize,
        search: submittedSearch,
        sortField: "CreatedOn",
        sortOrder: "desc",
      });
      setVehicles(res.items);
      setHasNextPage(res.hasNextPage);

      if (res.items.length === 0) {
        setAlert({
          variant: "info",
          title: "No Requests",
          message: res.message || "You have no vehicle requests.",
        });
      } else {
        setAlert(null);
      }
    } catch (err) {
      console.error("Error fetching vehicle requests:", err);
      setAlert({
        variant: "error",
        title: "Error",
        message: "Failed to load vehicle requests.",
      });
    }
  }, [page, pageSize, submittedSearch]);

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  useEffect(() => {
    const timeout = setTimeout(() => setAlert(null), 3000);
    return () => clearTimeout(timeout);
  }, [alert]);

  const openModal = (
    vehicle: VehicleRequestList,
    action: "approve" | "reject"
  ) => {
    setSelectedVehicle(vehicle);
    setModalAction(action);
    setComment("");
    setModalOpen(true);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setSubmittedSearch(searchTerm);
      setPage(1);
    }
  };

  const handleModalConfirm = async (comment: string) => {
    if (!selectedVehicle || !modalAction) return;

    try {
      const newStatus =
        modalAction === "approve"
          ? VehicleStatus.Approved
          : VehicleStatus.Rejected;

      await updateRequestStatus(selectedVehicle.idpK_ChangeRequest, {
        newStatus,
        adminComment: comment,
      });

      setAlert({
        variant: "success",
        title: "Success",
        message: `Vehicle request ${modalAction}ed successfully.`,
      });

      await loadRequests();
    } catch {
      setAlert({
        variant: "error",
        title: "Error",
        message: `Failed to ${modalAction} the request.`,
      });
    } finally {
      setModalOpen(false);
      setSelectedVehicle(null);
      setModalAction(null);
      setComment("");
    }
  };

  useEffect(() => {
    if (searchTerm === "") {
      setSubmittedSearch("");
      setPage(1);
    }
  }, [searchTerm]);

  return (
    <>
      <PageMeta
        title="Vehicle Approval | AutoSystem"
        description="Manage and monitor vehicle approvals in the AutoSystem."
      />

      <PageBreadcrumb pageTitle="Vehicle Approval" />

      <div className="space-y-4">
        {alert && (
          <Alert
            variant={alert.variant}
            title={alert.title}
            message={alert.message}
          />
        )}

        <ComponentCard
          title="Vehicle Approval"
          desc="Here you can view, approve, or reject vehicle requests for registration, update or delete."
        >
          <div className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
              <input
                type="text"
                placeholder="Search by plate ,request type , ..."
                autoComplete="off"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-200 bg-transparent py-2.5 pl-10 pr-4 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
              />
            </div>
          </div>

          {vehicles.length === 0 ? (
            <div className="flex justify-center items-center py-10">
              <p className="text-lg text-gray-500 dark:text-gray-400">
                No vehicles to display.
              </p>
            </div>
          ) : (
            <VehicleRequestApprovalTable
              vehicles={vehicles}
              onAction={openModal}
            />
          )}

          <VehicleRequestApprovalModal
            isOpen={modalOpen}
            action={modalAction}
            onConfirm={handleModalConfirm}
            onClose={() => {
              setModalOpen(false);
              setSelectedVehicle(null);
              setModalAction(null);
              setComment("");
            }}
            comment={comment}
            setComment={setComment}
            requestType={selectedVehicle?.requestType}
          />

          <Pagination
            currentPage={page}
            hasNextPage={hasNextPage}
            onPageChange={setPage}
          />
        </ComponentCard>
      </div>
    </>
  );
}
