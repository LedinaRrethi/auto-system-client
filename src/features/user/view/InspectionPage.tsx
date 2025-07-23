import { useCallback, useEffect, useRef, useState } from "react";
import ComponentCard from "../../../components/common/ComponentCard";
import InspectionRegistrationTable from "../components/InspectionRegistrationTable";
import InspectionRegistrationModal from "../components/InspectionRegistrationModal";
// import PageMeta from "../../../components/common/PageMeta";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import Alert from "../../../components/ui/alert/Alert";
import Pagination from "../../../components/ui/pagination/Pagination";
import { MyInspectionsRequest } from "../../../types/Inspection/MyInspectionsRequest";
import { InspectionRequestInput } from "../../../utils/validations/inspectionRequestSchema";
import {
  createInspectionRequest,
  getMyInspectionRequests,
  fetchMyVehiclePlates,
} from "../../../services/inspectionService";
import { InspectionRequestCreateDTO } from "../../../types/Inspection/InspectionRequestCreate";
import { getDirectorates } from "../../../services/directoryService";
import { MyVehiclePlate } from "../../../types/MyVehiclePlate";
import { Directorate } from "../../../types/Directorate";
import { HiPlus, HiSearch } from "react-icons/hi";
import Button from "../../../components/ui/button/Button";

export default function InspectionPage() {
  const [inspections, setInspections] = useState<MyInspectionsRequest[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [infoMsg, setInfoMsg] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [pageSize] = useState(8);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [submittedSearch, setSubmittedSearch] = useState("");

  const [, setVehicles] = useState<MyVehiclePlate[]>([]);
  const [, setDirectorates] = useState<Directorate[]>([]);
  const [modalErrorMsg, setModalErrorMsg] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [alert, setAlert] = useState<{
    variant: "success" | "info" | "error";
    title: string;
    message: string;
  } | null>(null);

  const fetchInspections = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await getMyInspectionRequests({
        page,
        pageSize,
        search: submittedSearch,
      });
      setInspections(res.items);
      setHasNextPage(res.hasNextPage);
      if (res.items.length === 0) {
        setAlert({
          variant: "info",
          title: "No Requests",
          message: res.message || "You haven't done any inspection requests.",
        });
      } else {
        setAlert(null);
      }
    } catch {
      setErrorMsg("Failed to load inspection requests.");
    } finally {
      setIsLoading(false);
    }
  }, [page, pageSize, submittedSearch]);

  useEffect(() => {
    const loadMeta = async () => {
      try {
        const [veh, dirs] = await Promise.all([
          fetchMyVehiclePlates(),
          getDirectorates(),
        ]);
        setVehicles(veh);
        setDirectorates(dirs);
      } catch {
        setErrorMsg("Failed to load vehicles or directorates.");
      }
    };
    loadMeta();
    fetchInspections();
  }, [fetchInspections]);

  const handleAddClick = () => {
    setIsModalOpen(true);
    setModalErrorMsg(null);
    setSuccessMsg(null);
    setErrorMsg(null);
  };

  const handleSubmit = async (data: InspectionRequestInput) => {
    try {
      const dto: InspectionRequestCreateDTO = {
        IDFK_Vehicle: data.vehicleId,
        IDFK_Directory: data.directoryId,
        RequestedDate: data.requestedDate,
      };
      await createInspectionRequest(dto);
      setSuccessMsg("Inspection request submitted successfully.");
      setIsModalOpen(false);
      await fetchInspections();
    } catch (error: unknown) {
      const err = error as { response?: { data?: string }; message?: string };
      const message =
        typeof err?.response?.data === "string"
          ? err.response.data
          : err?.message || "Failed to submit inspection request.";
      setModalErrorMsg(message);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSuccessMsg(null);
      setErrorMsg(null);
      setInfoMsg(null);
    }, 3000);
    return () => clearTimeout(timeout);
  }, [successMsg, errorMsg, infoMsg]);

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      setSubmittedSearch(searchTerm);
      setPage(1);
    }, 600);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [searchTerm]);

  return (
    <>
      {/* <PageMeta title="Vehicle Inspections | AutoSystem" description="Manage and schedule vehicle inspections." /> */}
      <PageBreadcrumb pageTitle="My Inspections" />

      <div className="space-y-6">
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
          title="Inspections"
          desc="Here you can view and manage your vehicle inspections."
        >
          <div className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
              <input
                type="text"
                placeholder="Search ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setSubmittedSearch(searchTerm);
                    setPage(1);
                  }
                }}
                className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-200 bg-transparent py-2.5 pl-10 pr-4 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
              />
            </div>
            <Button
              startIcon={<HiPlus />}
              onClick={handleAddClick}
              className="bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              Add Inspection
            </Button>
          </div>

          <div className="relative min-h-[300px]">
            {inspections.length === 0 && !isLoading ? (
              <div className="flex justify-center items-center h-full py-10">
                <p className="text-lg text-gray-500 dark:text-gray-400">
                  No inspection to display.
                </p>
              </div>
            ) : (
              <InspectionRegistrationTable inspections={inspections} />
            )}

            {isLoading && (
              <div className="absolute inset-0 flex justify-center items-center bg-white/50 dark:bg-gray-900/50 z-10">
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-6 w-6 border-2 border-gray-300 border-t-brand-500"></div>
                  <p className="text-lg text-gray-600 dark:text-white">
                    Loading inspections...
                  </p>
                </div>
              </div>
            )}
          </div>

          <Pagination
            currentPage={page}
            hasNextPage={hasNextPage}
            onPageChange={setPage}
          />
        </ComponentCard>

        <InspectionRegistrationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmit}
          successMsg={successMsg}
          errorMsg={modalErrorMsg}
        />
      </div>
    </>
  );
}
