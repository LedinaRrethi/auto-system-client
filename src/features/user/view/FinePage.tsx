import { useEffect, useState } from "react";
import ComponentCard from "../../../components/common/ComponentCard";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
// import PageMeta from "../../../components/common/PageMeta";
import { FineFilter } from "../../../types/Fine/FineFilter";
import FineTable from "../components/FineTable";
import Pagination from "../../../components/ui/pagination/Pagination";
import FineFilterModal from "../components/FineFilterModal";
import Alert from "../../../components/ui/alert/Alert";

export default function FineRegistrationPage() {
  const [filters, setFilters] = useState<FineFilter>({});
  const [page, setPage] = useState(1);
  const [pageSize] = useState(5);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [submittedSearch, setSubmittedSearch] = useState("");
  const [plateOptions, setPlateOptions] = useState<string[]>([]);

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const [alert, setAlert] = useState<{
    variant: "success" | "info" | "error";
    title: string;
    message: string;
  } | null>(null);

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setSubmittedSearch(searchTerm);
      setPage(1);
    }
  };

  const handleApplyFilter = (newFilter: FineFilter) => {
    setFilters(newFilter);
    setSubmittedSearch("");
    setPage(1);
    setIsFilterModalOpen(false);
  };

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setSubmittedSearch("");
      setPage(1);
    }
  }, [searchTerm]);

  return (
    <>
      {/* <PageMeta title="My fines | AutoSystem" description="Manage and monitor fines." /> */}
      <PageBreadcrumb pageTitle="My Fines" />

      <div className="space-y-6">
        {alert && (
          <div className="mt-4">
            <Alert variant={alert.variant} title={alert.title} message={alert.message} />
          </div>
        )}

        <ComponentCard title="Fines" desc="Here you can view your fines.">
          <FineTable
            onAdd={() => handleApplyFilter(filters)}
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
            setAlert={setAlert}
          />
        </ComponentCard>
      </div>

      <FineFilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApply={handleApplyFilter}
        initialFilter={filters}
      />

      <Pagination currentPage={page} hasNextPage={hasNextPage} onPageChange={setPage} />
    </>
  );
}
