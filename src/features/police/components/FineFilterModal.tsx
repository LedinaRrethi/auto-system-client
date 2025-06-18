import { Modal } from "../../../components/ui/modal";
import { FineFilter } from "../../../types/Fine/FineFilter";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import DatePicker from "../../../components/form/date-picker"; // i personalizuar
import Button from "../../../components/ui/button/Button";
import { useEffect, useState } from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: FineFilter) => void;
  plateOptions: string[];
  initialFilter: FineFilter;
}

export default function FineFilterModal({ isOpen, onClose, onApply, plateOptions, initialFilter }: Props) {
  const [localFilter, setLocalFilter] = useState<FineFilter>(initialFilter);
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);

  useEffect(() => {
    setLocalFilter(initialFilter);
    setFromDate(initialFilter.fromDate ? new Date(initialFilter.fromDate) : null);
    setToDate(initialFilter.toDate ? new Date(initialFilter.toDate) : null);
  }, [initialFilter, isOpen]);

  const handleApply = () => {
    onApply({
      ...localFilter,
      fromDate: fromDate ? fromDate.toISOString().split("T")[0] : undefined,
      toDate: toDate ? toDate.toISOString().split("T")[0] : undefined,
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Filter fines">
      <div className="p-6 space-y-4 w-[360px] sm:w-[400px]">
        <div>
          <Autocomplete
            options={plateOptions}
            value={localFilter.plateNumber || ""}
            onInputChange={(_, value) => setLocalFilter((prev) => ({ ...prev, plateNumber: value }))}
            renderInput={(params) => <TextField {...params} label="Plate number" variant="outlined" size="small" />}
          />
        </div>

        <div className="space-y-2">
          <DatePicker
            id="fromDate"
            label="From Date"
            mode="single"
            placeholder="dd/mm/yyyy"
            defaultDate={fromDate ?? undefined}
            onChange={(d) => setFromDate(d[0] || null)}
            maxDate={toDate ?? undefined}
          />

          <DatePicker
            id="toDate"
            label="To Date"
            mode="single"
            placeholder="dd/mm/yyyy"
            defaultDate={toDate ?? undefined}
            onChange={(d) => setToDate(d[0] || null)}
            minDate={fromDate ?? undefined}
          />
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button onClick={onClose} variant="outline">
            Cancel
          </Button>
          <Button onClick={handleApply} className="bg-blue-600 text-white hover:bg-blue-700">
            Apply
          </Button>
        </div>
      </div>
    </Modal>
  );
}
