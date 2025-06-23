import { useState } from "react";
import { Table, TableCell, TableHeader, TableRow, TableBody } from "../../../components/ui/table";
import Button from "../../../components/ui/button/Button";
import { HiPlus, HiSearch } from "react-icons/hi";
import { MyInspectionsRequest } from "../../../types/Inspection/MyInspectionsRequest";

interface Props {
  onAdd: () => void;
  inspections: MyInspectionsRequest[];
}

export default function InspectionRegistrationTable({ onAdd, inspections }: Props) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredInspections = inspections.filter((inspection) =>
    inspection.plateNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex gap-4 items-center w-full sm:w-auto flex-wrap">
          <div className="relative w-full sm:w-80">
            <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
            <input
              type="text"
              placeholder="Search ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-200 bg-transparent py-2.5 pl-10 pr-4 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
            />
          </div>
        </div>

        <Button
          startIcon={<HiPlus />}
          onClick={onAdd}
          className="bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600"
        >
          Add Inspection
        </Button>
      </div>

      <div className="max-w-full overflow-x-auto">
        <Table className="w-full min-w-[1000px]">
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              <TableCell isHeader className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Plate</TableCell>
              <TableCell isHeader className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Inspection Date</TableCell>
              <TableCell isHeader className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Directorate</TableCell>
              <TableCell isHeader className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Status</TableCell>
              <TableCell isHeader className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Comment</TableCell>
              <TableCell isHeader className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Documents</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {filteredInspections.map((item) => (
              <TableRow key={item.idpk_InspectionRequest}>
                <TableCell className="px-5 py-4 text-sm text-gray-700 dark:text-white">{item.plateNumber}</TableCell>
                <TableCell className="px-5 py-4 text-sm text-gray-700 dark:text-white">{new Date(item.requestedDate).toLocaleDateString()}</TableCell>
                <TableCell className="px-5 py-4 text-sm text-gray-700 dark:text-white">{item.directorateName}</TableCell>
                <TableCell className="px-5 py-4 text-sm text-gray-700 dark:text-white">{item.status}</TableCell>
                <TableCell className="px-5 py-4 text-sm text-gray-700 dark:text-white">{item.comment || "-"}</TableCell>
                <TableCell className="px-5 py-4 text-sm text-gray-700 dark:text-white">
                  {item.documents.length > 0
                    ? item.documents.map((doc) => doc.documentName).join(", ")
                    : "-"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
