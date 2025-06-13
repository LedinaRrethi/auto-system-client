import { useState } from "react";
import ComponentCard from "../../../components/common/ComponentCard";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import PageMeta from "../../../components/common/PageMeta";
import { VehicleInput } from "../../../utils/validations/vehicleSchema";
import VehicleRegistrationTable from "../components/VehicleRegistrationTable";
import VehicleRegistrationModal from "../components/VehicleRegistrationModal";

export default function VehicleRegistrationPage() {
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

    // Call API to request deletion
    // await api.post("/vehicle-request/delete", {
    //   vehicleId,
    // });

    console.log(`Delete request submitted for vehicle ID: ${vehicleId}`);

    // toast 
    alert("Delete request submitted for approval.");
  } catch (err) {
    alert("Failed to submit delete request.");
    console.error(err);
  }
};


  const handleSubmit = (data: VehicleInput, mode: "add" | "edit") => {
    console.log(`${mode.toUpperCase()} VEHICLE`, data);
    setIsModalOpen(false);
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
