import { HiDownload } from "react-icons/hi";
import {
  Table,
  TableCell,
  TableHeader,
  TableRow,
  TableBody,
} from "../../../components/ui/table";
import { MyInspectionsRequest } from "../../../types/Inspection/MyInspectionsRequest";
import { handleDownloadDocuments } from "../hooks/handleDownloadDocuments";

interface Props {
  inspections: MyInspectionsRequest[];
}

export default function InspectionRegistrationTable({ inspections }: Props) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <Table className="w-full min-w-[1000px]">
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              <TableCell
                isHeader
                className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400"
              >
                Plate
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400"
              >
                Inspection Date
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400"
              >
                Directory
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400"
              >
                Status
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400"
              >
                Comment
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400"
              >
                Documents
              </TableCell>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {inspections.map((item) => (
              <TableRow key={item.idpk_InspectionRequest}>
                <TableCell className="px-5 py-4 text-sm text-gray-700 dark:text-white">
                  {item.plateNumber}
                </TableCell>
                <TableCell className="px-5 py-4 text-sm text-gray-700 dark:text-white">
                  {new Date(item.requestedDate).toLocaleDateString()}
                </TableCell>
                <TableCell className="px-5 py-4 text-sm text-gray-700 dark:text-white">
                  {item.directorateName}
                </TableCell>
                <TableCell className="px-5 py-4 text-sm text-gray-700 dark:text-white">
                  {item.status}
                </TableCell>
                <TableCell className="px-5 py-4 text-sm text-gray-700 dark:text-white">
                  {item.comment || "-"}
                </TableCell>
                <TableCell className="px-5 py-4 text-sm text-gray-700 dark:text-white">
                  {item.documents && item.documents.length > 0 ? (
                    <button
                      onClick={() => handleDownloadDocuments(item.documents)}
                      className="flex items-center gap-1 text-blue-600 hover:underline"
                    >
                      <HiDownload className="w-4 h-4" />
                      Download
                    </button>
                  ) : (
                    "-"
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
