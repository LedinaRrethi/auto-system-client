import ComponentCard from "../../../components/common/ComponentCard";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import PageMeta from "../../../components/common/PageMeta";
import UserApprovalTable from "../components/UserApprovalTable";

export default function UserApprovalPage() {
  return (
    <>
      <PageMeta
        title="User Approval | AutoSystem"
        description="Manage and monitor the user registrations and approvals in the AutoSystem."
      />
      <PageBreadcrumb pageTitle="User Approval" />
      <div className="space-y-6">
        <ComponentCard
          title="User Approval"
          desc="Here you can view, approve, or reject user registrations. Only approved users can access the system functionalities."
        >
          <UserApprovalTable />
        </ComponentCard>
      </div>
    </>
  );
}
