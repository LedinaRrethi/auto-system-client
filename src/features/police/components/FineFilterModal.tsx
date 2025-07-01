import { useEffect, useState } from "react";
import { FineFilter } from "../../../types/Fine/FineFilter";
import DatePicker from "../../../components/form/date-picker";
import Button from "../../../components/ui/button/Button";
import { HiX, HiCheck } from "react-icons/hi";
import { Modal } from "./Modal";
import Select from "../../../components/form/Select";

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
    setFromDate(initialFilter.fromDate ? new Date(initialFilter.fromDate + "T00:00:00") : null);
    setToDate(initialFilter.toDate ? new Date(initialFilter.toDate + "T23:59:59") : null);
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
    <Modal isOpen={isOpen} onClose={onClose} title="Filter Fines">
      <div className="w-full max-w-md px-6 py-6 sm:px-8 sm:py-8 space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-white">Plate Number</label>
          <Select
            options={plateOptions.map((plate) => ({ value: plate, label: plate }))}
            value={localFilter.plateNumber || ""}
            onChange={(value) => setLocalFilter((prev) => ({ ...prev, plateNumber: value }))}
            placeholder="Select plate number"
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
