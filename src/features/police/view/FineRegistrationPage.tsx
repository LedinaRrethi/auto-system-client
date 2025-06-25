import { useState } from "react";
import ComponentCard from "../../../components/common/ComponentCard";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import PageMeta from "../../../components/common/PageMeta";
import FineRegistrationTable from "../components/FineRegistrationTable";
import FineRegistrationModal from "../components/FineRegistrationModal";
import { FineFilter } from "../../../types/Fine/FineFilter";
import { FineCreate } from "../../../types/Fine/FineCreate";
import { createFine } from "../../../services/fineService";

export default function FineRegistrationPage() {
  const [filters, setFilters] = useState<FineFilter>({} as FineFilter);
  const [modalOpen, setModalOpen] = useState(false);

  const handleAddClick = () => {
    setModalOpen(true);
  };

  const handleModalSubmit = async (data: FineCreate): Promise<boolean> => {
    try {
      await createFine(data);
      setModalOpen(false);
      return true;
    } catch (err) {
      console.error("Error creating fine:", err);
      return false;
    }
  };

  return (
    <>
      <PageMeta title="Fine Registration | AutoSystem" description="Manage and monitor fines." />
      <PageBreadcrumb pageTitle="Fine Registration" />

      <div className="space-y-6">
        <ComponentCard title="Fine registration" desc="Here you can add fines, search and filter.">
          <FineRegistrationTable onAdd={handleAddClick} filters={filters} onFilterChange={setFilters} />
        </ComponentCard>
      </div>

      <FineRegistrationModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onSubmit={handleModalSubmit} />
    </>
  );
}
