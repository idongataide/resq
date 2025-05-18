import React from 'react';
import { FaCloudUploadAlt } from 'react-icons/fa';

const UploadOperatorsForm: React.FC = () => (
  <div className="p-12 h-[425px]">
    <h2 className="text-lg! font-medium text-[#667085] mb-7">CSV Document upload</h2>
    <p className="text-md text-[#475467] font-medium mb-4">Get a template to upload operators. <span className="text-[#FF6C2D] ml-2 cursor-pointer font-medium!  underline">Download now</span></p>
    
    <div className="mt-4">
        <div className="text-md text-[#475467] font-medium mb-2">Upload document</div>
        <button
            className="w-full flex items-center bg-[#fff] gap-3 cursor-pointer px-4 py-5 mb-4 rounded-xl border-[0.6px] text-left border-dashed  border-[#FF9D72]"
          >
            <span className="bg-[#FFF0EA] rounded-full p-4">
                <FaCloudUploadAlt className="text-[#FF6C2D]" />
            </span>
            <span>
              <div className="font-medium text-[16px] text-[#475467]">Click to upload</div>
              <div className="text-[10px] text-[#667085]">PNG | JPEG 2mb max.</div>
            </span>
            <span className="text-md text-[#fff] ml-auto bg-[#FF6C2D] rounded-md px-4 py-2 font-medium">Upload</span>
          </button>
    </div>
  </div>
);

export default UploadOperatorsForm; 