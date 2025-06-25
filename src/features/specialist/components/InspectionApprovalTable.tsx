import {
  Table,
  TableCell,
  TableHeader,
  TableRow,
  TableBody,
} from "../../../components/ui/table";
import { InspectionRequestList } from "../../../types/InspectionApproval/InspectionList";
import InspectionButtons from "./InspectionButtons";

interface Props {
  inspections: InspectionRequestList[];
  onAction: (
    inspection: InspectionRequestList,
    action: "approve" | "reject"
  ) => void;
}

export default function InspectionApprovalTable({
  inspections,
  onAction,
}: Props) {
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
                Date
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400"
              >
                Time
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
                Actions
              </TableCell>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {(inspections ?? []).map((item) => (
              <TableRow key={item.idpK_InspectionRequest}>
                <TableCell className="px-5 py-4 text-sm text-gray-700 dark:text-white">
                  {item.plateNumber}
                </TableCell>
                <TableCell className="px-5 py-4 text-sm text-gray-700 dark:text-white">
                  {item.inspectionDate}
                </TableCell>
                <TableCell className="px-5 py-4 text-sm text-gray-700 dark:text-white">
                  {item.inspectionTime}
                </TableCell>
                <TableCell className="px-5 py-4 text-sm text-gray-700 dark:text-white">
                  {item.status}
                </TableCell>

                <TableCell className="px-5 py-4 text-sm text-gray-700 dark:text-white">
                  <InspectionButtons request={item} onAction={onAction} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
