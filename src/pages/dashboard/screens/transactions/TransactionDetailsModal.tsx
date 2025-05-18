import React from 'react';
import { IoClose } from 'react-icons/io5';
import { FaRegCheckCircle } from "react-icons/fa";

interface TransactionDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: {
    bookingId: string;
    status: string;
    customer: string;
    vehicleModel: string;
    serviceType: string;
    totalKm: string;
    date: string;
    towingOperator: string;
    pickup: string;
    dropoff: string;
    amount: string;
  } | null;
}

const TransactionDetailsModal: React.FC<TransactionDetailsModalProps> = ({
  isOpen,
  onClose,
  transaction
}) => {
  if (!isOpen || !transaction) return null;

  const details = [
    { label: 'Booking ID', value: transaction.bookingId },
    { label: 'Status', value: 'Payment successful' },
    { label: 'Customer', value: transaction.customer },
    { label: 'Vehicle model', value: transaction.vehicleModel },
    { label: 'Service type', value: 'Malfunction' },
    { label: 'Total Km', value: '21km' },
    { label: 'Date', value: transaction.date },
    { label: 'Towing operator', value: 'Move360' },
    { label: 'Pickup', value: '14, Aku str, Ogudu GRA, Ogudu' },
    { label: 'Drop-off', value: 'Mechanic Village Ikeja' },
  ];

  return (
    <div className="fixed inset-0 bg-[#38383880] z-[9999] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-[490px] relative">
        <div className="flex justify-between items-center border-b border-[#F2F4F7] px-6 py-4">
          <h2 className="text-[#1C2023] text-lg font-medium">Transaction Details</h2>
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
              <div className="text-[32px] font-medium text-[#1C2023] mb-2">{transaction.amount}</div>
              <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-[#ECFDF3]">
                <div className="w-1.5 h-1.5 rounded-full bg-[#12B76A]"></div>
                <span className="text-[#027A48] text-sm">Success</span>
              </div>
            </div>

            <div className="space-y-4">
              {details.map((detail, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-[#667085] text-md">{detail.label}</span>
                  <span className="text-[#475467] text-sm font-medium">{detail.value}</span>
                </div>
              ))}
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

export default TransactionDetailsModal; 