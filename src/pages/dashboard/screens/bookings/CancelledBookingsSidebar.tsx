import BookingInfo from '@/components/BookingInfo';

interface CancelledBookingsSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  booking: any;
}

const CancelledBookingsSidebar: React.FC<CancelledBookingsSidebarProps> = ({
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
          <h2 className="text-md font-semibold text-[#1C2023]">Cancelled Booking</h2>
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
                <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-red-100 text-red-800">Cancelled</span>
          </div>

          <BookingInfo booking={booking} showCancellationDetails={true} />


        </div>
      </div>
    </div>
  );
};

export default CancelledBookingsSidebar; 