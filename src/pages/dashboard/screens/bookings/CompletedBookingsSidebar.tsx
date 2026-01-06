
import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa';
import { Input, Form, Button } from 'antd';
import toast from 'react-hot-toast';
import BookingInfo from '@/components/BookingInfo';
import { CopyOutlined, LinkOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import { sendLink } from '@/api/sendLinkApi';

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


  const [isLinkExpanded, setIsLinkExpanded] = useState(false);
  const [isSendingLink, setIsSendingLink] = useState(false);
  const [form] = Form.useForm();
  
  const paymentUrl = `${window.location.origin}/payment/search?plate=${booking?.plate_number}`;

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
      <div className="md:w-[60%] lg:w-1/3 w-100 z-[9999] h-full bg-white rounded-xl slide-in overflow-hidden" onClick={e => e.stopPropagation()}>
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

          {booking?.rating_data && (
            <div className=''>
                <span className='text-[#475467] text-md font-semibold mb-2'>Customer Review</span>
                <div className='bg-[#F9FAFB] p-4 rounded-lg'>
                  <div className="flex items-center gap-2 mb-2">
                    <div className='flex items-center mb-1'>
                        <div className='bg-[#FF8957] me-2 font-bold text-white rounded-full h-9 w-9 flex items-center justify-center '>
                            MV
                        </div>
                        <span className="text-md font-medium text-[#475467]">{booking?.user_data?.first_name  + ' ' + booking?.user_data?.last_name}  </span>
                    </div>

                    <div className="flex items-center ms-auto">
                      {[...Array(5)].map((_, index) => (
                        <FaStar
                          key={index}
                          className={`w-4 h-4 ${
                            index < (booking?.rating_data?.rating || 0) ? 'text-yellow-500' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  {booking?.rating_data?.comment && (
                    <p className="text-md text-[#475467]">"{booking?.rating_data?.comment}"</p>
                  )}
                </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default CompletedBookingsSidebar; 