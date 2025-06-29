import ComponentCard from "../../../components/common/ComponentCard";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import PageMeta from "../../../components/common/PageMeta";
import VehicleRequestApprovalTable from "../components/VehicleRequestApprovalTable";

export default function VehicleRequestApprovalPage() {
  return (
    <>
      <PageMeta
        title="Vehicle Approval | AutoSystem"
        description="Manage and monitor vehicle approvals in the AutoSystem."
      />
      <PageBreadcrumb pageTitle="Vehicle Approval" />
      <div className="space-y-6">
        <ComponentCard
          title="Vehicle Approval"
          desc="Here you can view, approve, or reject vehicle requests for registration , update or delete."
        >
          <VehicleRequestApprovalTable />
        </ComponentCard>
      </div>
    </>
  );
}
