import { useEffect, useState } from "react";
import ComponentCard from "../../../components/common/ComponentCard";
import InspectionRegistrationTable from "../components/InspectionRegistrationTable";
import InspectionRegistrationModal from "../components/InspectionRegistrationModal";
import PageMeta from "../../../components/common/PageMeta";
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
import { AxiosError } from "axios";
import { HiPlus, HiSearch } from "react-icons/hi";
import Button from "../../../components/ui/button/Button";

export default function InspectionPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inspections, setInspections] = useState<MyInspectionsRequest[]>([]);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [vehicles, setVehicles] = useState<MyVehiclePlate[]>([]);
  const [directorates, setDirectorates] = useState<Directorate[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(5);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [submittedSearch, setSubmittedSearch] = useState("");

  useEffect(() => {
    const loadMetaData = async () => {
      try {
        const [vehicleData, dirData] = await Promise.all([
          fetchMyVehiclePlates(),
          getDirectorates(),
        ]);
        setVehicles(vehicleData);
        setDirectorates(dirData);
      } catch {
        setErrorMsg("Failed to load vehicles or directorates.");
      }
    };

    loadMetaData();
  }, []);

  useEffect(() => {
    const fetchInspections = async () => {
      try {
        const res = await getMyInspectionRequests({
          page,
          pageSize,
          search: submittedSearch,
        });
        setInspections(res.items);
        setHasNextPage(res.hasNextPage);

      } catch {
        setErrorMsg("Failed to load inspections.");
      }
    };

    fetchInspections();
  }, [page, pageSize, submittedSearch]);

  const handleAddClick = () => {
    setIsModalOpen(true);
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

      const plate =
        vehicles.find((v) => v.id === data.vehicleId)?.plateNumber ||
        data.vehicleId;
      const directorate =
        directorates.find((d) => d.id === data.directoryId)?.directoryName ||
        data.directoryId;

      const newInspection: MyInspectionsRequest = {
        idpk_InspectionRequest: crypto.randomUUID(),
        plateNumber: plate,
        requestedDate: data.requestedDate.toISOString(),
        directorateName: directorate,
        status: "Pending",
        comment: "",
        documents: [],
      };

      setInspections((prev) => [newInspection, ...prev]);
      setSuccessMsg("Inspection request submitted successfully!");
      setIsModalOpen(false);
    } catch (error) {
      const err = error as AxiosError;
      const backendMsg =
        err?.response?.data && typeof err.response.data === "string"
          ? err.response.data
          : "Failed to submit inspection request.";
      setErrorMsg(backendMsg);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSuccessMsg(null);
      setErrorMsg(null);
    }, 3000);
    return () => clearTimeout(timeout);
  }, [successMsg, errorMsg]);

   //remove that later TODO
  useEffect(() => {
  if (searchTerm === "") {
    setSubmittedSearch("");
    setPage(1);
  }
}, [searchTerm]);

  return (
    <>
      <PageMeta
        title="Vehicle Inspections | AutoSystem"
        description="Manage and schedule vehicle inspections."
      />
      <PageBreadcrumb pageTitle="My Inspections" />

      <div className="space-y-4">
        {successMsg && (
          <Alert variant="success" title="Success" message={successMsg} />
        )}
        {errorMsg && <Alert variant="error" title="Error" message={errorMsg} />}

        <ComponentCard
          title="Inspections"
          desc="Here you can view and manage your vehicle inspections."
        >
          <div className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex gap-4 items-center w-full sm:w-auto flex-wrap">
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
                  className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-200 bg-transparent py-2.5 pl-10 pr-4 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800  dark:bg-white/[0.03] dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                />
              </div>
            </div>

            <Button
              startIcon={<HiPlus />}
              onClick={handleAddClick}
              className="bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              Add Inspection
            </Button>
          </div>

          {/* <InspectionRegistrationTable inspections={inspections} /> */}

          {inspections.length === 0 && !searchTerm ? (
            <div className="flex justify-center items-center py-10">
              <p className="text-lg text-gray-500 dark:text-gray-400">
                You have no inspections.
              </p>
            </div>
          ) : inspections.length === 0 && searchTerm ? (
            <div className="flex justify-center items-center py-10">
              <p className="text-lg text-gray-500 dark:text-gray-400">
                No inspections found.
              </p>
            </div>
          ) : (
            <InspectionRegistrationTable inspections={inspections} />
          )}

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
          errorMsg={errorMsg}
        />
      </div>
    </>
  );
}
