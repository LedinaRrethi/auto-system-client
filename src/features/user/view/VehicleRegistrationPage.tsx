import { useState } from "react";
import ComponentCard from "../../../components/common/ComponentCard";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import PageMeta from "../../../components/common/PageMeta";
import { VehicleInput } from "../../../utils/validations/vehicleSchema";
import VehicleRegistrationTable from "../components/VehicleRegistrationTable";
import VehicleRegistrationModal from "../components/VehicleRegistrationModal";
import { deleteVehicle, fetchVehicles, registerVehicle, updateVehicle } from "../../../services/vehicleService";
import { Vehicle } from "../../../types/Vehicle";

export default function VehicleRegistrationPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState<VehicleInput | null>(null);
  const [mode, setMode] = useState<"add" | "edit">("add");


  const handleAddClick = () => {
    setEditData(null);
    setMode("add");
    setIsModalOpen(true);
  };

   const handleEditClick = (vehicle: VehicleInput) => {
    setEditData(vehicle);
    setMode("edit");
    setIsModalOpen(true);
  };

   const handleDeleteClick = async (vehicleId: string) => {
    try {
      const confirm = window.confirm("Are you sure you want to request to delete this vehicle?");
      if (!confirm) return;
      await deleteVehicle(vehicleId);
      alert("Delete request submitted.");
      setVehicles((prev) => prev.filter((v) => v.idpk_Vehicle !== vehicleId));
    } catch (err) {
      alert("Failed to submit delete request.");
      console.error(err);
    }
  };


 const handleSubmit = async (data: VehicleInput, mode: "add" | "edit") => {
    try {
      if (mode === "add") {
        await registerVehicle(data);
        alert("Vehicle registration request submitted.");
      } else {
        const vehicleToUpdate = vehicles.find((v) => v.plateNumber === data.plateNumber);
        if (!vehicleToUpdate) return alert("Vehicle not found.");
        await updateVehicle(vehicleToUpdate.idpk_Vehicle, data);
        alert("Update request submitted.");
      }

      const updated = await fetchVehicles();
      setVehicles(updated);
      setIsModalOpen(false);
    } catch (err) {
      alert("Submission failed.");
      console.error(err);
    }
  };



  return (
    <>
      <PageMeta
        title="Vehicle Registration | AutoSystem"
        description="Manage and monitor the vehicles registered by individual users."
      />
      <PageBreadcrumb pageTitle="Vehicle Registration" />

      <div className="space-y-6">
        <ComponentCard
          title="Registered Vehicles"
          desc="Here you can view, edit, or delete your registered vehicles. Only approved vehicles are considered valid."
        >
          <VehicleRegistrationTable onAdd={handleAddClick} onEdit={handleEditClick} onDelete={handleDeleteClick} />
        </ComponentCard>

        <VehicleRegistrationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmit}
          initialValues={editData ?? undefined}
          mode={mode}
        />
      </div>
    </>
  );
}

