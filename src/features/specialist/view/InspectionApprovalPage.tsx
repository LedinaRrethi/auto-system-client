import { useEffect, useState } from "react";
import ComponentCard from "../../../components/common/ComponentCard";
import PageMeta from "../../../components/common/PageMeta";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
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

export default function InspectionPage() {
  const [inspections, setInspections] = useState<InspectionRequestList[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(5);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [submittedSearch, setSubmittedSearch] = useState("");

  const [infoMsg, setInfoMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [action, setAction] = useState<"approve" | "reject">("approve");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const [selectedInspection, setSelectedInspection] =
    useState<InspectionRequestList | null>(null);

  const onAction = (
    inspection: InspectionRequestList,
    action: "approve" | "reject"
  ) => {
    setSelectedInspection(inspection);
    setAction(action);
    setModalOpen(true);
  };

  const handleConfirm = async (comment: string, files: File[]) => {
    if (!selectedInspection) return;

    setLoading(true);
    try {
      const documents = await Promise.all(
        files.map(async (file) => {
          const base64 = await fileToBase64(file);
          return {
            idfK_InspectionRequest: selectedInspection.idpK_InspectionRequest,
            documentName: file.name,
            fileBase64: base64,
          };
        })
      );

      await approveInspection({
        idpK_Inspection: selectedInspection.idpK_Inspection,
        isPassed: action === "approve",
        comment,
        documents,
      });

      setSuccessMsg(`Inspection ${action}d successfully.`);

      await fetchInspections(); 
      setSubmittedSearch(searchTerm);
    } catch {
      setErrorMsg("Failed to update inspection.");
    } finally {
      setLoading(false);
      setModalOpen(false);
      setComment("");
    }
  };

  const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const fullBase64 = reader.result?.toString() || "";
        const pureBase64 = fullBase64.split(",")[1];
        resolve(pureBase64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const fetchInspections = async () => {
  try {
    const res = await fetchMyInspections({
      page,
      pageSize,
      search: submittedSearch,
    });
    setInspections(res.items);
    setHasNextPage(res.hasNextPage);
    setInfoMsg(res.items.length === 0 ? "You have no requests." : "");
  } catch {
    console.error("Error fetching inspections");
    setErrorMsg("Failed to load inspections.");
  }
};

useEffect(() => {
  fetchInspections();
}, [page, pageSize, submittedSearch]);


  useEffect(() => {
    const timeout = setTimeout(() => {
      setSuccessMsg("");
      setErrorMsg("");
    }, 3000);
    return () => clearTimeout(timeout);
  }, [successMsg, errorMsg]);

  return (
    <>
      <PageMeta
        title="Vehicle Inspections | AutoSystem"
        description="Manage and schedule vehicle inspections."
      />
      <PageBreadcrumb pageTitle="Inspection Approval" />

      <div className="space-y-4">
        {successMsg && (
          <Alert variant="success" title="Success" message={successMsg} />
        )}
        {errorMsg && <Alert variant="error" title="Error" message={errorMsg} />}

        {infoMsg && (
          <Alert variant="info" title="Info" message={infoMsg}></Alert>
        )}

        <ComponentCard
          title="Inspections"
          desc="Here you can view and manage your vehicle inspections."
        >
          <div className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex gap-4 items-center w-full sm:w-auto flex-wrap">
              <div className="relative w-full sm:w-80">
                <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                <input
                  type="text"
                  placeholder="Search ..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      setSubmittedSearch(searchTerm);
                      setPage(1);
                    }
                  }}
                  className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-200 bg-transparent py-2.5 pl-10 pr-4 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800  dark:bg-white/[0.03] dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                />
              </div>
            </div>
          </div>

          <InspectionApprovalTable
            inspections={inspections}
            onAction={onAction}
          />

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
