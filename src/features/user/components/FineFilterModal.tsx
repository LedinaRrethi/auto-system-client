import { useEffect, useRef, useState } from "react";
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

export default function FineFilterModal({
  isOpen,
  onClose,
  onApply,
  initialFilter,
}: Props) {
  const [localFilter, setLocalFilter] = useState<FineFilter>(initialFilter);
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);

  const fromDateRef = useRef<HTMLDivElement>(null);
  const toDateRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLocalFilter(initialFilter);
    setFromDate(
      initialFilter.fromDate ? new Date(initialFilter.fromDate) : null
    );
    setToDate(initialFilter.toDate ? new Date(initialFilter.toDate) : null);
  }, [initialFilter, isOpen]);

  const formatDate = (date: Date | null): string | undefined => {
    if (!date) return undefined;
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleApply = () => {
    const appliedFilter: FineFilter = {
      ...localFilter,
      fromDate: formatDate(fromDate),
      toDate: formatDate(toDate),
    };

    const noFiltersSet =
    !appliedFilter.plateNumber &&
    !appliedFilter.fromDate &&
    !appliedFilter.toDate;

  const filtersUnchanged =
    appliedFilter.plateNumber === (initialFilter.plateNumber ?? "") &&
    appliedFilter.fromDate === (initialFilter.fromDate ?? undefined) &&
    appliedFilter.toDate === (initialFilter.toDate ?? undefined);

  if (noFiltersSet || filtersUnchanged) {
    onClose(); 
    return;
  }

    onApply(appliedFilter);
    onClose();
  };

  const handleClear = () => {

    const noFiltersSet =
    !localFilter.plateNumber &&
    !localFilter.fromDate &&
    !localFilter.toDate &&
    !fromDate &&
    !toDate;

  if (noFiltersSet) {
    onClose(); 
    return;
  }

    const clearedFilter: FineFilter = {
      plateNumber: "",
      fromDate: undefined,
      toDate: undefined,
    };

    setLocalFilter(clearedFilter);
    setFromDate(null);
    setToDate(null);

    onApply(clearedFilter);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Filter Fines">
      <div className="w-full max-w-md mx-auto">
        <div className="flex-1 space-y-6">
          {/* Plate Number */}
          <div>
            <label
              htmlFor="plateNumber"
              className="text-sm font-medium text-gray-700 dark:text-white"
            >
              Plate Number
            </label>
            <input
              id="plateNumber"
              type="text"
              value={localFilter.plateNumber || ""}
              autoComplete="off"
              onChange={(e) =>
                setLocalFilter((prev) => ({
                  ...prev,
                  plateNumber: e.target.value,
                }))
              }
              placeholder="Search by plate number"
              className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-300 dark:bg-gray-800 dark:text-white"
            />
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-1 gap-5 ">
            <div ref={fromDateRef} className="z-99999">
              <DatePicker
                id="fromDate"
                label="From Date"
                mode="single"
                placeholder="dd/mm/yyyy"
                defaultDate={fromDate ?? undefined}
                onChange={(d) => setFromDate(d[0] || null)}
                maxDate={toDate ?? new Date()}
                onFocus={() =>
                  fromDateRef.current?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  })
                }
              />
            </div>
            <div ref={toDateRef} className="pb-20">
              <DatePicker
                id="toDate"
                label="To Date"
                mode="single"
                placeholder="dd/mm/yyyy"
                defaultDate={toDate ?? undefined}
                onChange={(d) => setToDate(d[0] || null)}
                minDate={fromDate ?? undefined}
                onFocus={() =>
                  toDateRef.current?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  })
                }
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6 pt-4 pb-4 border-t border-gray-200 dark:border-gray-700 ">
          <Button onClick={handleClear} variant="outline" startIcon={<HiX />}>
            Clear
          </Button>
          <Button
            onClick={handleApply}
            className="bg-blue-600 text-white hover:bg-blue-700"
            startIcon={<HiCheck />}
          >
            Apply
          </Button>
        </div>
      </div>
    </Modal>
  );
}
