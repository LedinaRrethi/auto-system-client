import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useState } from "react";
import { Modal } from "../../../components/ui/modal";
import Label from "../../../components/form/Label";
import Button from "../../../components/ui/button/Button";
import Form from "../../../components/form/Form";
import Input from "../../../components/form/input/InputField";
import DatePicker from "../../../components/form/date-picker";
import { TimeIcon } from "../../../assets/icons";
import { InspectionRequestInput, inspectionRequestSchema } from "../../../utils/validations/inspectionRequestSchema";
import { getDirectorates } from "../../../services/directoryService";
import { fetchMyVehiclePlates } from "../../../services/inspectionService";
import { Directorate } from "../../../types/Directorate";
import { MyVehiclePlate } from "../../../types/MyVehiclePlate";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: InspectionRequestInput) => void;
  errorMsg?: string | null;
  successMsg?: string | null;
}

export default function InspectionRegistrationModal({ isOpen, onClose, onSubmit, errorMsg, successMsg }: Props) {
  const {
    handleSubmit,
    setValue,
    control,
    watch,
    formState: { errors },
    reset,
  } = useForm<InspectionRequestInput>({
    resolver: zodResolver(inspectionRequestSchema),
  });

  const [vehicleOptions, setVehicleOptions] = useState<MyVehiclePlate[]>([]);
  const [directorateOptions, setDirectorateOptions] = useState<Directorate[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const loadData = async () => {
      setIsLoading(true);
      try {
        const [vehicles, directorates] = await Promise.all([fetchMyVehiclePlates(), getDirectorates()]);
        setVehicleOptions(vehicles);
        setDirectorateOptions(directorates);
      } catch (err) {
        console.error("Failed to load data", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [isOpen]);

  const updateDateTime = useCallback(
    (modifier: (current: Date) => Date) => {
      const current = watch("requestedDate") ?? new Date();
      setValue("requestedDate", modifier(current));
    },
    [watch, setValue]
  );

  const handleDateChange = useCallback(
    (dates: Date[]) => {
      const [selectedDate] = dates;
      if (!selectedDate) return;
      setValue("requestedDate", selectedDate);

      updateDateTime(
        (prev) =>
          new Date(
            selectedDate.getFullYear(),
            selectedDate.getMonth(),
            selectedDate.getDate(),
            prev.getHours(),
            prev.getMinutes()
          )
      );
    },
    [updateDateTime, setValue]
  );

  const handleTimeChange = useCallback(
    (timeStr: string) => {
      const [hour, minute] = timeStr.split(":").map(Number);
      if (!isNaN(hour) && !isNaN(minute)) {
        updateDateTime((prev) => new Date(prev.getFullYear(), prev.getMonth(), prev.getDate(), hour, minute));
      }
    },
    [updateDateTime]
  );

  const handleSubmitWithValidation = (data: InspectionRequestInput) => {
    const selectedDate = new Date(data.requestedDate);
    if (!data.requestedDate || isNaN(selectedDate.getTime())) {
      setLocalError("Please select a valid date.");
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);

    const isPast = selectedDate < today;
    const isWeekend = [0, 6].includes(selectedDate.getDay());

    if (isPast) {
      setLocalError("You cannot select a past date.");
      return;
    }

    if (isWeekend) {
      setLocalError("Inspections cannot be scheduled on weekends.");
      return;
    }

    setLocalError(null);
    onSubmit(data);
    reset();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Request Inspection Appointment">
      <div className="p-5 sm:p-6 w-full max-w-md">
        <Form onSubmit={handleSubmit(handleSubmitWithValidation)} className="space-y-5">
          {successMsg && (
            <div className="text-green-600 text-sm bg-green-50 p-3 rounded border border-green-200">{successMsg}</div>
          )}
          {errorMsg && (
            <div className="text-red-600 text-sm bg-red-50 p-3 rounded border border-red-200">{errorMsg}</div>
          )}
          {localError && (
            <div className="text-red-600 text-sm bg-red-50 p-3 rounded border border-red-200">{localError}</div>
          )}

          <div>
            <Label>Vehicle Plate</Label>
            <Controller
              name="vehicleId"
              control={control}
              render={({ field }) => (
                <select {...field} disabled={isLoading} className="form-select w-full rounded border px-3 py-2">
                  <option value="">Select plate</option>
                  {vehicleOptions.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.plateNumber}
                    </option>
                  ))}
                </select>
              )}
            />
            {errors.vehicleId && <p className="text-red-500 text-xs mt-1">{errors.vehicleId.message}</p>}
          </div>

          <div>
            <Label>Directorate</Label>
            <Controller
              name="directoryId"
              control={control}
              render={({ field }) => (
                <select {...field} disabled={isLoading} className="form-select w-full rounded border px-3 py-2">
                  <option value="">Select directorate</option>
                  {directorateOptions.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.directoryName}
                    </option>
                  ))}
                </select>
              )}
            />
            {errors.directoryId && <p className="text-red-500 text-xs mt-1">{errors.directoryId.message}</p>}
          </div>

          <div>
            <Label>Date</Label>
            <DatePicker id="date-picker" onChange={handleDateChange} />
          </div>

          <div>
            <Label htmlFor="time-input">Time</Label>
            <div className="relative">
              <Input type="time" id="time-input" onChange={(e) => handleTimeChange(e.target.value)} className="pr-12" />
              <span className="absolute text-gray-500 right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <TimeIcon className="size-6" />
              </span>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Loading..." : "Submit Request"}
          </Button>
        </Form>
      </div>
    </Modal>
  );
}
