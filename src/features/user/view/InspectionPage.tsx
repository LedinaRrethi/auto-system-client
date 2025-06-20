import { useState } from "react";
import ComponentCard from "../../../components/common/ComponentCard";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import PageMeta from "../../../components/common/PageMeta";
import InspectionRegistrationTable from "../components/InspectionRegistrationTable";
import InspectionRegistrationModal from "../components/InspectionRegistrationModal";
import { InspectionRequestInput } from "../../../utils/validations/inspectionRequestSchema";

export default function InspectionPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddClick = () => {
    setIsModalOpen(true);
  };

  const handleSubmit = (data: InspectionRequestInput) => {
    console.log("Submitted Inspection:", data);
    setIsModalOpen(false);
  };

  const vehicles = [
    { id: "1", plateNumber: "AA111AA" },
    { id: "2", plateNumber: "BB222BB" },
  ];

  const directorates = [
    { id: "1", name: "Tirana Directorate" },
    { id: "2", name: "Durres Directorate" },
  ];

  return (
    <>
      <PageMeta
        title="Vehicle Inspections | AutoSystem"
        description="Manage and schedule vehicle inspections."
      />
      <PageBreadcrumb pageTitle="Vehicle Inspections" />

      <div className="space-y-6">
        <ComponentCard
          title="Inspections"
          desc="Here you can view and manage your vehicle inspections."
        >
          <InspectionRegistrationTable onAdd={handleAddClick} />
        </ComponentCard>

        <InspectionRegistrationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmit}
          vehicles={vehicles}
          directorates={directorates}
        />
      </div>
    </>
  );
}
