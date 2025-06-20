import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal } from "../../../components/ui/modal";
import Label from "../../../components/form/Label";
import Button from "../../../components/ui/button/Button";
import Form from "../../../components/form/Form";
import Input from "../../../components/form/input/InputField";
import DatePicker from "../../../components/form/date-picker";
import { TimeIcon } from "../../../assets/icons";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { useEffect, useState } from "react";
import { InspectionRequestInput, inspectionRequestSchema } from "../../../utils/validations/inspectionRequestSchema";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: InspectionRequestInput) => void;
  vehicles: { id: string; plateNumber: string }[];
  directorates: { id: string; name: string }[];
}

export default function InspectionRegistrationModal({
  isOpen,
  onClose,
  onSubmit,
  vehicles,
  directorates,
}: Props) {
  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<InspectionRequestInput>({
    resolver: zodResolver(inspectionRequestSchema),
    mode: "onSubmit",
  });

  const [plateInput, setPlateInput] = useState("");
  const [dirInput, setDirInput] = useState("");

  // Set initial values when modal opens (optional)
  useEffect(() => {
    setPlateInput("");
    setDirInput("");
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-5 sm:p-6 w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
          Request Inspection Appointment
        </h2>

        <Form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Plate Number */}
          <div>
            <Label>Plate Number</Label>
            <Autocomplete
              options={vehicles}
              getOptionLabel={(v) => v.plateNumber}
              inputValue={plateInput}
              onInputChange={(_, value) => setPlateInput(value)}
              onChange={(_, value) => {
                setValue("vehicleId", value?.id || "");
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="standard"
                  placeholder="Type plate number"
                  InputProps={{
                    ...params.InputProps,
                    disableUnderline: true,
                    className:
                      "h-11 w-full rounded-lg border border-gray-200 bg-transparent py-2.5 px-4 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-white/30 dark:focus:border-brand-600",
                  }}
                />
              )}
            />
            {errors.vehicleId && (
              <p className="text-red-500 text-sm">{errors.vehicleId.message}</p>
            )}
          </div>

          {/* Directorate */}
          <div>
            <Label>Directorate</Label>
            <Autocomplete
              options={directorates}
              getOptionLabel={(d) => d.name}
              inputValue={dirInput}
              onInputChange={(_, value) => setDirInput(value)}
              onChange={(_, value) => {
                setValue("directoryId", value?.id || "");
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="standard"
                  placeholder="Type directorate"
                  InputProps={{
                    ...params.InputProps,
                    disableUnderline: true,
                    className:
                      "h-11 w-full rounded-lg border border-gray-200 bg-transparent py-2.5 px-4 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-white/30 dark:focus:border-brand-600",
                  }}
                />
              )}
            />
            {errors.directoryId && (
              <p className="text-red-500 text-sm">{errors.directoryId.message}</p>
            )}
          </div>

          {/* Date Picker */}
          <div>
            <Label>Date</Label>
            <DatePicker
              id="date-picker"
              label=""
              placeholder="Select a date"
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
                  const time = e.target.value;
                  const [hour, minute] = time.split(":").map(Number);
                  const current = watch("requestedDate") ?? new Date();
                  const updated = new Date(current);
                  updated.setHours(hour);
                  updated.setMinutes(minute);
                  updated.setSeconds(0);
                  updated.setMilliseconds(0);
                  setValue("requestedDate", updated);
                }}
              />
              <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                <TimeIcon className="size-6" />
              </span>
            </div>
          </div>

          {/* Submit */}
          <Button type="submit" className="w-full">
            Submit Request
          </Button>
        </Form>
      </div>
    </Modal>
  );
}
