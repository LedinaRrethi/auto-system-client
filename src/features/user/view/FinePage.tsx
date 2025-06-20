import { useState } from "react";
import ComponentCard from "../../../components/common/ComponentCard";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import PageMeta from "../../../components/common/PageMeta";
import { FineFilter } from "../../../types/Fine/FineFilter";
import FineTable from "../components/FineTable";
import FineFilterModal from "../components/FineFilterModal";

export default function FineRegistrationPage() {


   const [filters, setFilters] = useState<FineFilter>({});
  const [isFilterModalOpen, setFilterModalOpen] = useState(false);

  return (
    <>
      <PageMeta
        title="My fines | AutoSystem"
        description="Manage and monitor fines."
      />
      <PageBreadcrumb pageTitle="My fines" />

      <div className="space-y-6">
        <ComponentCard
          title="My fines"
          desc="Here you can view your fines."
        >
          <FineTable
                      filters={filters}
                      onFilterChange={setFilters} onAdd={function (): void {
                          throw new Error("Function not implemented.");
                      } }          />
        </ComponentCard>
      </div>

      <FineFilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setFilterModalOpen(false)}
        onApply={(newFilters) => {
          setFilters({ ...filters, ...newFilters });
          setFilterModalOpen(false);
        }}
        initialFilter={filters}
      />

      
    </>
  );
}
