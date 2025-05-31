import React, { useState, useEffect } from 'react';
import { useAllService } from '@/hooks/useAdmin';

interface AcceptedBookingsSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  booking: any;
  fees: Array<{
    name: string;
    tag: string;
    slug: string;
    amount: number;
    amount_type: string;
    amount_sufix: string;
    data: any[];
    createdAt: string;
    updatedAt: string;
    fee_id: string;
  }>;
}

const AcceptedBookingsSidebar: React.FC<AcceptedBookingsSidebarProps> = ({
  isOpen,
  onClose,
  booking,
  fees,
}) => {
  const { data: services } = useAllService(booking?.vehicle_reg);
  const [serviceName, setServiceName] = useState<string | undefined>(undefined);
  const [serviceType, setServiceType] = useState<string | undefined>(undefined);

  const pickupFee = fees?.find(fee => fee.tag === 'PICK_UP_FEE')?.amount || 0;
  const dropoffFee = fees?.find(fee => fee.tag === 'DROP_OFF_FEE')?.amount || 0;

  useEffect(() => {
    if (services && booking?.service_id) {
      const selectedService = services.find((s: any) => s.service_id === booking.service_id);
      if (selectedService) {
        setServiceName(selectedService.name);
        setServiceType(selectedService.service_type);
      }
    }
  }, [services, booking?.service_id]);

  if (!isOpen || !booking) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[999] flex justify-end bg-[#38383880] p-5 bg-opacity-50" onClick={onClose}>
      <div className="md:w-[48%] lg:w-1/3 w-100 z-[9999] h-full bg-white rounded-xl slide-in overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center py-3 px-6 border-b border-[#D6DADD]">
          <h2 className="text-md font-semibold text-[#1C2023]">Approved Booking</h2>
          <button
            onClick={onClose}
            className="text-[#7D8489] bg-[#EEF0F2] cursor-pointer py-2 px-3 rounded-3xl hover:text-black"
          >
            ✕
          </button>
        </div>
        <div className='overflow-y-auto flex flex-col h-[calc(100vh-160px)] slide-in scrollbar-hide hover:scrollbar-show px-7 py-4'>

           <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-normal mb-3 text-[#667085]">Booking ID {booking?.booking_ref}</h3>
                <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${booking?.charge_status === 0 ? 'bg-[#EBF7FF] text-[#4387D8]' : 'bg-[#ECFDF3] text-[#027A48]'}`}>
                  {booking?.charge_status === 0 ? 'Awaiting payment' : 'Paid'}
                </span>
          </div>

          <div className="mb-3 p-4 border border-[#E5E9F0] rounded-lg">
             <div className="grid grid-cols-2 gap-4 text-sm text-[#475467]">
                <div className=''>
                  <p className="font-normal mb-3 text-[#667085]">Customer Name</p>
                  <p className="font-normal mb-3 text-[#667085]">Email</p>
                  <p className="font-normal mb-3 text-[#667085]">Phone number</p>
                </div>
                 <div className='text-right'>
                  <p className='font-normal mb-3 text-[#475467] capitalize'>{booking?.user_data?.first_name} {booking?.user_data?.last_name}</p>
                  <p className='font-normal mb-3 text-[#475467] capitalize'>{booking?.user_data?.email || 'N/A'}</p>
                  <p className='font-normal mb-3 text-[#475467] capitalize'>{booking?.user_data?.phone_number || 'N/A'}</p>
                </div>
             </div>
          </div>

          <div className="mb-3 p-4 border border-[#E5E9F0] rounded-lg">
             <div className="grid grid-cols-2 gap-4 text-sm text-[#475467]">
                <div className=''>
                  <p className="font-normal mb-3 text-[#667085]">Vehicle model</p>
                  <p className="font-normal mb-3 text-[#667085]">Vehicle colour</p>
                  <p className="font-normal mb-3 text-[#667085]">Number plate</p>
                  <p className="font-normal mb-3 text-[#667085]">Reason for towing</p>
                  <p className="font-normal  text-[#667085]">Vehicle loading status</p>
                </div>
                 <div className='text-right'>
                  <p className='font-normal mb-3 text-[#475467] capitalize'>{booking?.vehicle_model}</p>
                  <p className='font-normal mb-3 text-[#475467] capitalize'>{booking?.vehicle_color}</p>
                  <p className='font-normal mb-3 text-[#475467] capitalize'>{booking?.plate_number}</p>
                  <p className='font-normal mb-3 text-[#475467] capitalize'>{booking?.tow_reason}</p>
                  <p className='font-normal  text-[#475467] capitalize'>{booking?.vehicle_loaded === 1 ? 'Loaded' : 'Unloaded'}</p>
                </div>
             </div>
          </div>

          <div className="mb-3 p-4 border border-[#E5E9F0] rounded-lg">
            <div className="grid grid-cols-2 gap-4 text-sm text-[#475467]">
              <div className=''>
                <p className="font-normal mb-3 text-[#667085]">Pickups</p>
                <p className="font-normal mb-3 text-[#667085]">Destination</p>
                <p className="font-normal  text-[#667085]">Pickup landmark</p>

              </div>
              <div className='text-right'>
                <p className='font-normal mb-3 text-[#475467] capitalize'>{booking?.start_address}</p>
                <p className='font-normal mb-3 text-[#475467] capitalize'>{booking?.end_address}</p>
                <p className='font-normal  text-[#475467] capitalize'>{booking?.landmark}</p>
              </div>
            </div>
          </div>

          <div className="mb-6 p-4 border border-[#E5E9F0] rounded-lg">
             <div className="grid grid-cols-2 gap-4 text-sm text-[#475467]">
                <div className=''>
                  <p className="font-normal mb-3 text-[#667085]">Towing operator</p>
                  <p className="font-normal mb-3 text-[#667085]">Service type</p>
                  <p className="font-normal mb-3 text-[#667085]">Service</p>
                  <p className="font-normal mb-3 text-[#667085]">Vehicle assets</p>
                  <p className="font-normal mb-3 text-[#667085]">Approx. Distance</p>
                  <p className="font-normal mb-3 text-[#667085]">Service Cost</p>
                  <p className="font-normal mb-3 text-[#667085]">Pickup (Cost/Km)</p>
                  <p className="font-normal  text-[#667085]">Drop off (Cost/Km)</p>
                </div>
                 <div className='text-right'>
                  <p className='font-normal mb-3 text-[#475467] capitalize'>{booking?.operator?.name || 'N/A'}</p>
                  <p className='font-normal mb-3 text-[#475467] capitalize'>{serviceType || 'N/A'}</p>{/* Assuming vehicle_reg is the service type */}
                  <p className='font-normal mb-3 text-[#475467] capitalize'>{serviceName || 'N/A'}</p>
                  <p className='font-normal mb-3 text-[#475467] capitalize'>{booking?.asset_data?.plate_number || 'N/A'}</p>
                  <p className='font-normal mb-3 text-[#475467] capitalize'>{booking?.drop_off_dst?.toFixed(2)}km</p>
                  <p className='font-normal mb-3 text-[#475467] capitalize'>₦{booking?.service_fee?.toLocaleString() || 'N/A'}</p>
                  <p className='font-normal mb-3 text-[#475467] capitalize'>₦{pickupFee}/km</p>
                  <p className='font-normal  text-[#475467] capitalize'>₦{dropoffFee}/km</p>
                </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AcceptedBookingsSidebar; 