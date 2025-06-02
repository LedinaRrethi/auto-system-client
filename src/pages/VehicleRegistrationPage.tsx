import PageBreadcrumb from "../components/common/PageBreadCrumb";
import ComponentCard from "../components/common/ComponentCard";
import PageMeta from "../components/common/PageMeta";
import VehicleTable from "../components/tables/VehicleRegistration"; 

export default function VehicleRegistrationPage() {
  return (
    <>
      <PageMeta
        title="Vehicle Registration | AutoSystem"
        description="Manage and monitor the vehicles registered by individual users."
      />
      <PageBreadcrumb pageTitle="Vehicle Registration" />
      <div className="space-y-6">
        <ComponentCard
          title="Registered Vehicles"
          desc="Here you can view, edit, or delete your registered vehicles. Only approved vehicles are considered valid."
        >
          <VehicleTable />
        </ComponentCard>
      </div>
    </>
  );
}
