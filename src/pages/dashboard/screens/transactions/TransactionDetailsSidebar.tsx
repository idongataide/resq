import React from 'react';
import { IoClose } from 'react-icons/io5';
import { FaRegCheckCircle } from "react-icons/fa";

interface TransactionDetailsSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: any; // Use any for now based on the provided data structure
}

const TransactionDetailsSidebar: React.FC<TransactionDetailsSidebarProps> = ({
  isOpen,
  onClose,
  transaction
}) => {
  if (!isOpen || !transaction) return null;

  return (
    <div className="fixed inset-0 z-[999] flex justify-end bg-[#38383880] p-5 bg-opacity-50" onClick={onClose}>
      <div className="md:w-[48%] lg:w-1/3 w-100 z-[9999] h-full bg-white rounded-xl slide-in overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center py-3 px-6 border-b border-[#D6DADD]">
          <h2 className="text-md font-semibold text-[#1C2023]">Transaction Details</h2>
          <button 
            className="text-[#3F3F46] hover:text-[#1C2023] cursor-pointer"
            onClick={onClose}
          >
            <IoClose className="w-5 h-5" />
          </button>
        </div>

        <div className='overflow-y-auto mb-5 h-[calc(100vh-200px)] slide-in scrollbar-hide hover:scrollbar-show'>     
          <div className="px-6 py-6">
            <div className="text-center mb-8">
              <div className="text-[32px] font-medium text-[#1C2023] mb-2">₦{transaction.amount?.toLocaleString() || 'N/A'}</div>
              <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full ${transaction.status === 1 ? 'bg-[#ECFDF3]' : 'bg-[#FFEFEF]'}`}>
                {/* Assuming status 1 is success and anything else is failed for now */}
                <div className={`w-1.5 h-1.5 rounded-full ${transaction.status === 1 ? 'bg-[#12B76A]' : 'bg-[#B11B1B]'}`}></div>
                <span className={`text-sm ${transaction.status === 1 ? 'text-[#027A48]' : 'text-[#B11B1B]'}`}>{transaction.status === 1 ? 'Success' : 'Failed'}</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[#667085] text-md">Booking ID</span>
                <span className="text-[#475467] text-sm font-medium">{transaction.booking_ref || 'N/A'}</span>
              </div>
               <div className="flex justify-between items-center">
                <span className="text-[#667085] text-md">Status</span>
                <span className="text-[#475467] text-sm font-medium">{transaction.status === 1 ? 'Payment successful' : 'Payment failed'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#667085] text-md">Customer</span>
                <span className="text-[#475467] text-sm font-medium">{transaction.user_data?.first_name} {transaction.user_data?.last_name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#667085] text-md">Vehicle model</span>
                <span className="text-[#475467] text-sm font-medium">{transaction.vehicle_model || 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#667085] text-md">Service type</span>
                <span className="text-[#475467] text-sm font-medium">{/* Service type is not directly in the provided transaction data */ 'N/A'}</span>
              </div>
               <div className="flex justify-between items-center">
                <span className="text-[#667085] text-md">Total Km</span>
                <span className="text-[#475467] text-sm font-medium">{transaction.drop_off_dst || 'N/A'}km</span>
              </div>
               <div className="flex justify-between items-center">
                <span className="text-[#667085] text-md">Date</span>
                 <span className="text-[#475467] text-sm font-medium">{transaction.createdAt ? new Date(transaction.createdAt).toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'N/A'}</span>
              </div>
              {transaction.status === 1 && (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-[#667085] text-md">Towing operator</span>
                    <span className="text-[#475467] text-sm font-medium">{transaction.operator?.name || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#667085] text-md">Pickup</span>
                    <span className="text-[#475467] text-sm font-medium">{transaction.start_address || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#667085] text-md">Drop-off</span>
                    <span className="text-[#475467] text-sm font-medium">{transaction.end_address || 'N/A'}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-[#D6DADD] px-6 py-4 flex justify-end">
          <button className="flex items-center gap-2 text-[#475467] border border-[#F9FAFB] bg-[#F9FAFB] rounded-lg px-4 py-2 font-medium hover:text-[#1C2023]">
            <FaRegCheckCircle className='text-[#475467]' />
            <span>Download receipt</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionDetailsSidebar; 