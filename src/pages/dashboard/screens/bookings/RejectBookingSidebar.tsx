// src/pages/dashboard/screens/bookings/RejectBookingSidebar.tsx
import React, { useState } from 'react';
import { Form, Select, Button } from 'antd';

interface RejectBookingSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  booking: any; // Assuming you might still need booking details for rejection logic
}

const RejectBookingSidebar: React.FC<RejectBookingSidebarProps> = ({
  isOpen,
  onClose,
  booking,
}) => {
  const [rejectionReason, setRejectionReason] = useState<string | undefined>(undefined);

  if (!isOpen || !booking) {
    return null;
  }

  const handleReject = () => {
    console.log('Implement Reject Logic');
    // TODO: Implement reject logic here, using rejectionReason
    console.log('Rejected booking ID:', booking?.booking_ref, 'with reason:', rejectionReason);
    onClose();
  };

  const handleRejectionReasonChange = (value: string) => {
    setRejectionReason(value);
  };

  return (
    <div className="fixed inset-0 z-[999] flex justify-end bg-[#38383880] p-5 bg-opacity-50" onClick={onClose}>
      <div className="md:w-[48%] lg:w-1/3 w-100 z-[9999] h-full bg-white rounded-xl slide-in overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center py-3 px-6 border-b border-[#D6DADD]">
          <h2 className="text-md font-semibold text-[#1C2023]">Reject Booking</h2>
          <button
            onClick={onClose}
            className="text-[#7D8489] bg-[#EEF0F2] cursor-pointer py-2 px-3 rounded-3xl hover:text-black"
          >
            ✕
          </button>
        </div>
        <div className='overflow-y-auto flex flex-col h-[calc(100vh-160px)] slide-in scrollbar-hide hover:scrollbar-show px-7 py-4'>

          {/* Booking and Customer Details added here */}
           <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-medium text-[#475467]">Booking ID {booking?.booking_ref}</h3>
                {/* Assuming status might still be relevant */}
                {/* <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-yellow-100 text-yellow-800">Pending</span> */}
          </div>
           <div className="mb-3 p-4 border border-[#E5E9F0] rounded-lg">
            <div className="grid grid-cols-2 gap-4 text-sm text-[#475467]">
              <div className=''>
                <p className="font-medium mb-2">Pickup</p>
                <p className="font-medium mb-2">Destination</p>
                <p className="font-medium">Pickup landmark</p>

              </div>
              <div className='text-right'>
                <p className='mb-2 capitalize'>{booking?.start_address}</p>
                <p className='mb-2 capitalize'>{booking?.end_address}</p>
                <p className='capitalize'>{booking?.landmark}</p>
              </div>
            </div>
          </div>

          <div className="mb-3 p-4 border border-[#E5E9F0] rounded-lg">
             <div className="grid grid-cols-2 gap-4 text-sm text-[#475467]">
                <div className=''>
                  <p className="font-medium mb-2">Customer Name</p>
                  <p className="font-medium mb-2">Email</p>
                  <p className="font-medium">Phone number</p>
                </div>
                 <div className='text-right'>
                  <p className='mb-2 capitalize'>{booking?.user_data?.first_name} {booking?.user_data?.last_name}</p>
                  <p className='mb-2 capitalize'>{booking?.user_data?.email || 'N/A'}</p>
                  <p className='capitalize'>{booking?.user_data?.phone_number || 'N/A'}</p>
                </div>
             </div>
          </div>

          <div className="mb-3 p-4 border border-[#E5E9F0] rounded-lg">
             <div className="grid grid-cols-2 gap-4 text-sm text-[#475467]">
                <div className=''>
                  <p className="font-medium mb-2">Vehicle model</p>
                  <p className="font-medium mb-2">Vehicle colour</p>
                  <p className="font-medium mb-2">Number plate</p>
                  <p className="font-medium mb-2">Reason for towing</p>
                  <p className="font-medium">Vehicle loading status</p>
                </div>
                 <div className='text-right'>
                  <p className='mb-2 capitalize'>{booking?.vehicle_model}</p>
                  <p className='mb-2 capitalize'>{booking?.vehicle_color}</p>
                  <p className='mb-2 capitalize'>{booking?.plate_number}</p>
                  <p className='mb-2 capitalize'>{booking?.tow_reason}</p>
                  <p className='capitalize'>{booking?.vehicle_loaded === 1 ? 'Loaded' : 'Unloaded'}</p>
                </div>
             </div>
          </div>

          <Form layout="vertical"> {/* Using a form just for item layout, no submit */}
             <Form.Item label="Reason for rejection" rules={[{ required: true, message: 'Please select a rejection reason!' }]}> {/* Added required rule */}
                <Select placeholder="Select" className='!h-[42px]' onChange={handleRejectionReasonChange} value={rejectionReason}>
                   <Select.Option value="customer_cancelled">Customer Cancelled</Select.Option>
                   <Select.Option value="operator_unavailable">Operator Unavailable</Select.Option>
                   <Select.Option value="vehicle_issue">Vehicle Issue</Select.Option>
                   <Select.Option value="other">Other</Select.Option>
                </Select>
             </Form.Item>
          </Form>

          <div className="py-4 flex justify-end"> {/* Buttons below the form item */}
             <Button onClick={handleReject} className="h-[46px]! px-10! rounded-lg border border-[#FF6C2D] bg-[#FF6C2D]
               py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 " disabled={!rejectionReason}> {/* Disable if no reason selected */}
               Reject
             </Button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default RejectBookingSidebar;