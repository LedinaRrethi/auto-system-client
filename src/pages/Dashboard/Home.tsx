import EcommerceMetrics from "../../components/ecommerce/EcommerceMetrics";
import MonthlySalesChart from "../../components/ecommerce/MonthlySalesChart";
import StatisticsChart from "../../components/ecommerce/StatisticsChart";
import MonthlyTarget from "../../components/ecommerce/MonthlyTarget";
import RecentOrders from "../../components/ecommerce/RecentOrders";
import DemographicCard from "../../components/ecommerce/DemographicCard";
import PageMeta from "../../components/common/PageMeta";

export default function Home() {
  return (
    <>
      <PageMeta
        title="React.js Ecommerce Dashboard | TailAdmin - React.js Admin Dashboard Template"
        description="This is React.js Ecommerce Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12 space-y-6 xl:col-span-7">
          <EcommerceMetrics />

          <MonthlySalesChart />
        </div>

        <div className="col-span-12 xl:col-span-5">
          <MonthlyTarget />
        </div>

        <div className="col-span-12">
          <StatisticsChart />
        </div>

        <div className="col-span-12 xl:col-span-5">
          <DemographicCard />
        </div>

        <div className="col-span-12 xl:col-span-7">
          <RecentOrders />
        </div>
      </div>
    </>
  );
}

// const Home = () => {
//   const { user } = useAuth();

//   if (!user) return null;

//   return (
//     <div className="p-6">
//       <h1 className="text-3xl font-semibold mb-6">Dashboard</h1>

//       {user.role === "Admin" && (
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           <Card title="Users Pending Approval" value="12" />
//           <Card title="Vehicle Requests" value="7" />
//           <Card title="System Logs" value="230" />
//         </div>
//       )}

//       {user.role === "Polic" && (
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           <Card title="Fines Issued" value="23" />
//           <Card title="Today's Fines" value="4" />
//           <Card title="Reported Vehicles" value="6" />
//         </div>
//       )}

//       {user.role === "Individ" && (
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           <Card title="Registered Vehicles" value="3" />
//           <Card title="Active Fines" value="2" />
//           <Card title="Upcoming Inspections" value="1" />
//         </div>
//       )}

//       {user.role === "Specialist" && (
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           <Card title="Inspections Today" value="2" />
//           <Card title="Pending Reviews" value="5" />
//           <Card title="Documents Uploaded" value="18" />
//         </div>
//       )}
//     </div>
//   );
// };

// const Card = ({ title, value }: { title: string; value: string | number }) => (
//   <div className="bg-white shadow rounded-xl p-6">
//     <p className="text-gray-600">{title}</p>
//     <h2 className="text-2xl font-bold">{value}</h2>
//   </div>
// );

// export default Home;
