import Images from "@/components/images";
import React from "react";

const LagosHotspotsMap: React.FC = () => {
  return (
    <div className="bg-white border border-[#E5E9F0] rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-10">Hot spots in Lagos</h3>
      
      <div className="h-96 mb-8 flex items-center  justify-center text-gray-600 font-bold">
             <img src={Images.map} alt="Filter" className="w-full rounded-lg" />
      </div>
      <div className="mt-4 flex items-center gap-4 text-sm">
        <p><span className="inline-block w-3 h-3 mr-1 rounded-sm bg-orange-500"></span>High demand area</p>
        <p><span className="inline-block w-3 h-3 mr-1 rounded-sm bg-green-500"></span>Partial demand area</p>
      </div>
    </div>
  );
};

export default LagosHotspotsMap; 