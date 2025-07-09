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
import {
  InspectionRequestInput,
  inspectionRequestSchema,
} from "../../../utils/validations/inspectionRequestSchema";
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

export default function InspectionRegistrationModal({
  isOpen,
  onClose,
  onSubmit,
  errorMsg,
  successMsg,
}: Props) {
  const {
    handleSubmit,
    setValue,
    control,
    watch,
    formState: { errors },
    reset,
    trigger,
  } = useForm<InspectionRequestInput>({
    resolver: zodResolver(inspectionRequestSchema),
    defaultValues: {
      vehicleId: "",
      directoryId: "",
      requestedDate: undefined,
    },
  });

  const [vehicleOptions, setVehicleOptions] = useState<MyVehiclePlate[]>([]);
  const [directorateOptions, setDirectorateOptions] = useState<Directorate[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const loadData = async () => {
      setIsLoading(true);
      try {
        const [vehicles, directorates] = await Promise.all([
          fetchMyVehiclePlates(),
          getDirectorates(),
        ]);
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
      const updated = modifier(current);
      setValue("requestedDate", updated);
      trigger("requestedDate");
    },
    [watch, setValue, trigger]
  );

  const handleDateChange = useCallback(
    (dates: Date[]) => {
      const [selected] = dates;
      if (!selected) return;
      updateDateTime(
        (prev) =>
          new Date(
            selected.getFullYear(),
            selected.getMonth(),
            selected.getDate(),
            prev.getHours(),
            prev.getMinutes()
          )
      );
    },
    [updateDateTime]
  );

  const handleTimeChange = useCallback(
    (timeStr: string) => {
      const [hour, minute] = timeStr.split(":").map(Number);
      if (!isNaN(hour) && !isNaN(minute)) {
        updateDateTime(
          (prev) =>
            new Date(
              prev.getFullYear(),
              prev.getMonth(),
              prev.getDate(),
              hour,
              minute
            )
        );
      }
    },
    [updateDateTime]
  );

  const handleSubmitWithValidation = (data: InspectionRequestInput) => {
    const selected = data.requestedDate;
    if (!selected || isNaN(new Date(selected).getTime())) {
      setLocalError("Please select a valid date and time.");
      return;
    }

    const now = new Date();
    if (selected < now) {
      setLocalError("Date and time cannot be in the past.");
      return;
    }

    const day = selected.getDay();
    if (day === 0 || day === 6) {
      setLocalError("Inspections cannot be scheduled on weekends.");
      return;
    }

    const payload: InspectionRequestInput = {
      ...data,
      requestedDate: selected,
    };

    setLocalError(null);
    onSubmit(payload);
    reset({
      vehicleId: "",
      directoryId: "",
      requestedDate: undefined,
    });
  };

  const handleModalClose = () => {
    reset({
      vehicleId: "",
      directoryId: "",
      requestedDate: undefined,
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleModalClose}
      title="Request Inspection Appointment"
    >
      <div className="w-full max-w-md mx-auto">
        <Form
          onSubmit={handleSubmit(handleSubmitWithValidation)}
          className="space-y-4"
        >
          {successMsg && (
            <div className="text-green-600 text-sm bg-green-50 p-3 rounded border border-green-200">
              {successMsg}
            </div>
          )}
          {errorMsg && (
            <div className="text-red-600 text-sm bg-red-50 p-3 rounded border border-red-200">
              {errorMsg}
            </div>
          )}
          {localError && (
            <div className="text-red-600 text-sm bg-red-50 p-3 rounded border border-red-200">
              {localError}
            </div>
          )}

          <div className="pt-4">
            <Label>Vehicle Plate</Label>
            <Controller
              name="vehicleId"
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  disabled={isLoading}
                  className="form-select w-full rounded border px-3 py-2"
                >
                  <option value="">Select plate</option>
                  {vehicleOptions.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.plateNumber}
                    </option>
                  ))}
                </select>
              )}
            />
            {errors.vehicleId && (
              <p className="text-red-500 text-xs mt-1">
                {errors.vehicleId.message}
              </p>
            )}
          </div>

          <div>
            <Label>Directorate</Label>
            <Controller
              name="directoryId"
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  disabled={isLoading}
                  className="form-select w-full rounded border px-3 py-2"
                >
                  <option value="">Select directorate</option>
                  {directorateOptions.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.directoryName}
                    </option>
                  ))}
                </select>
              )}
            />
            {errors.directoryId && (
              <p className="text-red-500 text-xs mt-1">
                {errors.directoryId.message}
              </p>
            )}
          </div>

          <div>
            <Label>Date</Label>
            <DatePicker id="date-picker" onChange={handleDateChange} />
            {errors.requestedDate && (
              <p className="text-red-500 text-xs mt-1">
                {errors.requestedDate.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="time-input">Time</Label>
            <div className="relative">
              <Input
                type="time"
                id="time-input"
                onChange={(e) => handleTimeChange(e.target.value)}
                className="pr-12"
              />
              <span className="absolute text-gray-500 right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <TimeIcon className="size-6" />
              </span>
            </div>
            {errors.requestedDate && (
              <p className="text-red-500 text-xs mt-1">
                {errors.requestedDate.message}
              </p>
            )}
          </div>

          <div className="pt-3 pb-3">
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Loading..." : "Submit Request"}
          </Button>
          </div>
        </Form>
      </div>
    </Modal>
  );
}
