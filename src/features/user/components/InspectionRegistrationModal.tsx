import { useForm } from "react-hook-form";
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
import { fetchVehicles } from "../../../services/vehicleService";
import { getDirectorates } from "../../../services/directoryService";

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
    watch,
    formState: { errors },
  } = useForm<InspectionRequestInput>({
    resolver: zodResolver(inspectionRequestSchema),
    mode: "onSubmit",
  });

  const [vehicles, setVehicles] = useState<{ id: string; plateNumber: string }[]>([]);
  const [directorates, setDirectorates] = useState<{ id: string; name: string }[]>([]);
  const [plateInput, setPlateInput] = useState("");
  const [dirInput, setDirInput] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const rawVehicles = await fetchVehicles();
        const rawDirectorates = await getDirectorates();

        const mappedVehicles = (rawVehicles as RawVehicle[])
          .map((v) => ({
            id: v.idfK_Vehicle ?? v.id ?? v.idpk_Vehicle ?? "",
            plateNumber: v.plateNumber,
          }))
          .filter((v, i, self) => self.findIndex((x) => x.id === v.id) === i); 

        const mappedDirectorates = (rawDirectorates as RawDirectorate[])
          .map((d) => ({
            id: d.id ?? d.idpk_Directorate ?? "",
            name: d.directoryName ?? d.name ?? "",
          }))
          .filter((d, i, self) => self.findIndex((x) => x.id === d.id) === i); //fshij id qe jan shfaq dy here


          console.log(mappedVehicles);
          console.log(mappedDirectorates);

        setVehicles(mappedVehicles);
        setDirectorates(mappedDirectorates);
      } catch (error) {
        console.error("Failed to fetch modal data:", error);
      }
    };

    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Request Inspection Appointment">
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
            <Autocomplete
              options={vehicles}
              getOptionLabel={(v) => v.plateNumber}
              isOptionEqualToValue={(a, b) => a.id === b.id}
              value={vehicles.find((v) => v.plateNumber === plateInput) || null}
              inputValue={plateInput}
              onInputChange={(_, value) => setPlateInput(value)}
              onChange={(_, value) => setValue("vehicleId", value?.id || "")}
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
              isOptionEqualToValue={(a, b) => a.id === b.id}
              value={directorates.find((d) => d.name === dirInput) || null}
              inputValue={dirInput}
              onInputChange={(_, value) => setDirInput(value)}
              onChange={(_, value) => setValue("directoryId", value?.id || "")}
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

          {/* Submit */}
          <Button type="submit" className="w-full">
            Submit Request
          </Button>
        </Form>
      </div>
    </Modal>
  );
}
