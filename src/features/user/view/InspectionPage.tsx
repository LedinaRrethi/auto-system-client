import { useState } from "react";
import { useInspectionForm } from "../hooks/useInspectionForm";
import ComponentCard from "../../../components/common/ComponentCard";
import InspectionRegistrationTable from "../components/InspectionRegistrationTable";
import InspectionRegistrationModal from "../components/InspectionRegistrationModal";
import PageMeta from "../../../components/common/PageMeta";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";

export default function InspectionPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    vehicles,
    directorates,
    handleSubmit,
    errorMsg,
    successMsg,
    setErrorMsg,
    setSuccessMsg,
  } = useInspectionForm(() => setIsModalOpen(false));

  const handleAddClick = () => {
    setIsModalOpen(true);
    setErrorMsg(null);
    setSuccessMsg(null);
  };

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
          errorMsg={errorMsg}
          successMsg={successMsg}
        />
      </div>
    </>
  );
}
