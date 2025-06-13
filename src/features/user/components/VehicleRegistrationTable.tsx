import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../../components/ui/table";
import Badge from "../../../components/ui/badge/Badge";
import { HiPencilAlt, HiTrash, HiSearch, HiPlus } from "react-icons/hi";
import Pagination from "../../../components/ui/pagination/Pagination";
import Button from "../../../components/ui/button/Button";
import { Dropdown } from "../../../components/ui/dropdown/Dropdown";
import { DropdownItem } from "../../../components/ui/dropdown/DropdownItem";
import { useState, useMemo } from "react";
import { Vehicle } from "../../../types/Vehicle";
import { VehicleInput } from "../../../utils/validations/vehicleSchema";

interface Props {
  onAdd: () => void;
  onEdit: (vehicle: VehicleInput) => void;
  onDelete: (vehicleId: string) => Promise<void>;
}

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

export default function VehicleRegistrationTable({ onAdd, onEdit }: Props) {
  const [vehicles, setVehicles] = useState<Vehicle[]>(vehicleData);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [orderByAsc, setOrderByAsc] = useState(false);
  const itemsPerPage = 5;
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const filteredVehicles = useMemo(() => {
    const sorted = [...vehicles].sort((a, b) => {
      const dateA = new Date(a.registrationDate).getTime();
      const dateB = new Date(b.registrationDate).getTime();
      return orderByAsc ? dateA - dateB : dateB - dateA;
    });

    return sorted.filter((v) => {
      const searchMatch =
        v.plateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.chassisNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.color.toLowerCase().includes(searchTerm.toLowerCase());
      const statusMatch = statusFilter ? v.status === statusFilter : true;
      return searchMatch && statusMatch;
    });
  }, [vehicles, searchTerm, statusFilter, orderByAsc]);

  const paginatedVehicles = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredVehicles.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredVehicles, currentPage]);

  const totalPages = Math.ceil(filteredVehicles.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, filteredVehicles.length);

  const handleEdit = (id: string) => {
    const vehicle = vehicles.find((v) => v.id === id);
    if (vehicle) {
      const { plateNumber, color, seatCount, doorCount, chassisNumber } = vehicle;
      onEdit({ plateNumber, color, seatCount, doorCount, chassisNumber });
    }
  };

  const handleDelete = (id: string) => {
    setVehicles((prev) => prev.filter((v) => v.id !== id));
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex gap-4 items-center w-full sm:w-auto flex-wrap">
          <div className="relative w-full sm:w-80">
            <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
            <input
              type="text"
              placeholder="Search by plate, color, chassis..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-200 bg-transparent py-2.5 pl-10 pr-4 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-900 dark:bg-white/[0.03] dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-11 rounded-lg border border-gray-200 bg-white text-sm text-gray-700 dark:border-gray-800 dark:bg-gray-800 dark:text-white px-4"
          >
            <option className="text-black dark:text-white bg-white dark:bg-gray-800" value="">
              All Statuses
            </option>
            <option className="text-black dark:text-white bg-white dark:bg-gray-800" value="Approved">
              Approved
            </option>
            <option className="text-black dark:text-white bg-white dark:bg-gray-800" value="Pending">
              Pending
            </option>
            <option className="text-black dark:text-white bg-white dark:bg-gray-800" value="Rejected">
              Rejected
            </option>
          </select>

          <Button variant="outline" onClick={() => setOrderByAsc(!orderByAsc)}>
            Order by Date {orderByAsc ? "↑" : "↓"}
          </Button>
        </div>

        <div className="relative">
          <Button
            startIcon={<HiPlus />}
            onClick={onAdd}
            className="bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            Add Vehicle
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
              <TableCell isHeader className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                Plate
              </TableCell>
              <TableCell isHeader className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                Color
              </TableCell>
              <TableCell isHeader className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                Seats
              </TableCell>
              <TableCell isHeader className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                Doors
              </TableCell>
              <TableCell isHeader className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                Chassis
              </TableCell>
              <TableCell isHeader className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                Status
              </TableCell>
              <TableCell isHeader className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                Registered
              </TableCell>
              <TableCell isHeader className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                Actions
              </TableCell>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {paginatedVehicles.map((vehicle) => (
              <TableRow key={vehicle.id}>
                <TableCell className="px-5 py-4 text-sm text-gray-700 dark:text-white">{vehicle.plateNumber}</TableCell>
                <TableCell className="px-5 py-4 text-sm text-gray-700 dark:text-white">{vehicle.color}</TableCell>
                <TableCell className="px-5 py-4 text-sm text-gray-700 dark:text-white">{vehicle.seatCount}</TableCell>
                <TableCell className="px-5 py-4 text-sm text-gray-700 dark:text-white">{vehicle.doorCount}</TableCell>
                <TableCell className="px-5 py-4 text-sm text-gray-700 dark:text-white">
                  {vehicle.chassisNumber}
                </TableCell>
                <TableCell className="px-5 py-4 text-sm">
                  <Badge
                    size="sm"
                    color={
                      vehicle.status === "Approved" ? "success" : vehicle.status === "Rejected" ? "error" : "warning"
                    }
                  >
                    {vehicle.status === "Approved" ? "Approved" : vehicle.status === "Pending" ? "Pending" : "Rejected"}
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

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        startIndex={startIndex}
        endIndex={endIndex}
        totalItems={filteredVehicles.length}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
