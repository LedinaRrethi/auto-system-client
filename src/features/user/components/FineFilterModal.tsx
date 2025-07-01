import { useEffect, useState } from "react";
import { FineFilter } from "../../../types/Fine/FineFilter";
import DatePicker from "../../../components/form/date-picker";
import Button from "../../../components/ui/button/Button";
import { HiX, HiCheck } from "react-icons/hi";
import { Modal } from "./Modal";

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

  useEffect(() => {
    setLocalFilter(initialFilter);
    setFromDate(initialFilter.fromDate ? new Date(initialFilter.fromDate + "T00:00:00") : null);
    setToDate(initialFilter.toDate ? new Date(initialFilter.toDate + "T23:59:59") : null);
  }, [initialFilter, isOpen]);

  const handleApply = () => {
    const appliedFilter: FineFilter = {
      ...localFilter,
      fromDate: fromDate ? fromDate.toISOString().split("T")[0] : undefined,
      toDate: toDate ? toDate.toISOString().split("T")[0] : undefined,
    };

    onApply(appliedFilter);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Filter Fines">
      <div className="w-full max-w-md px-6 py-6 sm:px-8 sm:py-8 space-y-6">
        {/* Plate Number */}
        <div className="space-y-2">
          <label htmlFor="plateNumber" className="text-sm font-medium text-gray-700 dark:text-white">
            Plate Number
          </label>
          <input
            id="plateNumber"
            type="text"
            value={localFilter.plateNumber || ""}
            onChange={(e) => setLocalFilter((prev) => ({ ...prev, plateNumber: e.target.value }))}
            placeholder="Search by plate number"
            className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-300 dark:bg-gray-800 dark:text-white"
          />
        </div>

        {/* Date Range */}
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

        {/* Buttons */}
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