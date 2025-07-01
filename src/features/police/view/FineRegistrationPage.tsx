import { useState } from "react";
import ComponentCard from "../../../components/common/ComponentCard";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import PageMeta from "../../../components/common/PageMeta";
import FineRegistrationTable from "../components/FineRegistrationTable";
import FineRegistrationModal from "../components/FineRegistrationModal";
import FineFilterModal from "../components/FineFilterModal";
import { FineFilter } from "../../../types/Fine/FineFilter";
import { FineCreate } from "../../../types/Fine/FineCreate";
import { createFine } from "../../../services/fineService";
import Pagination from "../../../components/ui/pagination/Pagination";

export default function FineRegistrationPage() {
  const [filters, setFilters] = useState<FineFilter>({});
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [submittedSearch, setSubmittedSearch] = useState("");
  const [plateOptions, setPlateOptions] = useState<string[]>([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

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

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setSubmittedSearch(searchTerm);
      setPage(1);
    }
  };

  const handleApplyFilter = (newFilter: FineFilter) => {
    setFilters(newFilter);
    setPage(1);
    setIsFilterModalOpen(false);
  };

  return (
    <>
      <PageMeta title="Fine Registration | AutoSystem" description="Manage and monitor fines." />
      <PageBreadcrumb pageTitle="Fine Registration" />

      <div className="space-y-6">
        <ComponentCard title="Fine registration" desc="Here you can add fines, search and filter.">
          <FineRegistrationTable
            onAdd={handleAddClick}
            filters={filters}
            onFilterChange={setFilters}
            page={page}
            setPage={setPage}
            pageSize={pageSize}
            searchTerm={searchTerm}
            submittedSearch={submittedSearch}
            onSearchChange={setSearchTerm}
            onSearchSubmit={handleSearchKeyDown}
            setHasNextPage={setHasNextPage}
            plateOptions={plateOptions}
            setPlateOptions={setPlateOptions}
            onOpenFilterModal={() => setIsFilterModalOpen(true)}
          />
        </ComponentCard>
      </div>

      <FineFilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApply={handleApplyFilter}
        plateOptions={plateOptions}
        initialFilter={filters}
      />

      <FineRegistrationModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onSubmit={handleModalSubmit} />

        <Pagination currentPage={page} hasNextPage={hasNextPage} onPageChange={setPage} />
    </>
  );
}
