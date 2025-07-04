import { useCallback, useEffect, useState } from "react";
import ComponentCard from "../../../components/common/ComponentCard";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import PageMeta from "../../../components/common/PageMeta";
import Alert from "../../../components/ui/alert/Alert";
import Pagination from "../../../components/ui/pagination/Pagination";
import { VehicleInput } from "../../../utils/validations/vehicleSchema";
import VehicleRegistrationTable from "../components/VehicleRegistrationTable";
import VehicleRegistrationModal from "../components/VehicleRegistrationModal";
import {
  deleteVehicle,
  fetchVehicleById,
  fetchVehicles,
  registerVehicle,
  updateVehicle,
} from "../../../services/vehicleService";
import { PaginatedResponse } from "../../../types/PaginatedResponse";
import Button from "../../../components/ui/button/Button";
import { HiPlus, HiSearch } from "react-icons/hi";
import { Vehicle } from "../../../types/Vehicle/Vehicle";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";

export default function VehicleRegistrationPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState<VehicleInput | null>(null);
  const [mode, setMode] = useState<"add" | "edit">("add");
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [infoMsg, setInfoMsg] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(5);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [submittedSearch, setSubmittedSearch] = useState("");

  const [vehicleIdToEdit, setVehicleIdToEdit] = useState<string | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState<Vehicle | null>(null);

  const loadVehicles = useCallback(async () => {
  try {
    const response: PaginatedResponse<Vehicle> = await fetchVehicles({
      page,
      pageSize,
      search: submittedSearch,
    });
    setVehicles(response.items);
    setHasNextPage(response.hasNextPage);
    if (response.items.length === 0) {
      setInfoMsg("You have no vehicle requests.");
    } else {
      setInfoMsg(null);
    }
  } catch {
    setErrorMsg("Failed to load vehicle requests.");
  }
}, [page, pageSize, submittedSearch]);

useEffect(() => {
  loadVehicles();
}, [loadVehicles]);

  const handleAddClick = () => {
    setEditData(null);
    setVehicleIdToEdit(null);
    setMode("add");
    setIsModalOpen(true);
    setSuccessMsg(null);
    setErrorMsg(null);
  };

  const handleEditClick = async (vehicleId: string) => {
    if (!vehicleId) {
      setErrorMsg("Invalid vehicle ID.");
      return;
    }

    try {
      const vehicle = await fetchVehicleById(vehicleId);
      setEditData({
        plateNumber: "",
        color: "",
        seatCount: vehicle.seatCount,
        doorCount: vehicle.doorCount,
        chassisNumber: vehicle.chassisNumber,
      });
      setVehicleIdToEdit(vehicleId);
      setMode("edit");
      setIsModalOpen(true);
    } catch (err) {
      setErrorMsg("Failed to load vehicle data.");
      console.error(err);
    }
  };

  const handleDeleteClick = (vehicle: Vehicle) => {
    setVehicleToDelete(vehicle);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!vehicleToDelete) return;

    try {
      await deleteVehicle(vehicleToDelete.idpK_Vehicle);
      setSuccessMsg("Delete request sent to administrator for approval.");
      await loadVehicles();
    } catch (err) {
      setErrorMsg("Failed to submit delete request.");
      console.error(err);
    }
  };

  const handleSubmit = async (data: VehicleInput, mode: "add" | "edit") => {
    try {
      if (mode === "add") {
        await registerVehicle(data);
        setSuccessMsg("Vehicle registration request sent to administrator.");
      } else {
        if (!vehicleIdToEdit) {
          setErrorMsg("Missing vehicle ID for update.");
          return;
        }

        await updateVehicle(vehicleIdToEdit, {
          plateNumber: data.plateNumber,
          color: data.color,
          seatCount: data.seatCount,
          doorCount: data.doorCount,
          chassisNumber: data.chassisNumber,
        });

        setSuccessMsg("Update request sent to administrator for approval.");
      }

      await loadVehicles();
      setIsModalOpen(false);
      setVehicleIdToEdit(null);
    } catch (err) {
      setErrorMsg("Submission failed.");
      console.error(err);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSuccessMsg(null);
      setErrorMsg(null);
      setInfoMsg(null);
    }, 3000);
    return () => clearTimeout(timeout);
  }, [successMsg, errorMsg]);

  return (
    <>
      <PageMeta
        title="Vehicle Registration | AutoSystem"
        description="Manage and request registration, updates, or deletions for your vehicles."
      />
      <PageBreadcrumb pageTitle="Vehicle Registration" />

      <div className="space-y-6">
        {successMsg && (
          <Alert variant="success" title="Success" message={successMsg} />
        )}
        {errorMsg && <Alert variant="error" title="Error" message={errorMsg} />}
        {infoMsg && <Alert variant="info" title="Info" message={infoMsg} />}

        <ComponentCard
          title="Vehicle Requests"
          desc="View and manage your submitted vehicle requests."
        >
          <div className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
              <input
                type="text"
                placeholder="Search by plate number"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setSubmittedSearch(searchTerm);
                    setPage(1);
                  }
                }}
                className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-200 bg-transparent py-2.5 pl-10 pr-4 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
              />
            </div>
            <Button
              startIcon={<HiPlus />}
              onClick={handleAddClick}
              className="bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              Add Vehicle
            </Button>
          </div>

          <VehicleRegistrationTable
            vehicles={vehicles}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
          />
          <Pagination
            currentPage={page}
            hasNextPage={hasNextPage}
            onPageChange={setPage}
          />
        </ComponentCard>

        <VehicleRegistrationModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setVehicleIdToEdit(null);
          }}
          onSubmit={handleSubmit}
          initialValues={editData ?? undefined}
          mode={mode}
        />

        <ConfirmDeleteModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={confirmDelete}
          plateNumber={vehicleToDelete?.plateNumber}
        />
      </div>
    </>
  );
}
