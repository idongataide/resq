import React from "react";
import DashboardMetrics from "./DashboardMetrics";
import PerformanceRateChart from "./PerformanceRateChart";
import RevenueGrowthChart from "./RevenueGrowthChart";
import LagosHotspotsMap from "./LagosHotspotsMap";
import TopOperatorsTable from "./TopOperatorsTable";
import { useOnboardingStore } from "@/global/store";

const DashboadScreen: React.FC = () => {
  const { userType, role } = useOnboardingStore();
  const isLastmaMode = userType === 'lastma' || role === 'lastma_admin';
  return (
    <div className="w-full p-6">
      {/* Metrics Boxes */}
      <DashboardMetrics />

      {/* Charts Row */}
      <main className="grid grid-cols-1 lg:grid-cols-6 mt-5 gap-5">
        <div className="col-span-1 lg:col-span-2">
          <PerformanceRateChart />
        </div>
        <div className="col-span-1 lg:col-span-4">
          <RevenueGrowthChart />
        </div>
      </main>


        <div className="col-span-1 mt-">
          <LagosHotspotsMap />
        </div>         
      
       <div className="col-span-1 mt-7">
        {!isLastmaMode && (
          <TopOperatorsTable />
        )}
       </div>
    </div>
  );
};

export default DashboadScreen;
