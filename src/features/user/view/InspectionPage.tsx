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

export default function InspectionPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inspections, setInspections] = useState<MyInspectionsRequest[]>([]);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [vehicles, setVehicles] = useState<MyVehiclePlate[]>([]);
  const [directorates, setDirectorates] = useState<Directorate[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const loadData = async () => {
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

    loadData();
  }, []);

  useEffect(() => {
    const fetchInspections = async () => {
      try {
        const res = await getMyInspectionRequests({ page, pageSize });
        setInspections(res.items);
        setTotalPages(Math.ceil((res.pageSize * (res.hasNextPage ? page + 1 : page)) / pageSize));
      } catch {
        setErrorMsg("Failed to load inspections.");
      }
    };

    fetchInspections();
  },[page,pageSize]);

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

      const plate = vehicles.find((v) => v.id === data.vehicleId)?.plateNumber || data.vehicleId;
      const directorate = directorates.find((d) => d.id === data.directoryId)?.directoryName || data.directoryId;

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

  return (
    <>
      <PageMeta title="Vehicle Inspections | AutoSystem" description="Manage and schedule vehicle inspections." />
      <PageBreadcrumb pageTitle="Vehicle Inspections" />

      <div className="space-y-4">
        {successMsg && <Alert variant="success" title="Success" message={successMsg} />}
        {errorMsg && <Alert variant="error" title="Error" message={errorMsg} />}

        <ComponentCard title="Inspections" desc="Here you can view and manage your vehicle inspections.">
          <InspectionRegistrationTable inspections={inspections} onAdd={handleAddClick} />
          <Pagination
            currentPage={page}
            totalPages={totalPages}
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
