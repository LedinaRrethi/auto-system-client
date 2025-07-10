import { useEffect, useState } from "react";
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
import Alert from "../../../components/ui/alert/Alert";

export default function FineRegistrationPage() {
  const [filters, setFilters] = useState<FineFilter>({});
  const [page, setPage] = useState(1);
  const [pageSize] = useState(5);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [submittedSearch, setSubmittedSearch] = useState("");
  const [plateOptions, setPlateOptions] = useState<string[]>([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const [alert, setAlert] = useState<{
    variant: "success" | "info" | "error";
    title: string;
    message: string;
  } | null>(null);

  const handleAddClick = () => {
    setModalOpen(true);
  };

  const handleModalSubmit = async (data: FineCreate): Promise<boolean> => {
    try {
      await createFine(data);
      setModalOpen(false);
      setAlert({
        variant: "success",
        title: "Fine Registered",
        message: "The fine has been successfully submitted.",
      });

      setSubmittedSearch((prev) => prev + " ");

      setTimeout(() => setAlert(null), 3000);

      return true;
    } catch (err) {
      console.error("Error creating fine:", err);
      setAlert({
        variant: "error",
        title: "Submission Failed",
        message: "Could not submit the fine. Please try again.",
      });
      setTimeout(() => setAlert(null), 3000);

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
      <PageMeta title="Fine Registration | AutoSystem" description="Manage and monitor fines." />
      <PageBreadcrumb pageTitle="Fine Registration" />

      <div className="space-y-6">
        {alert && (
          <div className="mb-4">
            <Alert variant={alert.variant} title={alert.title} message={alert.message} />
          </div>
        )}

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

      <FineRegistrationModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onSubmit={handleModalSubmit} />

      <Pagination currentPage={page} hasNextPage={hasNextPage} onPageChange={setPage} />
    </>
  );
}
