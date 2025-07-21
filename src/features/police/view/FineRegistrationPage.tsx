import { useCallback, useEffect, useRef, useState } from "react";
import ComponentCard from "../../../components/common/ComponentCard";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import FineRegistrationTable from "../components/FineRegistrationTable";
import FineRegistrationModal from "../components/FineRegistrationModal";
import FineFilterModal from "../components/FineFilterModal";
import { FineFilter } from "../../../types/Fine/FineFilter";
import { FineCreate } from "../../../types/Fine/FineCreate";
import { FineResponse } from "../../../types/Fine/FineResponse";
import { createFine, getAllFines } from "../../../services/fineService";
import Pagination from "../../../components/ui/pagination/Pagination";
import Alert from "../../../components/ui/alert/Alert";
import { PaginatedResponse } from "../../../types/PaginatedResponse";

export default function FineRegistrationPage() {
  const [filters, setFilters] = useState<FineFilter>({});
  const [page, setPage] = useState(1);
  const [pageSize] = useState(5);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [submittedSearch, setSubmittedSearch] = useState("");
  const [, setPlateOptions] = useState<string[]>([]);
  const [fines, setFines] = useState<FineResponse[]>([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [infoMsg, setInfoMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [fineFormError, setFineFormError] = useState<string | null>(null);
  const clearFineFormError = () => setFineFormError(null);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchFines = useCallback(async () => {
    try {
      const data: PaginatedResponse<FineResponse> = await getAllFines({
        page,
        pageSize,
        search: submittedSearch,
        sortField: "CreatedOn",
        sortOrder: "desc",
        fromDate: filters.fromDate,
        toDate: filters.toDate,
        plateNumber: filters.plateNumber,
      });

      setFines(data.items);
      setHasNextPage(data.hasNextPage);

      const uniquePlates = [...new Set(data.items.map((f) => f.plateNumber))].filter(
        (plate): plate is string => typeof plate === "string"
      );
      setPlateOptions(uniquePlates);

      if (data.items.length === 0) {
        setInfoMsg("No fines found.");
      } else {
        setInfoMsg(null);
      }
    } catch {
      setFines([]);
      setHasNextPage(false);
      setErrorMsg("Failed to fetch fines.");
    }
  }, [filters, submittedSearch, page, pageSize]);

  useEffect(() => {
    fetchFines();
  }, [fetchFines]);

  const handleAddClick = () => {
    setModalOpen(true);
  };

  const handleModalSubmit = async (data: FineCreate): Promise<boolean> => {
    try {
      await createFine(data);
      setSuccessMsg("The fine has been successfully submitted.");
      setSubmittedSearch((prev) => prev + " ");
      return true;
    } catch (err: unknown) {
      let message = "Could not submit the fine. Please try again.";

      if (typeof err === "object" && err !== null && "message" in err) {
        const typedErr = err as {
          response?: { data?: { error?: string; message?: string } };
          message?: string;
        };

        message =
          typedErr.response?.data?.error ||
          typedErr.response?.data?.message ||
          typedErr.message ||
          message;
      }

      setFineFormError(message); 
      return false;
    }
  };

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      setSubmittedSearch(searchTerm);
      setPage(1);
    }, 600);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [searchTerm]);

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
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

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSuccessMsg(null);
      setInfoMsg(null);
      setErrorMsg(null);
    }, 4000);

    return () => clearTimeout(timeout);
  }, [successMsg, infoMsg, errorMsg]);

  return (
    <>
      <PageBreadcrumb pageTitle="Fine Registration" />

      <div className="space-y-6">
        {successMsg && (
          <Alert variant="success" title="Success" message={successMsg} />
        )}
        {infoMsg && <Alert variant="info" title="Info" message={infoMsg} />}
        {errorMsg && <Alert variant="error" title="Error" message={errorMsg} />}

        <ComponentCard
          title="Fine registration"
          desc="Here you can add fines, search and filter."
        >
          <FineRegistrationTable
            fines={fines}
            onAdd={handleAddClick}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onSearchSubmit={handleSearchKeyDown}
            onOpenFilterModal={() => setIsFilterModalOpen(true)}
          />
        </ComponentCard>
      </div>

      <FineFilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApply={handleApplyFilter}
        initialFilter={filters}
      />

      <FineRegistrationModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          clearFineFormError();
        }}
        formErrorMessage={fineFormError}
        onClearFormError={clearFineFormError}
        onSubmit={handleModalSubmit}
      />

      <Pagination
        currentPage={page}
        hasNextPage={hasNextPage}
        onPageChange={setPage}
      />
    </>
  );
}
