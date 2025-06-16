import { useState } from "react";
import ComponentCard from "../../../components/common/ComponentCard";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import PageMeta from "../../../components/common/PageMeta";
import FineRegistrationTable from "../components/FineRegistrationTable";
import { FineFilterValues } from "../../../types/Fine/FineFilterValues";


export default function FineRegistrationPage() {
  const [filters, setFilters] = useState<FineFilterValues>({});

  const handleAddClick = () => {
    alert("Form submission for new fines is not implemented in this demo.");
  };

  return (
    <>
      <PageMeta
        title="Fine Registration | AutoSystem"
        description="Manage and monitor fines."
      />
      <PageBreadcrumb pageTitle="Fine Registration" />

      <div className="space-y-6">
        <ComponentCard
          title="Fine registration"
          desc="Here you can add fines , search and filter."
        >
          <FineRegistrationTable onAdd={handleAddClick} filters={filters} />
        </ComponentCard>
      </div>
    </>
  );
}
