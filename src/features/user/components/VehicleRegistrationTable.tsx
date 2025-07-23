import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import Badge from "../../../components/ui/badge/Badge";
import { HiPencilAlt, HiTrash } from "react-icons/hi";
import { Vehicle } from "../../../types/Vehicle/Vehicle";

interface Props {
  vehicles: Vehicle[];
  onEdit: (vehicleId: string) => void;
  onDelete: (vehicle: Vehicle) => void;
}

export default function VehicleRegistrationTable({
  vehicles,
  onEdit,
  onDelete,
}: Props) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto" style={{ height: "calc(100vh - 450px)" }}>
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
                Color
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400"
              >
                Seats
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400"
              >
                Doors
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400"
              >
                Chassis
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
                Actions
              </TableCell>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {vehicles.map((vehicle) => (
              <TableRow key={vehicle.idpK_Vehicle}>
                <TableCell className="px-5 py-4 text-sm text-gray-700 dark:text-white">
                  {vehicle.plateNumber}
                </TableCell>
                <TableCell className="px-5 py-4 text-sm text-gray-700 dark:text-white">
                  {vehicle.color}
                </TableCell>
                <TableCell className="px-5 py-4 text-sm text-gray-700 dark:text-white">
                  {vehicle.seatCount}
                </TableCell>
                <TableCell className="px-5 py-4 text-sm text-gray-700 dark:text-white">
                  {vehicle.doorCount}
                </TableCell>
                <TableCell className="px-5 py-4 text-sm text-gray-700 dark:text-white">
                  {vehicle.chassisNumber}
                </TableCell>
                <TableCell className="px-5 py-4 text-sm">
                  <Badge
                    size="sm"
                    color={
                      vehicle.status === "Approved"
                        ? "success"
                        : vehicle.status === "Rejected"
                        ? "error"
                        : "warning"
                    }
                  >
                    {vehicle.status}
                  </Badge>
                </TableCell>
                <TableCell className="px-5 py-4 text-sm text-gray-700 dark:text-white text-center">
                  {vehicle.approvalComment?.trim()
                    ? vehicle.approvalComment
                    : "-"}
                </TableCell>

                <TableCell className="px-5 py-4 text-sm text-left">
                  <div className="flex items-center gap-3">
                    <button
                      title="Edit"
                      onClick={() => onEdit(vehicle.idpK_Vehicle)}
                      className="text-blue-600 hover:text-blue-800 text-xl"
                    >
                      <HiPencilAlt />
                    </button>
                    <button
                      title="Delete"
                      onClick={() => onDelete(vehicle)}
                      className="text-red-600 hover:text-red-800 text-xl"
                    >
                      <HiTrash />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
