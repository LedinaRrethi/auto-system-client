import { useEffect, useState, useMemo } from "react";
import { HiSearch, HiPlus } from "react-icons/hi";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../../components/ui/table";
import Pagination from "../../../components/ui/pagination/Pagination";
import Button from "../../../components/ui/button/Button";
import { Dropdown } from "../../../components/ui/dropdown/Dropdown";
import { DropdownItem } from "../../../components/ui/dropdown/DropdownItem";
import { getMyFines } from "../../../services/fineService";
import { FineTableItem } from "../../../types/Fine/FineResponse";
import { FineFilterValues } from "../../../types/Fine/FineFilterValues";

interface Props {
  onAdd: () => void;
  filters: FineFilterValues;
}

export default function FineRegistrationTable({ onAdd, filters }: Props) {
  const [fines, setFines] = useState<FineTableItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchFines = async () => {
      try {
        const data = await getMyFines(filters, currentPage, itemsPerPage);
        setFines(data);
      } catch (err) {
        console.error("Failed to fetch fines", err);
        setFines([]);
      }
    };
    fetchFines();
  }, [filters, currentPage]);

  const filteredFines = useMemo(() => {
    return fines.filter((f) =>
      f.plateNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [fines, searchTerm]);

  const totalPages = Math.ceil(filteredFines.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, filteredFines.length);

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
              className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-200 bg-transparent py-2.5 pl-10 pr-4 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-900 dark:text-white/90"
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
          <TableHeader>
            <TableRow>
              <TableCell isHeader>Plate</TableCell>
              <TableCell isHeader>Amount</TableCell>
              <TableCell isHeader>Date</TableCell>
              <TableCell isHeader>Reason</TableCell>
              <TableCell isHeader>Police</TableCell>
              <TableCell isHeader>Recipient</TableCell>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredFines.map((fine) => (
              <TableRow key={fine.idpk_Fine}>
                <TableCell>{fine.plateNumber}</TableCell>
                <TableCell>{fine.fineAmount} ALL</TableCell>
                <TableCell>{new Date(fine.fineDate).toLocaleDateString()}</TableCell>
                <TableCell>{fine.fineReason}</TableCell>
                <TableCell>{fine.policeFullName}</TableCell>
                <TableCell>{fine.recipientFullName ?? "-"}</TableCell>
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
        totalItems={filteredFines.length}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
