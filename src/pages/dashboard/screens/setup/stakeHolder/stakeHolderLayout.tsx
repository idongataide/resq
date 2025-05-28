import React, { useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { FaAngleLeft, FaUsers } from "react-icons/fa"; // Assuming a similar icon might be used
// import { Link } from "react-router-dom"; // Removed Link as sidebar will be used for adding
import StakeHolderTable from "./StakeHolderTable";
import AddStakeHolderForm from "./AddStakeHolderForm";

// Define a basic interface for StakeHolderItem - this will need refinement based on actual data
interface StakeHolderItem {
  id: string;
  stakeholderName: string;
  accountNumber: string;
  bankName: string;
  accountName: string;
  value: string; // Can be percentage or amount
}

const StakeHolderLayout: React.FC = () => {
  const [activeSidebar, setActiveSidebar] = useState<string | null>(null);

  // Placeholder data - replace with actual data fetching later
  const stakeholders: StakeHolderItem[] = [
    { id: '1', stakeholderName: 'Company & co', accountNumber: '9004000522', bankName: 'GTBank', accountName: 'The co company', value: '20%' },
    { id: '2', stakeholderName: 'Company & co', accountNumber: '9004000522', bankName: 'GTBank', accountName: 'The co company', value: '₦5,000' },
    // Add more placeholder data as needed
  ];

  const handleAddClick = () => {
    setActiveSidebar('add');
  };

  const handleCloseSidebar = () => {
    setActiveSidebar(null);
  };

  return (
    <main>
      <div className="py-1 px-6 mt-10">
        <div 
          className="flex items-center mb-5 mt-10 cursor-pointer"
          onClick={() => window.history.back()}
          >
          <FaAngleLeft className='text-lg text-[#667085]' />
          <p className='ml-2 font-bold text-[#667085] text-lg'>Back</p>
        </div>

        {/* Active Stakeholders Card - similar to General cost points card */}
        <div className="bg-image rounded-lg sm border border-[#E5E9F0] p-6 mb-6 relative overflow-hidden ">
          <div className="relative z-10 flex justify-between items-center py-5">
            <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 bg-[#FFF0EA] rounded-full p-2">
                    <FaUsers className="text-[#FF6C2D]" />
                </div>
                <div className="ml-2">
                    {/* Replace with actual stakeholder count */}
                    <h2 className="text-[26px] font-bold text-[#475467] mb-1">{stakeholders.length}</h2>
                    <p className="text-[#667085] text-md font-medium">Stakeholders</p>
                </div>
            </div>
            <button className="flex cursor-pointer items-center gap-2 px-4 py-2 text-[16px] bg-[#FF6C2D] text-white rounded-lg hover:bg-[#FF6C2D] transition-colors" onClick={handleAddClick}>
              <FaPlus className="text-white" />
              <span> Add new</span>
            </button>
          </div>
        </div>

        {/* Stakeholder Table */}
        <StakeHolderTable data={stakeholders} />
      </div>

      {/* Add Stakeholder Sidebar */}
      {activeSidebar === 'add' && (
            <AddStakeHolderForm onClose={handleCloseSidebar} />
      )}
    </main>
  );
};

export default StakeHolderLayout; 