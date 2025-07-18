import { useCallback, useEffect, useRef, useState } from "react";
//import PageMeta from "../../../components/common/PageMeta";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import ComponentCard from "../../../components/common/ComponentCard";
import Alert from "../../../components/ui/alert/Alert";
import Pagination from "../../../components/ui/pagination/Pagination";
import { HiSearch } from "react-icons/hi";

import { InspectionRequestList } from "../../../types/InspectionApproval/InspectionList";
import {
  approveInspection,
  fetchMyInspections,
} from "../../../services/inspectionApprovalService";

import InspectionApprovalTable from "../components/InspectionApprovalTable";
import InspectionApprovalModal from "../components/InspectionApprovalModal";

export default function InspectionApprovalPage() {
  const [inspections, setInspections] = useState<InspectionRequestList[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(5);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [submittedSearch, setSubmittedSearch] = useState("");

  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [infoMsg, setInfoMsg] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [action, setAction] = useState<"approve" | "reject">("approve");
  const [comment, setComment] = useState("");

  const [loading, setIsLoading] = useState(false);
  const [selectedInspection, setSelectedInspection] = useState<InspectionRequestList | null>(null);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result?.toString()?.split(",")[1] || "";
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const fetchInspections = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetchMyInspections({ page, pageSize, search: submittedSearch });
      setInspections(res.items);
      setHasNextPage(res.hasNextPage);

      if (res.items.length === 0) {
        setInfoMsg(res.message || "You have no inspection requests.");
      } else {
        setInfoMsg(null);
      }
    } catch {
      setErrorMsg("Failed to load inspections.");
    } finally {
      setIsLoading(false);
    }
  }, [page, pageSize, submittedSearch]);

  useEffect(() => {
    fetchInspections();
  }, [fetchInspections]);


  useEffect(() => {
    const timeout = setTimeout(() => {
      setSuccessMsg(null);
      setErrorMsg(null);
      setInfoMsg(null);
    }, 3000);
    return () => clearTimeout(timeout);
  }, [successMsg, errorMsg, infoMsg]);

  const onAction = (inspection: InspectionRequestList, action: "approve" | "reject") => {
    setSelectedInspection(inspection);
    setAction(action);
    setModalOpen(true);
  };

  const handleConfirm = async (comment: string, files: File[]) => {
    if (!selectedInspection) return;

    setIsLoading(true);
    try {
      const documents = await Promise.all(
        files.map(async (file) => ({
          idpK_InspectionDoc: null,
          idfK_InspectionRequest: selectedInspection.idpK_InspectionRequest,
          documentName: file.name,
          fileBase64: await fileToBase64(file),
        }))
      );

      await approveInspection({
        idpK_Inspection: selectedInspection.idpK_Inspection,
        isPassed: action === "approve",
        comment,
        documents,
      });

      setSuccessMsg(`Inspection ${action}ed successfully.`);

        setTimeout(async () => {
        await fetchInspections();
        setSubmittedSearch(searchTerm);
      }, 3000);

    } catch {
      setErrorMsg("Failed to update inspection.");
    } finally {
      setIsLoading(false);
      setModalOpen(false);
      setComment("");
    }
  };

   const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      setSubmittedSearch(searchTerm);
      setPage(1);
    }
  };

  return (
    <>
      {/* <PageMeta title="Vehicle Inspections | AutoSystem" description="Manage and schedule vehicle inspections." /> */}
      <PageBreadcrumb pageTitle="Inspection Approval" />

      <div className="space-y-6">
        {successMsg && <Alert variant="success" title="Success" message={successMsg} />}
        {errorMsg && <Alert variant="error" title="Error" message={errorMsg} />}
        {infoMsg && <Alert variant="info" title="Info" message={infoMsg} />}

        <ComponentCard title="Inspections" desc="Here you can view and manage your vehicle inspections.">
          <div className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
              <input
                type="text"
                placeholder="Search ..."
                value={searchTerm}
                autoComplete="off"
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-200 bg-transparent py-2.5 pl-10 pr-4 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
              />
            </div>
          </div>

           <div className={`transition-all duration-300 ${loading ? 'opacity-50' : 'opacity-100'}`}>
          {inspections.length === 0 && !loading ? (
            <div className="flex justify-center items-center py-10">
              <p className="text-lg text-gray-500 dark:text-gray-400">
                No inspection requests.
                </p>
            </div>
          ) : (
            <InspectionApprovalTable 
            inspections={inspections} 
            onAction={onAction} 
            />
          )}
          </div>

           {loading && inspections.length === 0 && (
            <div className="flex justify-center items-center py-10">
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-gray-300 border-t-brand-500"></div>
                <p className="text-lg text-gray-500 dark:text-gray-400">Loading inspection requests...</p>
              </div>
            </div>
          )}

          <InspectionApprovalModal
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            onConfirm={handleConfirm}
            action={action}
            comment={comment}
            setComment={setComment}
            loading={loading}
          />

          <Pagination 
          currentPage={page} 
          hasNextPage={hasNextPage} 
          onPageChange={setPage} 
          />

        </ComponentCard>
      </div>
    </>
  );
}
