import { useEffect, useState } from "react";
import { createInspectionRequest } from "../../../services/inspectionService";
import { InspectionRequestInput } from "../../../utils/validations/inspectionRequestSchema";
import { getDirectorates } from "../../../services/directoryService";
import { Directorate } from "../../../types/Directorate";
import { AxiosError } from "axios";
import { Vehicle } from "../../../types/Vehicle/Vehicle";
import { fetchVehicles } from "../../../services/vehicleService";

export function useInspectionForm(onSuccess: () => void) {
  const [vehicles, setVehicles] = useState<{ id: string; plateNumber: string }[]>([]);
  const [directorates, setDirectorates] = useState<{ id: string; name: string }[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const v: Vehicle[] = await fetchVehicles();
        setVehicles(v.map((vr) => ({ id: vr.idpk_Vehicle, plateNumber: vr.plateNumber })));
        const d: Directorate[] = await getDirectorates();
        setDirectorates(d.map((dr) => ({ id: dr.id, name: dr.directoryName })));
      } catch {
        setErrorMsg("Failed to load data.");
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (data: InspectionRequestInput) => {
    try {
      await createInspectionRequest({
        IDFK_Vehicle: data.vehicleId,
        IDFK_Directory: data.directoryId,
        RequestedDate: data.requestedDate,
      });
      setSuccessMsg("Inspection request submitted successfully.");
      setErrorMsg(null);
      onSuccess();
    } catch (error: unknown) {
      setSuccessMsg(null);

      const err = error as AxiosError;
      setErrorMsg((err.response?.data as string) || "Submission failed.");
    }
  };

  return {
    vehicles,
    directorates,
    errorMsg,
    successMsg,
    handleSubmit,
    setErrorMsg,
    setSuccessMsg,
  };
}
