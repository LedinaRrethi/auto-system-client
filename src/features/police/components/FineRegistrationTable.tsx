import { useEffect, useState } from "react";
import { HiPlus, HiSearch } from "react-icons/hi";
import { Table, TableBody, TableCell, TableHeader, TableRow,} from "../../../components/ui/table";
import Pagination from "../../../components/ui/pagination/Pagination";
import Button from "../../../components/ui/button/Button";
import { Dropdown } from "../../../components/ui/dropdown/Dropdown";
import { DropdownItem } from "../../../components/ui/dropdown/DropdownItem";
import { getPoliceFines } from "../../../services/fineService";
import { FineResponse } from "../../../types/Fine/FineResponse";
import { FineFilter } from "../../../types/Fine/FineFilter";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

interface Props {
  onAdd: () => void;
  filters: FineFilter;
  onFilterChange: (f: FineFilter) => void;
}

export default function FineRegistrationTable({ onAdd, filters, onFilterChange }: Props) {
  const [fines, setFines] = useState<FineResponse[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [searchTerm, setSearchTerm] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [plateOptions, setPlateOptions] = useState<string[]>([]);

  useEffect(() => {
    const fetchFines = async () => {
      try {
        const data = await getPoliceFines(filters, currentPage, itemsPerPage);
        setFines(data.items);
        const uniquePlates = [...new Set(data.items.map((f) => f.plateNumber))].filter((plate): plate is string => typeof plate === "string");
        setPlateOptions(uniquePlates);
      } catch {
        setFines([]);
      }
    };

    fetchFines();
  }, [filters, currentPage]);

  const totalPages = Math.ceil(fines.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, fines.length);

  return (
     <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex gap-4 items-center w-full sm:w-auto flex-wrap">
          <div className="relative w-full sm:w-80">
            <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
            <input
              type="text"
              placeholder="Search by plate..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-200 bg-transparent py-2.5 pl-10 pr-4 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-900 dark:bg-white/[0.03] dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
            />
          </div>
          <div className="w-64">
            <Autocomplete
            options={plateOptions}
            value={filters.plateNumber || ""}
            onInputChange={(_, value) => {
              onFilterChange({ ...filters, plateNumber: value });
            }}
            renderInput={(params) => (
              <TextField {...params} label="Filter by plate" variant="outlined" size="small" />
            )}
          />
          </div>
          
        </div>

        <div className="relative">
          <Button
            startIcon={<HiPlus />}
            onClick={onAdd}
            className="bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            Add Fine
          </Button>

          <Dropdown isOpen={dropdownOpen} onClose={() => setDropdownOpen(false)}>
            <DropdownItem onClick={() => alert("Coming soon")}>Settings</DropdownItem>
            <DropdownItem onClick={() => alert("Coming soon")}>Export</DropdownItem>
          </Dropdown>
        </div>
      </div>

      <div className="max-w-full overflow-x-auto">
        <Table className="w-full min-w-[1000px]">
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
               <TableCell className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Plate</TableCell>
               <TableCell className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Recipient</TableCell>
               <TableCell className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Amount</TableCell>
               <TableCell className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Reason</TableCell>
               <TableCell className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Date</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fines.map((fine) => (
              <TableRow key={fine.idpk_Fine}>
                 <TableCell className="px-5 py-4 text-sm text-gray-700 dark:text-white">{fine.plateNumber}</TableCell>
                 <TableCell className="px-5 py-4 text-sm text-gray-700 dark:text-white">{fine.recipientFullName ?? "-"}</TableCell>
                 <TableCell className="px-5 py-4 text-sm text-gray-700 dark:text-white">{fine.fineAmount} ALL</TableCell>
                 <TableCell className="px-5 py-4 text-sm text-gray-700 dark:text-white">{fine.fineReason ?? "-"}</TableCell>
                 <TableCell className="px-5 py-4 text-sm text-gray-700 dark:text-white">{new Date(fine.fineDate).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        startIndex={startIndex}
        endIndex={endIndex}
        totalItems={fines.length}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
