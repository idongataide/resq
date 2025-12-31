import React from "react";
import AllTeams from "./allTeams";
import { FaPlus } from "react-icons/fa6";
import { FaUsers } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useAllLastma, useAllLastmaCount } from "@/hooks/useAdmin";
import LoadingScreen from "@/pages/dashboard/common/LoadingScreen";
import { useOnboardingStore } from "@/global/store";


const AdminsLayout: React.FC = () => {

  const { data : latsmadmin, isLoading: latsmaLoading, mutate } = useAllLastma()
  const { data : latsmaCount, isLoading } = useAllLastmaCount('count');
  const { role, userType } = useOnboardingStore();
  const isLastmaMode = userType === 'lastma' || role === 'lastma_admin';


  if (isLoading || latsmaLoading) {
    return (
      <LoadingScreen/>
    );
  }

  return (
    <main>
      <div className="py-1 px-6 mt-10">
        <div className="flex px-4 justify-between mb-6 items-center">
          <h1 className="text-[18px] text-[#667085] font-[700]">Lastma Admins</h1>        
        </div>
        
        {/* Active Operators Card */}
        <div className="bg-image rounded-lg sm border border-[#E5E9F0] p-6 mb-6 relative overflow-hidden ">
          <div className="relative z-10 flex justify-between items-center py-5">
            <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 bg-[#FFF0EA] rounded-full p-2">
                    <FaUsers className="text-[#FF6C2D]" />
                </div>
                <div className="ml-2">
                    <h2 className="text-[26px] font-bold text-[#475467] mb-1">{latsmaCount?.total}</h2>
                    <p className="text-[#667085] text-md font-medium">Lastma Admins</p>
                </div>
            </div>
            {isLastmaMode ?  
               <>
                <div className="flex gap-2 ">                 
                    <Link to="/admins/add">
                      <button className="flex cursor-pointer items-center gap-2 px-4 py-2 text-[16px] bg-[#fff] border border-[#FF6C2D] text-black rounded-lg hover:bg-[#FF6C2D] transition-colors">
                        <FaPlus className="text-[#FF6C2D]" />
                        <span> Add Latsma Admin</span>
                      </button>
                    </Link>
                </div>
              </>
              : 
              <Link to="/teams/add">
                <button className="flex cursor-pointer items-center gap-2 px-4 py-2 text-[16px] bg-[#FF6C2D] text-white rounded-lg hover:bg-[#FF6C2D] transition-colors">
                  <FaPlus className="text-white" />
                  <span> Add new</span>
                </button>
              </Link>
            }

          </div>
        </div>
        
        <AllTeams data={latsmadmin} mutate={mutate}/>
      </div>
    </main>
  );
};

export default AdminsLayout;