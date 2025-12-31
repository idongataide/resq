import React, { useState } from "react";
import Images from '@/components/images';
import AddLastmaMembersForm from './addLastmaForm';
import { FaAngleLeft, FaCloudUploadAlt, FaPlus } from "react-icons/fa";
import { useOnboardingStore } from '@/global/store';
import  { Toaster } from "react-hot-toast";
import UploadLastmaMembersForm from "./uploadLatsma";

const AddLastmaLayout: React.FC = () => {
  const [selected, setSelected] = useState<'upload' | 'add'>('upload');
  const navPath = useOnboardingStore();

  return (
    <>
      <Toaster containerStyle={{ zIndex: 999999 }}/>
      <div className="mb-6 px-6">
        <div 
          className="flex items-center mb-5 mt-10 cursor-pointer"
          onClick={() => window.history.back()}
        >
          <FaAngleLeft className='text-lg text-[#667085]' />
          <p className='ml-2 font-bold text-[#667085] text-lg'>Back</p>
        </div>

        <main className="flex flex-col lg:flex-row min-h-screen bg-[#F9FAFB] gap-5 p-5">
        {/* Left Navigation - Full width on md, 45% on xl */}
        <div className="w-full lg:w-[30%] xl:w-[45%] flex flex-col">
           <div className="mb-5">
              <img src={Images[selected === 'upload' ? 'ads' : 'ads2']} alt='' className="w-full"/>
            </div>
            <div>
              <button
                className={`w-full flex items-center bg-[#fff] gap-3 cursor-pointer px-4 py-5 mb-4 rounded-xl border-[0.6px] text-left transition-all ${selected === 'upload' ? 'shadow-xs shadow-[#FF6C2D85] border-[#FF9D72]' : 'border-[#E5E9F0]'}`}
                onClick={() => setSelected('upload')}
              >
                <span className="bg-[#FFF0EA] rounded-full p-4">
                  <FaCloudUploadAlt className="text-[#FF6C2D]" />
                </span>
                <span>
                  <div className="font-medium text-[16px] text-[#475467]">Upload Lastma Members</div>
                  <div className="text-md text-[#667085]">Upload an csv file to add lastma members</div>
                </span>
              </button>
              <button
                className={`w-full flex items-center bg-[#fff] gap-3 cursor-pointer px-4 py-5 mb-4 rounded-xl border-[0.6px] text-left transition-all ${selected === 'add' ? 'shadow-xs shadow-[#FF6C2D85] border-[#FF9D72]' : 'border-[#E5E9F0]'}`}
                onClick={() => {setSelected('add'); navPath.setNavPath("company-details")}}
              >
                <span className="bg-[#FFF0EA] rounded-full p-4">
                  <FaPlus className="text-[#FF6C2D]" />
                </span>
                <span>
                  <div className="font-medium text-[16px] text-[#475467]">Add Lastma Members</div>
                  <div className="text-md text-[#667085]">Manually add up lastma members to your directory</div>
                </span>
              </button>
            </div>
          </div>
          
          {/* Right Content - Full width on md, 55% on xl */}
          <div className="w-full lg:w-[70%] xl:w-[55%]">
            <div className="bg-white rounded-lg border-[0.6px] border-[#E5E9F0] min-h-[425px]">
              {selected === 'upload' ? <UploadLastmaMembersForm /> : <AddLastmaMembersForm />}
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default AddLastmaLayout;