import BookingInfo from '@/components/BookingInfo';

interface CompletedBookingsSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  booking: any;
 
}

const CompletedBookingsSidebar: React.FC<CompletedBookingsSidebarProps> = ({
  isOpen,
  onClose,
  booking,
}) => {


  if (!isOpen || !booking) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[999] flex justify-end bg-[#38383880] p-5 bg-opacity-50" onClick={onClose}>
      <div className="md:w-[68%] lg:w-1/3 w-100 z-[9999] h-full bg-white rounded-xl slide-in overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center py-3 px-6 border-b border-[#D6DADD]">
          <h2 className="text-md font-semibold text-[#1C2023]">Completed Booking</h2>
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
                {/* Display status based on booking data */}
                <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-green-100 text-green-800">Completed</span>
          </div>

          <BookingInfo booking={booking} />

         {/* Towing Details */}
          <div className="mb-6 p-4 border border-[#E5E9F0] rounded-lg">
            <div className="text-sm text-[#475467] space-y-3">
              <div className="flex items-center">
                <div className="w-[30%]">
                  <p className="font-normal text-[#667085]">Towing operator</p>
                </div>             
                <div className="w-[70%] text-right pl-2">
                  <p className="font-medium text-[#475467] break-words capitalize">
                    {booking?.operator?.name || 'N/A'}
                  </p>
                </div> 
              </div>
              
              <div className="flex items-center">
                <div className="w-[30%]">
                  <p className="font-normal text-[#667085]">Service type</p>
                </div>             
                <div className="w-[70%] text-right pl-2">
                  <p className="font-medium text-[#475467] break-words capitalize">
                    {booking?.service_data?.service_type || 'N/A'}
                  </p>
                </div> 
              </div>
              
              <div className="flex items-center">
                <div className="w-[30%]">
                  <p className="font-normal text-[#667085]">Service</p>
                </div>             
                <div className="w-[70%] text-right pl-2">
                  <p className="font-medium text-[#475467] break-words capitalize">
                    {booking?.service_data?.name || 'N/A'}
                  </p>
                </div> 
              </div>
              
              <div className="flex items-center">
                <div className="w-[30%]">
                  <p className="font-normal text-[#667085]">Vehicle assets</p>
                </div>             
                <div className="w-[70%] text-right pl-2">
                  <p className="font-medium text-[#475467] break-words capitalize">
                    {booking?.asset_data?.plate_number || 'N/A'}
                  </p>
                </div> 
              </div>
              
              <div className="flex items-center">
                <div className="w-[30%]">
                  <p className="font-normal text-[#667085]">Approx. Distance</p>
                </div>             
                <div className="w-[70%] text-right pl-2">
                  <p className="font-medium text-[#475467] break-words capitalize">
                    {booking?.drop_off_dst}km
                  </p>
                </div> 
              </div>
              
              <div className="flex items-center">
                <div className="w-[30%]">
                  <p className="font-normal text-[#667085]">Service Cost</p>
                </div>             
                <div className="w-[70%] text-right pl-2">
                  <p className="font-medium text-[#475467] break-words capitalize">
                    ₦{booking?.service_fee?.toLocaleString() || 'N/A'}
                  </p>
                </div> 
              </div>
              
              <div className="flex items-center">
                <div className="w-[30%]">
                  <p className="font-normal text-[#667085]">Pickup (Cost/Km)</p>
                </div>             
                <div className="w-[70%] text-right pl-2">
                  <p className="font-medium text-[#475467] break-words capitalize">
                    ₦{booking?.towing_params?.pickupFee}/km
                  </p>
                </div> 
              </div>
              
              <div className="flex items-center">
                <div className="w-[30%]">
                  <p className="font-normal text-[#667085]">Drop off (Cost/Km)</p>
                </div>             
                <div className="w-[70%] text-right pl-2">
                  <p className="font-medium text-[#475467] break-words capitalize">
                    ₦{booking?.towing_params?.dropoffFee}/km
                  </p>
                </div> 
              </div>
              
              <div className="flex items-center">
                <div className="w-[30%]">
                  <p className="font-medium text-[#667085]">Total</p>
                </div>             
                <div className="w-[70%] text-right pl-2">
                  <p className="font-bold text-[#475467] break-words capitalize">
                    ₦{booking?.est_fare?.toLocaleString() || 'N/A'}
                  </p>
                </div> 
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CompletedBookingsSidebar; 