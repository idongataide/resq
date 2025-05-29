import { useAllBookingsCount, useAllTransCount, useOperatorCount } from "@/hooks/useAdmin";
import React from "react";


const DashboardMetrics: React.FC = () => {

  const {data : operatorCount  } = useOperatorCount('count');
  const { data: bookingsCount } = useAllBookingsCount('count-status');
  // const { data: revenueCount } = useAllBookingsCount('count');
  const { data: transCount } = useAllTransCount('count');


  return (
    <>
    <div className="text-sm py-3 px-2 rounded-lg mb-3 bg-[#fff]">
        <button className="px-6 py-2 text-[#fff] text-xs cursor-pointer rounded-bl-md rounded-tl-md  border border-[#F2F4F7] bg-[#E86229]">Daily</button>
        <button className="px-6 py-2 text-[#667085] text-xs cursor-pointer  border border-[#F2F4F7]">Weekly</button>
        <button className="px-6 py-2 text-[#667085] text-xs cursor-pointer rounded-br-md rounded-tr-md  border border-[#F2F4F7]">Monthly</button>
        <button className="px-6 py-2 text-[#667085] text-xs cursor-pointer  border border-[#F2F4F7]">Yearly</button>
        <button className="px-6 py-2 text-[#667085] text-xs cursor-pointer rounded-br-md rounded-tr-md  border border-[#F2F4F7]">All time</button>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
      {/* Total Revenue */}
      <div className="bg-white rounded-lg p-6 border border-[#F2F4F7]">
        <h2 className="text-2xl font-bold text-[#667085] mb-3">{bookingsCount?.total}</h2>
        <p className="text-sm text-[#475467]">Total Revenue</p>
      </div>
      {/* Total number of operators */}
      <div className="bg-white rounded-lg p-6 border border-[#F2F4F7]">
        <h2 className="text-2xl font-bold text-[#667085] mb-3">{operatorCount?.total}</h2>
        <p className="text-sm text-[#475467]">Total number of operators</p>
      </div>
      {/* Pending requests */}
      <div className="bg-white rounded-lg p-6 border border-[#F2F4F7]">
        <h2 className="text-2xl font-bold text-[#667085]">{bookingsCount?.pending}</h2>
        <p className="text-sm text-[#475467] mb-3">Pending requests</p>
      </div>
      {/* Successful transactions */}
      <div className="bg-white rounded-lg p-6 border border-[#F2F4F7]">
        <h2 className="text-2xl font-bold text-[#667085] mb-3">{transCount?.total}</h2>
        <p className="text-sm text-[#475467]">Successful transactions</p>
      </div>
    </div>
    </>
  );
};

export default DashboardMetrics; 