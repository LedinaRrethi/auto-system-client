// VehicleTable.tsx
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import Badge from "../../components/ui/badge/Badge";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Vehicle } from "../../types/Vehicle";
import { useState } from "react";

const vehicleData: Vehicle[] = [
  {
    id: "1",
    plateNumber: "AC630BM",
    color: "Black",
    seatCount: 8,
    doorCount: 4,
    chassisNumber: "SHS123456789",
    status: "Approved",
  },
  {
    id: "2",
    plateNumber: "BB321CC",
    color: "Red",
    seatCount: 4,
    doorCount: 4,
    chassisNumber: "XYZ987654321",
    status: "Pending",
  },
];

export default function VehicleTable() {
  const [vehicles, setVehicles] = useState<Vehicle[]>(vehicleData);

  const handleEdit = (id: string) => {
    console.log("Edit vehicle:", id);
  };

  const handleDelete = (id: string) => {
    setVehicles((prev) => prev.filter((v) => v.id !== id));
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <Table className="w-full min-w-[800px]">
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              <TableCell isHeader className="px-5 py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-400">
                Plate
              </TableCell>
              <TableCell isHeader className="px-5 py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-400">
                Color
              </TableCell>
              <TableCell isHeader className="px-5 py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-400">
                Seats
              </TableCell>
              <TableCell isHeader className="px-5 py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-400">
                Doors
              </TableCell>
              <TableCell isHeader className="px-5 py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-400">
                Chassis
              </TableCell>
              <TableCell isHeader className="px-5 py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-400">
                Status
              </TableCell>
              <TableCell isHeader className="px-5 py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-400">
                Actions
              </TableCell>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {vehicles.map((vehicle) => (
              <TableRow key={vehicle.id}>
                <TableCell className="px-5 py-4 text-sm text-gray-700 dark:text-white">{vehicle.plateNumber}</TableCell>
                <TableCell className="px-5 py-4 text-sm text-gray-700 dark:text-white">{vehicle.color}</TableCell>
                <TableCell className="px-5 py-4 text-sm text-gray-700 dark:text-white">{vehicle.seatCount}</TableCell>
                <TableCell className="px-5 py-4 text-sm text-gray-700 dark:text-white">{vehicle.doorCount}</TableCell>
                <TableCell className="px-5 py-4 text-sm text-gray-700 dark:text-white">{vehicle.chassisNumber}</TableCell>
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
                <TableCell className="px-5 py-4 text-sm">
                  <div className="flex items-center gap-4">
                    <button
                      title="Edit"
                      onClick={() => handleEdit(vehicle.id)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <FaEdit />
                    </button>
                    <button
                      title="Delete"
                      onClick={() => handleDelete(vehicle.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <FaTrash />
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
