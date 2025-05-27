import React from "react";
import { FaStar } from "react-icons/fa";
import { HiMiniArrowTrendingUp , HiMiniArrowTrendingDown } from "react-icons/hi2";

const RevenueMetrics: React.FC = () => {
  return (
    <>
       
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
        {/* Grouped box with borders between 3 metrics */}
        <div className="lg:col-span-3 bg-white rounded-lg py-5 border border-[#E5E9F0] flex divide-x divide-[#E5E9F0]">
        {/* This week */}
        <div className="flex-1 p-4">
            <h2 className="text-2xl font-bold text-[#475467] mb-2">7,035</h2>
            <div className="flex items-center gap-1 text-sm">
            <p className="font-medium text-[#667085]">This week</p>
            <span className="mx-1 w-1 h-1 rounded-full bg-[#98A2B3]"></span>
            <div className="flex items-center gap-1 font-bold text-[#69B574]">
                <HiMiniArrowTrendingUp className="w-3 h-3" />
                <span>4.70%</span>
            </div>
            </div>
        </div>

        {/* This month */}
        <div className="flex-1 p-4">
            <h2 className="text-2xl font-bold text-[#475467] mb-2">23,650</h2>
            <div className="flex items-center gap-1 text-sm">
            <p className="font-medium text-[#667085]">This month</p>
            <span className="mx-1 w-1 h-1 rounded-full bg-[#98A2B3]"></span>
            <div className="flex items-center gap-1 font-bold text-[#69B574]">
                <HiMiniArrowTrendingUp className="w-3 h-3" />
                <span>8.50%</span>
            </div>
            </div>
        </div>

        {/* This quarter */}
        <div className="flex-1 p-4">
            <h2 className="text-2xl font-bold text-[#475467] mb-2">229,650</h2>
            <div className="flex items-center gap-1 text-sm">
            <p className="font-medium text-[#667085]">This quarter</p>
            <span className="mx-1 w-1 h-1 rounded-full bg-[#98A2B3]"></span>
            <div className="flex items-center gap-1 font-bold text-[#C21E1E]">
                <HiMiniArrowTrendingDown className="w-3 h-3" />
                <span>0.90%</span>
            </div>
            </div>
        </div>
        </div>

        {/* Average user rating */}
        <div className="bg-white rounded-lg border border-[#E5E9F0] p-4 flex flex-col justify-center">
        <h2 className="text-2xl font-semibold text-[#475467] flex items-center gap-1">
            4.2 <FaStar className="text-yellow-500" />
        </h2>
        <p className="text-sm text-[#667085]">Average user rating</p>
        </div>
    </div>

    </>
  );
};

export default RevenueMetrics; 