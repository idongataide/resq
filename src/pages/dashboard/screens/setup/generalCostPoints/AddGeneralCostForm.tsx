import React from 'react';

interface AddGeneralCostFormProps {
  onClose: () => void;
}

const AddGeneralCostForm: React.FC<AddGeneralCostFormProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-[999] flex justify-end bg-[#38383880] p-5 bg-opacity-50" onClick={onClose}>
        <div className="md:w-[48%] lg:w-1/3 w-100 z-[9999] h-full bg-white rounded-xl slide-in overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="h-full bg-white rounded-xl overflow-hidden">
            <div className="flex justify-between items-center py-3 px-6 border-b border-[#D6DADD]">
                <h2 className="text-md font-semibold text-[#1C2023]">Add service</h2>
                <button
                onClick={onClose}
                className="text-[#7D8489] bg-[#EEF0F2] cursor-pointer py-2 px-3 rounded-3xl hover:text-black"
                >
                ✕
                </button>
            </div>
            <div className='overflow-y-auto flex flex-col h-[calc(100vh-160px)] slide-in scrollbar-hide hover:scrollbar-show px-7 py-4'>

                <div className="form-section mb-4">
                    <h3 className="text-md font-medium text-[#475467] mb-3">Enter required details</h3>
                    <div className='border border-[#F2F4F7] p-3 rounded-lg'>
                        <div className="form-field mb-3">
                            <label htmlFor="itemName" className="block text-sm font-medium text-[#475467] mb-1">Item name</label>
                            <input type="text" id="itemName" placeholder="Enter details" className="w-full border border-[#E5E9F0] rounded-lg px-3 py-2" />
                        </div>
                        <div className="form-field mb-3">
                            <label htmlFor="amount" className="block text-sm font-medium text-[#475467] mb-1">Amount</label>
                            <input type="number" id="amount" placeholder="Enter details" className="w-full border border-[#E5E9F0] rounded-lg px-3 py-2" />
                        </div>
                    </div>
                </div>

                <div className="py-4">
                <button className="h-[46px]! px-10! rounded-lg border border-[#FF6C2D] bg-[#FF6C2D]! py-2! text-sm font-medium text-[#fff]! shadow-sm hover:bg-[#E56026]">Save</button>
                </div>

            </div>
            </div>
        </div>
    </div>
  );
};

export default AddGeneralCostForm; 