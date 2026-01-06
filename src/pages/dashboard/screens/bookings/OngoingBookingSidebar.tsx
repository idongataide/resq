import React, { useState } from 'react';
import { confirmPickupArrival, confirmDestinationArrival } from '@/api/settingsApi';
import { Input, Form, Button } from 'antd';
import toast from 'react-hot-toast';
import BookingInfo from '@/components/BookingInfo';
import { useNavigate } from 'react-router-dom';
import { CopyOutlined, LinkOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import { sendLink } from '@/api/sendLinkApi';

interface OngoingBookingsSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  booking: any;
  rating_data?: {
    _id: string;
    towing_id: string;
    receiver_auth_id: string;
    sender_auth_id: string;
    receiver_user_type: string;
    comment: string;
    rating: number;
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
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
  const [isLinkExpanded, setIsLinkExpanded] = useState(false);
  const [isSendingLink, setIsSendingLink] = useState(false);
  const [form] = Form.useForm();
  
  const paymentUrl = `${window.location.origin}/payment/search?plate=${booking?.plate_number}`;

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

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(paymentUrl);
      toast.success('Link copied to clipboard!');
    } catch (err) {
      toast.error('Failed to copy link');
    }
  };

  const handleGenerateLink = () => {
    setIsLinkExpanded(!isLinkExpanded);
  };

  const handleSendLink = async (values: { email: string; phone: string }) => {
    if (!booking?.towing_id) {
      toast.error('Towing ID not found');
      return;
    }
    if (!values.email && !values.phone) {
      toast.error('Please provide at least an email or phone number');
      return;
    }

    setIsSendingLink(true);
    try {
      const response = await sendLink(booking.towing_id, values);
      
      if (response?.status === 'ok') {
        toast.success('Link sent successfully!');
        form.resetFields();
        setIsLinkExpanded(false);
      } else {
        toast.error(response?.message || 'Failed to send link');
      }
    } catch (error: any) {
      console.error('Error sending link:', error);
      toast.error(error?.response?.data?.message || 'Failed to send link');
    } finally {
      setIsSendingLink(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[999] flex justify-end bg-[#38383880] p-5 bg-opacity-50" onClick={onClose}>
      <div className="md:w-[58%] lg:w-1/3 w-100 z-[9999] h-full bg-white rounded-xl slide-in overflow-hidden" onClick={e => e.stopPropagation()}>
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
            
            {/* Link Buttons Section */}
            <div className="mb-4 p-4 border border-[#E5E9F0] mt-3 rounded-lg bg-gray-50">
              {!isLinkExpanded && (
              <div className="flex gap-3">
                <button
                  onClick={handleCopyLink}
                  className="flex-1 flex items-center cursor-pointer justify-center gap-2 py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <CopyOutlined />
                  <span className="text-sm font-medium text-gray-700">Copy link</span>
                </button>
                <button
                  onClick={handleGenerateLink}
                  className="flex-1 flex items-center justify-center gap-2 py-2 px-4 bg-[#FF6C2D] text-white rounded-lg hover:bg-orange-600 transition-colors"
                >
                  <LinkOutlined />
                  <span className="text-sm font-medium">Generate link</span>
                </button>
              </div>
              )}
              
              {/* Expandable Email/Phone Form */}
              {isLinkExpanded && (
                <div className="mt-4 animate-fade-in">
                  
                  <Form
                    form={form}
                    onFinish={handleSendLink}
                    layout="vertical"
                    size="middle"
                  >
                    <div className="space-y-4">
                      <Form.Item
                        name="email"
                        className='mb-1!'
                        rules={[
                          { required: false, message: 'Please enter email address' },
                          { type: 'email', message: 'Please enter a valid email' }
                        ]}
                      >
                        <Input
                          prefix={<MailOutlined className="text-gray-400" />}
                          placeholder="Email Address"
                          size="middle"
                          className="w-full "
                        />
                      </Form.Item>

                      <div className='text-center font-semibold mx-auto mb-1!'>or</div>
                      
                      <Form.Item
                        name="phone"
                        rules={[
                          { required: false, message: 'Please enter phone number' }
                        ]}
                      >
                        <Input
                          prefix={<PhoneOutlined className="text-gray-400" />}
                          placeholder="Phone number"
                          size="middle"
                          addonBefore={
                            <span className="text-gray-600">+234</span>
                          }
                          className="w-full"
                        />
                      </Form.Item>
                      
                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() => setIsLinkExpanded(false)}
                          className="flex-1 py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
                        >
                          Cancel
                        </button>
                          <Button
                            type="primary"
                            htmlType="submit"
                            disabled={isSendingLink}
                            loading={isSendingLink}
                            className="flex-1 py-2 px-4 h-[43px]! bg-[#FF6C2D]! text-white! rounded-lg hover:bg-orange-600 transition-colors "
                          >
                          {isSendingLink ? 'Sending...' : 'Share link'}
                        </Button>
                      </div>
                    </div>
                  </Form>
                </div>
              )}
            </div>
            
            <div className="flex flex-col gap-0.5">
              {steps.map((step, idx) => (
                <div key={step.key} className="flex items-start gap-3 mb-2">
                  <div className="flex flex-col items-center">
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center border-2 ${
                        idx === activeStep
                          ? 'border-[#FF6C2D] bg-orange-100 text-[#FF6C2D]'
                          : 'border-gray-300 bg-white text-gray-400'
                      }`}
                    >
                      {idx <= activeStep ? (
                        <span className="w-2 h-2 rounded-full bg-[#FF6C2D] block"></span>
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
                          className="mt-2 px-3 py-1 mb-2 cursor-pointer bg-[#FF6C2D] text-white rounded disabled:opacity-50"
                          style={{ fontSize: 14 }}
                          onClick={handlePickupConfirm}
                          disabled={pickupLoading}
                        >
                          {pickupLoading ? 'Confirming...' : 'Confirm'}
                        </button>
                      )}
                      {step.confirm && step.key === 'destination' && (
                        <button
                          className="mt-2 px-3 cursor-pointer py-1 mb-3 bg-[#FF6C2D] text-white rounded disabled:opacity-50"
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