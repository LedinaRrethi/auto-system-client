import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../../components/ui/table";
import Badge from "../../../components/ui/badge/Badge";
import { VehicleRequestList } from "../../../types/Vehicle/VehicleRequestList";
import VehicleRequestActionButtons from "./VehicleRequestActionButtons";

interface Props {
  vehicles: VehicleRequestList[];
  onAction: (vehicle: VehicleRequestList, action: "approve" | "reject") => void;
}

export default function VehicleRequestApprovalTable({ vehicles, onAction }: Props) {
  return (
    <div className="max-w-full overflow-x-auto"  style={{ height: "calc(100vh - 450px)" }}>
      <Table className="w-full min-w-[1000px]">
        <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
          <TableRow>
            <TableCell className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
              Plate
            </TableCell>
            <TableCell className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
              Request Type
            </TableCell>
            <TableCell className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
              Current
            </TableCell>
            <TableCell className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
              Requested
            </TableCell>
            <TableCell className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
              Status
            </TableCell>
            <TableCell className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
              Date
            </TableCell>
            <TableCell className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
              Actions
            </TableCell>
          </TableRow>
        </TableHeader>

        <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
          {vehicles.map((vehicle) => (
            <TableRow key={vehicle.idpK_ChangeRequest}>
              <TableCell className="px-5 py-4 text-sm text-gray-700 dark:text-white">
                {vehicle.plateNumber ?? "—"}
              </TableCell>

              <TableCell className="px-5 py-4 text-sm text-gray-700 dark:text-white">{vehicle.requestType}</TableCell>
             
              <TableCell className="px-5 py-4 text-sm text-gray-700 dark:text-white">
                {vehicle.currentDataSnapshotJson && vehicle.currentDataSnapshotJson !== "null"
                  ? (() => {
                      try {
                        const current = JSON.parse(vehicle.currentDataSnapshotJson);
                        return (
                          <>
                            <div>
                              <strong>Plate:</strong> {current.PlateNumber}
                            </div>
                            <div>
                              <strong>Color:</strong> {current.Color}
                            </div>
                          </>
                        );
                      } catch {
                        return "Invalid data";
                      }
                    })()
                  : "—"}
              </TableCell>

              <TableCell className="px-5 py-4 text-sm text-gray-700 dark:text-white">
                {vehicle.requestDataJson && vehicle.requestDataJson !== "null"
                  ? (() => {
                      try {
                        const requested = JSON.parse(vehicle.requestDataJson);
                        return (
                          <>
                            <div>
                              <strong>Plate:</strong> {requested.PlateNumber}
                            </div>
                            <div>
                              <strong>Color:</strong> {requested.Color}
                            </div>
                          </>
                        );
                      } catch {
                        return "Invalid data";
                      }
                    })()
                  : "—"}
              </TableCell>

              <TableCell className="px-5 py-4 text-sm">
                <Badge
                  size="sm"
                  color={
                    vehicle.status === "Approved" ? "success" : vehicle.status === "Rejected" ? "error" : "warning"
                  }
                >
                  {vehicle.status}
                </Badge>
              </TableCell>

              <TableCell className="px-5 py-4 text-sm text-gray-600 dark:text-gray-300">
                {vehicle.createdOn ? new Date(vehicle.createdOn).toLocaleDateString() : "—"}
              </TableCell>

              <TableCell className="px-5 py-4 text-sm text-left">
                <div className="flex items-center gap-3">
                  <VehicleRequestActionButtons vehicle={vehicle} onAction={onAction} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
