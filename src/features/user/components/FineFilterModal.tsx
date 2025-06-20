import { FineFilter } from "../../../types/Fine/FineFilter";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import DatePicker from "../../../components/form/date-picker";
import Button from "../../../components/ui/button/Button";
import { useEffect, useState } from "react";
import { HiX, HiCheck } from "react-icons/hi";
import { Modal } from "./Modal";
import { fetchVehicles } from "../../../services/vehicleService";
import { Vehicle } from "../../../types/Vehicle";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: FineFilter) => void;
  initialFilter: FineFilter;
}

export default function FineFilterModal({ isOpen, onClose, onApply, initialFilter }: Props) {
  const [localFilter, setLocalFilter] = useState<FineFilter>(initialFilter);
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);
  const [plateOptions, setPlateOptions] = useState<string[]>([]);

  useEffect(() => {
    setLocalFilter(initialFilter);

    setFromDate(
      initialFilter.fromDate
        ? new Date(new Date(initialFilter.fromDate).setHours(0, 0, 0, 0))
        : null
    );

    setToDate(
      initialFilter.toDate
        ? new Date(new Date(initialFilter.toDate).setHours(23, 59, 59, 999))
        : null
    );
  }, [initialFilter, isOpen]);

  useEffect(() => {
    if (isOpen) {
      fetchVehicles().then((vehicles : Vehicle[]) => {
        const plates = vehicles.map((v) => v.plateNumber).filter(Boolean);
        setPlateOptions(plates);
      });
    }
  }, [isOpen]);

  const handleApply = () => {
    onApply({
      ...localFilter,
      fromDate: fromDate ? fromDate.toISOString().split("T")[0] : undefined,
      toDate: toDate ? toDate.toISOString().split("T")[0] : undefined,
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Filter My Fines">
      <div className="w-full max-w-md px-6 py-6 sm:px-8 sm:py-8 space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-white">Plate Number</label>
          <Autocomplete
            options={plateOptions}
            value={localFilter.plateNumber || ""}
            onInputChange={(_, value) => setLocalFilter((prev) => ({ ...prev, plateNumber: value }))}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Type your plate..."
                variant="standard"
                InputProps={{
                  ...params.InputProps,
                  disableUnderline: true,
                  className:
                    "h-11 w-full rounded-lg border border-gray-200 bg-transparent py-2.5 px-4 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-white/30 dark:focus:border-brand-600",
                }}
              />
            )}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <DatePicker
              id="fromDate"
              label="From Date"
              mode="single"
              placeholder="dd/mm/yyyy"
              defaultDate={fromDate ?? undefined}
              onChange={(d) => setFromDate(d[0] || null)}
              maxDate={toDate ?? new Date()}
            />
          </div>
          <div className="space-y-2">
            <DatePicker
              id="toDate"
              label="To Date"
              mode="single"
              placeholder="dd/mm/yyyy"
              defaultDate={toDate ?? undefined}
              onChange={(d) => setToDate(d[0] || null)}
              minDate={fromDate ?? undefined}
              maxDate={new Date()}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button onClick={onClose} variant="outline" startIcon={<HiX />}>
            Cancel
          </Button>
          <Button onClick={handleApply} className="bg-blue-600 text-white hover:bg-blue-700" startIcon={<HiCheck />}>
            Apply
          </Button>
        </div>
      </div>
    </Modal>
  );
}
