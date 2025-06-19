import React, { useState } from 'react';
import { confirmPickupArrival, confirmDestinationArrival } from '@/api/settingsApi';
import toast from 'react-hot-toast';
import BookingInfo from '@/components/BookingInfo';
import { useNavigate } from 'react-router-dom';

interface OngoingBookingsSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  booking: any; 
  mutate: () => void;
}

const OngoingBookingsSidebar: React.FC<OngoingBookingsSidebarProps> = ({
  isOpen,
  onClose,
  booking,
  mutate
}) => {
  const navigate = useNavigate();
  const [pickupLoading, setPickupLoading] = useState(false);
  const [destinationLoading, setDestinationLoading] = useState(false);

  const steps = [
    {
      key: 'request',
      title: 'Booking request made',
      message: 'Booking payment has been completed successfully.',
      time: 'Today, 10:40am',
      confirm: false,
    },
    {
      key: 'ongoing',
      title: 'Booking is ongoing',
      message: 'This booking is currently ongoing and driver is enroute',
      time: 'Today, 10:40am',
      confirm: false,
    },
    {
      key: 'pickup',
      title: 'Arrived pickup location',
      message: booking?.ride_status !== 2 
        ? 'Kindly confirm that towing truck has arrived the pickup location' 
        : 'Towing van arrived pickup location',
      time: 'Today, 10:40am',
      confirm: booking?.ride_status !== 2,
    },
    {
      key: 'destination',
      title: 'Arrived destination',
      message: booking?.ride_status !== 3 
        ? 'Kindly confirm that towing truck has arrived the destination' 
        : 'Towing van arrived destination',
      time: 'Today, 10:40am',
      confirm: booking?.ride_status !== 3,
    },
  ];

  if (!isOpen || !booking) {
    return null;
  }

  let activeStep = 1; // Default to ongoing
  if (booking?.ride_status === 2) { // Arrived pickup
    activeStep = 2;
  } else if (booking?.ride_status === 3) { // Arrived destination
    activeStep = 3;
  }

  const handlePickupConfirm = async () => {
    setPickupLoading(true);
    if (!booking?.towing_id) {
      toast.error('Towing ID not found');
      setPickupLoading(false);
      return;
    }
  
    try {
      const response = await confirmPickupArrival(booking.towing_id);
      if (response?.status === 'ok') {
        toast.success('Pickup location arrival confirmed successfully');
        await mutate(); // Wait for the data to be refreshed
        onClose(); // Close the sidebar after successful confirmation
      } else {
        toast.error(response?.message || 'Failed to confirm pickup arrival');
      }
    } catch (error) {
      console.error('Error confirming pickup arrival:', error);
      toast.error('Failed to confirm pickup arrival');
    } finally {
      setPickupLoading(false);
    }
  };
  
  const handleDestinationConfirm = async () => {
    setDestinationLoading(true);
    if (!booking?.towing_id) {
      toast.error('Towing ID not found');
      setDestinationLoading(false);
      return;
    }
  
    try {
      const response = await confirmDestinationArrival(booking.towing_id);
      if (response?.status === 'ok') {
        toast.success('Destination arrival confirmed successfully');
        mutate(); // This will refresh the booking data
        onClose(); // Close the sidebar
        navigate('/bookings/completed'); // Navigate to completed bookings screen
      } else {
        toast.error(response?.message || 'Failed to confirm destination arrival');
      }
    } catch (error) {
      console.error('Error confirming destination arrival:', error);
      toast.error('Failed to confirm destination arrival');
    } finally {
      setDestinationLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[999] flex justify-end bg-[#38383880] p-5 bg-opacity-50" onClick={onClose}>
      <div className="md:w-[48%] lg:w-1/3 w-100 z-[9999] h-full bg-white rounded-xl slide-in overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center py-3 px-6 border-b border-[#D6DADD]">
          <h2 className="text-md font-semibold text-[#1C2023]">Ongoing Booking</h2>
          <button
            onClick={onClose}
            className="text-[#7D8489] bg-[#EEF0F2] cursor-pointer py-2 px-3 rounded-3xl hover:text-black"
          >
            ✕
          </button>
        </div>
        <div className='overflow-y-auto flex flex-col h-[calc(100vh-160px)] slide-in scrollbar-hide hover:scrollbar-show px-7 py-4'>

          {/* Booking Progress Stepper */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-medium text-[#475467]">Booking ID {booking?.booking_ref}</h3>
              <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-800">Ongoing</span>
            </div>
            <div className="flex flex-col gap-0.5">
              {steps.map((step, idx) => (
                <div key={step.key} className="flex items-start gap-3 mb-2">
                  <div className="flex flex-col items-center">
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center border-2 ${
                        idx === activeStep
                          ? 'border-orange-500 bg-orange-100 text-orange-500'
                          : 'border-gray-300 bg-white text-gray-400'
                      }`}
                    >
                      {idx <= activeStep ? (
                        <span className="w-2 h-2 rounded-full bg-orange-500 block"></span>
                      ) : (
                        <span className="w-2 h-2 rounded-full bg-gray-300 block"></span>
                      )}
                    </span>
                    {idx < steps.length - 1 && (
                      <span className="w-px flex-1 bg-gray-300" style={{ minHeight: 100 }}></span>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="font-[400] text-[#475467] mb-1">{step.title}</div>
                    <div className="mb-1 py-2 w-[80%] md:w-[80%] lg:w-[70%] border-[#F2F4F7] border px-3">
                      <div className="mt-2 text-sm font-medium text-[#475467]">{step.message}</div>
                      {step.confirm && step.key === 'pickup' && (
                        <button
                          className="mt-2 px-3 py-1 mb-2 cursor-pointer bg-orange-500 text-white rounded disabled:opacity-50"
                          style={{ fontSize: 14 }}
                          onClick={handlePickupConfirm}
                          disabled={pickupLoading}
                        >
                          {pickupLoading ? 'Confirming...' : 'Confirm'}
                        </button>
                      )}
                      {step.confirm && step.key === 'destination' && (
                        <button
                          className="mt-2 px-3 cursor-pointer py-1 mb-3 bg-orange-500 text-white rounded disabled:opacity-50"
                          style={{ fontSize: 14 }}
                          onClick={handleDestinationConfirm}
                          disabled={destinationLoading}
                        >
                          {destinationLoading ? 'Confirming...' : 'Confirm'}
                        </button>
                      )}
                    </div>
                    <div className="text-xs text-[#98A2B3]">{step.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <BookingInfo booking={booking} />

          {/* Service Details */}
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
                  <p className="font-normal mb-3 text-[#667085]">Drop off (Cost/Km)</p>
                  <p className="font-medium  text-[#667085]">Total</p>
                </div>
                <div className='text-right'>
                  <p className='font-medium mb-3 text-[#475467] capitalize'>{booking?.operator?.name || 'N/A'}</p>
                  <p className='font-medium mb-3 text-[#475467] capitalize'>{booking?.service_data?.service_type || 'N/A'}</p>
                  <p className='font-medium mb-3 text-[#475467] capitalize'>{booking?.service_data?.name || 'N/A'}</p>
                  <p className='font-medium mb-3 text-[#475467] capitalize'>{booking?.asset_data?.plate_number || 'N/A'}</p>
                  <p className='font-medium mb-3 text-[#475467] capitalize'>{booking?.drop_off_dst}km</p>
                  <p className='font-medium mb-3 text-[#475467] capitalize'>₦{booking?.service_fee?.toLocaleString() || 'N/A'}</p>
                  <p className='font-medium mb-3 text-[#475467] capitalize'>₦{booking?.towing_params?.pickupFee}/km</p>
                  <p className='font-medium mb-3 text-[#475467] capitalize'>₦{booking?.towing_params?.dropoffFee}/km</p>
                  <p className='font-bold mb-3 text-[#475467] capitalize'>₦{booking?.est_fare?.toLocaleString() || 'N/A'}</p>
                </div>
             </div>
          </div>

          
        </div>
      </div>
    </div>
  );
};

export default OngoingBookingsSidebar;