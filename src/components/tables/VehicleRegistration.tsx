
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import Badge from "../../components/ui/badge/Badge";
import { HiPencilAlt, HiTrash } from "react-icons/hi";
import { Vehicle } from "../../types/Vehicle";
import { useState, useMemo } from "react";

const vehicleData: Vehicle[] = [
  {
    id: "1",
    plateNumber: "AC630BM",
    color: "Black",
    seatCount: 8,
    doorCount: 4,
    chassisNumber: "SHS123456789",
    status: "Approved",
    registrationDate: "2024-12-01",
  },
  {
    id: "2",
    plateNumber: "BB321CC",
    color: "Red",
    seatCount: 4,
    doorCount: 4,
    chassisNumber: "XYZ987654321",
    status: "Pending",
    registrationDate: "2025-02-15",
  },
];

export default function VehicleTable() {
  const [vehicles, setVehicles] = useState<Vehicle[]>(vehicleData);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredVehicles = useMemo(() => {
    return vehicles
      .filter((v) => {
        const searchMatch =
          v.plateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          v.chassisNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          v.color.toLowerCase().includes(searchTerm.toLowerCase());
        const statusMatch = statusFilter ? v.status === statusFilter : true;
        return searchMatch && statusMatch;
      })
      .sort((a, b) => new Date(b.registrationDate).getTime() - new Date(a.registrationDate).getTime());
  }, [vehicles, searchTerm, statusFilter]);

  const paginatedVehicles = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredVehicles.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredVehicles, currentPage]);

  const totalPages = Math.ceil(filteredVehicles.length / itemsPerPage);

  const handleEdit = (id: string) => {
    console.log("Edit vehicle:", id);
  };

  const handleDelete = (id: string) => {
    setVehicles((prev) => prev.filter((v) => v.id !== id));
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <input
          type="text"
          placeholder="Search by plate, color, chassis..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="dark:bg-dark-900 h-11 w-full sm:w-80 rounded-lg border border-gray-200 bg-transparent py-2.5 pl-4 pr-4 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-900 dark:bg-white/[0.03] dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-11 w-full sm:w-52 rounded-lg border border-gray-200 bg-white dark:bg-white/[0.03] text-sm text-gray-700 dark:text-white dark:border-gray-800 px-4"
        >
          <option value="">All Statuses</option>
          <option value="Approved">Approved</option>
          <option value="Pending">Pending</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>
      <div className="max-w-full overflow-x-auto">
        <Table className="w-full min-w-[1000px]">
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              <TableCell isHeader className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Plate</TableCell>
              <TableCell isHeader className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Color</TableCell>
              <TableCell isHeader className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Seats</TableCell>
              <TableCell isHeader className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Doors</TableCell>
              <TableCell isHeader className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Chassis</TableCell>
              <TableCell isHeader className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Status</TableCell>
              <TableCell isHeader className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Registered</TableCell>
              <TableCell isHeader className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Actions</TableCell>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {paginatedVehicles.map((vehicle) => (
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
                <TableCell className="px-5 py-4 text-sm text-gray-600 dark:text-gray-300">
                  {new Date(vehicle.registrationDate).toLocaleDateString()}
                </TableCell>
                <TableCell className="px-5 py-4 text-sm text-left">
                  <div className="flex items-center gap-3">
                    <button
                      title="Edit"
                      onClick={() => handleEdit(vehicle.id)}
                      className="text-blue-600 hover:text-blue-800 text-xl"
                    >
                      <HiPencilAlt />
                    </button>
                    <button
                      title="Delete"
                      onClick={() => handleDelete(vehicle.id)}
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

      <div className="flex justify-center mt-6">
        <div className="inline-flex space-x-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium border ${
                page === currentPage
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-600 border-gray-300 hover:bg-gray-100"
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}