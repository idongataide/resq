import React from "react";

const DashboardMetrics: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
      {/* Total Revenue */}
      <div className="bg-white rounded-lg p-6 border border-[#F2F4F7]">
        <p className="text-sm text-[#475467] mb-3">Total Revenue</p>
        <h2 className="text-2xl font-bold text-[#667085]">100</h2>
      </div>
      {/* Total number of operators */}
      <div className="bg-white rounded-lg p-6 border border-[#F2F4F7]">
        <p className="text-sm text-[#475467] mb-3">Total number of operators</p>
        <h2 className="text-2xl font-bold text-[#667085]">100</h2>
      </div>
      {/* Pending requests */}
      <div className="bg-white rounded-lg p-6 border border-[#F2F4F7]">
        <p className="text-sm text-[#475467] mb-3">Pending requests</p>
        <h2 className="text-2xl font-bold text-[#667085]">07</h2>
      </div>
      {/* Successful transactions */}
      <div className="bg-white rounded-lg p-6 border border-[#F2F4F7]">
        <p className="text-sm text-[#475467] mb-3">Successful transactions</p>
        <h2 className="text-2xl font-bold text-[#667085]">09</h2>
      </div>
    </div>
  );
};

export default DashboardMetrics; 