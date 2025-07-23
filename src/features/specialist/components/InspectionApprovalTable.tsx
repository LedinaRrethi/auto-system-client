import Badge from "../../../components/ui/badge/Badge";
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
      <div className="max-w-full overflow-x-auto"  style={{ height: "calc(100vh - 450px)" }}>
        <Table className="w-full min-w-[1000px]">
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              <TableCell isHeader className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                Plate
              </TableCell>
              <TableCell isHeader className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                Date
              </TableCell>
              <TableCell isHeader className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                Time
              </TableCell>
              <TableCell isHeader className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                Status
              </TableCell>
              <TableCell isHeader className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                Actions
              </TableCell>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {(inspections ?? []).map((item) => {
              const dateObj = new Date(item.requestedDate);  
              
              const formattedDate = dateObj.toLocaleDateString(undefined, {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
              });

              const formattedTime = dateObj.toLocaleTimeString(undefined, {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true,
              });

              return (
                <TableRow key={item.idpK_InspectionRequest}>
                  <TableCell className="px-5 py-4 text-sm text-gray-700 dark:text-white">
                    {item.plateNumber}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-sm text-gray-700 dark:text-white">
                    {formattedDate}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-sm text-gray-700 dark:text-white">
                    {formattedTime}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-sm text-gray-700 dark:text-white">
                    <Badge
                      size="sm"
                      color={
                        item.status === "Approved"
                          ? "success"
                          : item.status === "Rejected"
                          ? "error"
                          : "warning"
                      }
                    >
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-5 py-4 text-sm text-gray-700 dark:text-white">
                    <InspectionButtons request={item} onAction={onAction} />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
