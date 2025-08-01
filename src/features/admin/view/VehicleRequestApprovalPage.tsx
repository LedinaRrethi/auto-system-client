import { useCallback, useEffect, useRef, useState } from "react";
//import PageMeta from "../../../components/common/PageMeta";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import ComponentCard from "../../../components/common/ComponentCard";
import Alert from "../../../components/ui/alert/Alert";
import Pagination from "../../../components/ui/pagination/Pagination";
import { HiSearch } from "react-icons/hi";
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
  const [pageSize] = useState(6);
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

  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [infoMsg, setInfoMsg] = useState<string | null>(null);

  const [alert, setAlert] = useState<{
    variant: "success" | "info" | "error";
    title: string;
    message: string;
  } | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const loadRequests = useCallback(async () => {
    setIsLoading(true);
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

      return res.items.length;
    } catch {
      setErrorMsg("Failed to load vehicle requests.");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [page, pageSize, submittedSearch]);

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

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

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSuccessMsg(null);
      setErrorMsg(null);
      setInfoMsg(null);
    }, 3000);

    return () => clearTimeout(timeout);
  }, [successMsg, errorMsg, infoMsg]);

  const openModal = (
    vehicle: VehicleRequestList,
    action: "approve" | "reject"
  ) => {
    setSelectedVehicle(vehicle);
    setModalAction(action);
    setModalOpen(true);
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

  const handleModalConfirm = async (comment: string) => {
    if (!selectedVehicle || !modalAction) return;

    try {
      const newStatus =
        modalAction === "approve"
          ? VehicleStatus.Approved
          : VehicleStatus.Rejected;

      await updateRequestStatus(selectedVehicle.idpK_ChangeRequest, {
        newStatus,
        approvalComment: comment,
      });

      const verb =
        modalAction === "approve"
          ? "approved"
          : modalAction === "reject"
          ? "rejected"
          : modalAction + "ed";

      setSuccessMsg(`Vehicle request ${verb} successfully.`);

      setTimeout(async () => {
        await loadRequests();
        setSubmittedSearch(searchTerm);
      }, 3000);
    } catch {
      setErrorMsg(`Failed to ${modalAction} the request.`);
    } finally {
      setModalOpen(false);
      setSelectedVehicle(null);
      setModalAction(null);
      setComment("");
    }
  };

  return (
    <>
      {/* <PageMeta title="Vehicle Approval | AutoSystem" description="Manage and monitor vehicle approvals in the AutoSystem."/> */}

      <PageBreadcrumb pageTitle="Vehicle Approval" />

      <div className="space-y-4">
        {successMsg && (
          <Alert variant="success" title="Success" message={successMsg} />
        )}
        {errorMsg && <Alert variant="error" title="Error" message={errorMsg} />}
        {infoMsg && <Alert variant="info" title="Info" message={infoMsg} />}
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
                placeholder="Search by plate, request type, ..."
                autoComplete="off"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-200 bg-transparent py-2.5 pl-10 pr-4 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
              />
            </div>
          </div>

          <div className="relative flex flex-col flex-grow min-h-[300px] overflow-hidden">
            {vehicles.length === 0 && !isLoading ? (
              <div className="flex justify-center items-center flex-grow py-10">
                <p className="text-lg text-gray-500 dark:text-gray-400">
                  No vehicles to display.
                </p>
              </div>
            ) : (
              <div className="flex-grow">
                <VehicleRequestApprovalTable
                  vehicles={vehicles}
                  onAction={openModal}
                />
              </div>
            )}

            {isLoading && (
              <div className="absolute inset-0 bg-white/50 dark:bg-gray-900/50 flex justify-center items-center z-10">
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-6 w-6 border-2 border-gray-300 border-t-brand-500"></div>
                  <p className="text-lg text-gray-600 dark:text-white">
                    Loading vehicle requests...
                  </p>
                </div>
              </div>
            )}
          </div>

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
