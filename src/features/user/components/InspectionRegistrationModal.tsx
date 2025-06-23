import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Modal } from "../../../components/ui/modal";
import Label from "../../../components/form/Label";
import Button from "../../../components/ui/button/Button";
import Form from "../../../components/form/Form";
import Input from "../../../components/form/input/InputField";
import DatePicker from "../../../components/form/date-picker";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { TimeIcon } from "../../../assets/icons";
import {
  InspectionRequestInput,
  inspectionRequestSchema,
} from "../../../utils/validations/inspectionRequestSchema";
import { getDirectorates } from "../../../services/directoryService";
import { fetchMyVehiclePlates } from "../../../services/inspectionService";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: InspectionRequestInput) => void;
  errorMsg?: string | null;
  successMsg?: string | null;
}

interface RawVehicle {
  idfK_Vehicle?: string;
  id?: string;
  idpk_Vehicle?: string;
  plateNumber: string;
}

interface RawDirectorate {
  id?: string;
  idpk_Directorate?: string;
  directoryName?: string;
  name?: string;
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
  } = useForm<InspectionRequestInput>({
    resolver: zodResolver(inspectionRequestSchema),
    mode: "onSubmit",
  });

  const [vehicles, setVehicles] = useState<
    { id: string; plateNumber: string }[]
  >([]);
  const [directorates, setDirectorates] = useState<
    { id: string; name: string }[]
  >([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const rawVehicles = await fetchMyVehiclePlates();
        const rawDirectorates = await getDirectorates();

        const uniqueVehicles = (rawVehicles as RawVehicle[])
          .map((v) => ({
            id: v.idfK_Vehicle ?? v.id ?? v.idpk_Vehicle ?? "",
            plateNumber: v.plateNumber,
          }))
          .filter((v, i, arr) => arr.findIndex((x) => x.id === v.id) === i);

        const uniqueDirectorates = (rawDirectorates as RawDirectorate[])
          .map((d) => ({
            id: d.id ?? d.idpk_Directorate ?? "",
            name: d.directoryName ?? d.name ?? "",
          }))
          .filter((d, i, arr) => arr.findIndex((x) => x.id === d.id) === i);

        console.log(uniqueVehicles);
        console.log(uniqueDirectorates);

        setVehicles(uniqueVehicles);
        setDirectorates(uniqueDirectorates);
      } catch (error) {
        console.error("Failed to fetch modal data:", error);
      }
    };

    if (isOpen) fetchData();
  }, [isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Request Inspection Appointment"
    >
      <div className="p-5 sm:p-6 w-full max-w-md">
        <Form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {successMsg && (
            <p className="text-green-600 text-sm bg-green-50 p-2 rounded-md border border-green-200">
              {successMsg}
            </p>
          )}
          {errorMsg && (
            <p className="text-red-600 text-sm bg-red-50 p-2 rounded-md border border-red-200">
              {errorMsg}
            </p>
          )}

          {/* Plate Number */}
          <div>
            <Label>Plate Number</Label>
            <Controller
              name="vehicleId"
              control={control}
              rules={{ required: "Plate number is required" }}
              render={({ field }) => (
                <Autocomplete
                  options={vehicles}
                  getOptionLabel={(v) => v.plateNumber}
                  isOptionEqualToValue={(a, b) => a.id === b.id}
                  value={vehicles.find((v) => v.id === field.value) || null}
                  onChange={(_, newValue) => {
                    field.onChange(newValue?.id || "");
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Type your plate..."
                      variant="standard"
                      error={!!errors.vehicleId}
                      helperText={errors.vehicleId?.message}
                      InputProps={{
                        ...params.InputProps,
                        disableUnderline: true,
                        className:
                          "h-11 w-full rounded-lg border border-gray-200 bg-transparent py-2.5 px-4 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-white/30 dark:focus:border-brand-600",
                      }}
                    />
                  )}
                />
              )}
            />
          </div>
          {/* Directorate */}
          <div>
            <Label>Directorate</Label>
            <Controller
              name="directoryId"
              control={control}
              rules={{ required: "Directorate is required" }}
              render={({ field }) => (
                <Autocomplete
                  options={directorates}
                  getOptionLabel={(d) => d.name}
                  isOptionEqualToValue={(a, b) => a.id === b.id}
                  value={directorates.find((d) => d.id === field.value) || null}
                  onChange={(_, newValue) => {
                    field.onChange(newValue?.id || "");
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Type directorate..."
                      variant="standard"
                      error={!!errors.directoryId}
                      helperText={errors.directoryId?.message}
                      InputProps={{
                        ...params.InputProps,
                        disableUnderline: true,
                        className:
                          "h-11 w-full rounded-lg border border-gray-200 bg-transparent py-2.5 px-4 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-white/30 dark:focus:border-brand-600",
                      }}
                    />
                  )}
                />
              )}
            />
          </div>

          {/* Date Picker */}
          <div>
            <Label>Date</Label>
            <DatePicker
              id="date-picker"
              onChange={(dates) => {
                const [date] = dates;
                if (date) {
                  const current = watch("requestedDate") ?? new Date();
                  const updated = new Date(current);
                  updated.setFullYear(date.getFullYear());
                  updated.setMonth(date.getMonth());
                  updated.setDate(date.getDate());
                  setValue("requestedDate", updated);
                }
              }}
            />
          </div>

          {/* Time Picker */}
          <div>
            <Label htmlFor="tm">Time</Label>
            <div className="relative">
              <Input
                type="time"
                id="tm"
                onChange={(e) => {
                  const [hour, minute] = e.target.value.split(":").map(Number);
                  const current = watch("requestedDate") ?? new Date();
                  const updated = new Date(current);
                  updated.setHours(hour);
                  updated.setMinutes(minute);
                  updated.setSeconds(0);
                  updated.setMilliseconds(0);
                  setValue("requestedDate", updated);
                }}
              />
              <span className="absolute text-gray-500 right-3 top-1/2 -translate-y-1/2">
                <TimeIcon className="size-6" />
              </span>
            </div>
          </div>

          <Button type="submit" className="w-full">
            Submit Request
          </Button>
        </Form>
      </div>
    </Modal>
  );
}
