import { useEffect, useState } from "react";
import ComponentCard from "../../../components/common/ComponentCard";
import InspectionRegistrationTable from "../components/InspectionRegistrationTable";
import InspectionRegistrationModal from "../components/InspectionRegistrationModal";
import PageMeta from "../../../components/common/PageMeta";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import Alert from "../../../components/ui/alert/Alert";
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

  useEffect(() => {
    const loadData = async () => {
      try {
        const [data, vehicleData, dirData] = await Promise.all([
          getMyInspectionRequests(),
          fetchMyVehiclePlates(),
          getDirectorates(),
        ]);
        setInspections(data);
        setVehicles(vehicleData);
        setDirectorates(dirData);
      } catch {
        setErrorMsg("Failed to load inspections.");
      }
    };

    loadData();
  }, []);

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