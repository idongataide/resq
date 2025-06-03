import React, { useState, useEffect } from 'react';
import { Form, Select, Button, Input } from 'antd';
import { useGetDriversByOperatorId, useAllService, useGetAssetsbyCord } from '@/hooks/useAdmin';
import { approveTowingRequest } from '@/api/bookingsApi';
import toast from 'react-hot-toast';

interface ApproveBookingSidebarProps {
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
  mutate: () => void;
}

const ApproveBookingSidebar: React.FC<ApproveBookingSidebarProps> = ({
  isOpen,
  onClose,
  booking,
  fees,
  mutate
}) => {
  const [form] = Form.useForm();
  const [towingOperator, setTowingOperator] = useState<string | undefined>(undefined);
  const [selectedOperatorName, setSelectedOperatorName] = useState<string | undefined>(undefined);
  const [serviceType, setServiceType] = useState<string | undefined>(undefined);
  const [service, setService] = useState<string | undefined>(undefined);
  const [serviceFee, setServiceFee] = useState<number | undefined>(undefined);
  const [serviceId, setServiceID] = useState<number | undefined>(undefined);
  const [vehicle, setVehicle] = useState<string | undefined>(undefined);
  const [driver, setDriver] = useState<string | undefined>(undefined);
  const [selectedAsset, setSelectedAsset] = useState<any>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const longitude = booking?.start_coord?.longitude;
  const latitude = booking?.start_coord?.latitude;

  const { data: drivers, isLoading: isLoadingDrivers } = useGetDriversByOperatorId(towingOperator);
  const { data: services, isLoading: isLoadingServices } = useAllService(serviceType);
  const { data: assets, isLoading: isLoadingAssets } = useGetAssetsbyCord(longitude, latitude);

  useEffect(() => {
      setDriver(undefined);
  }, [towingOperator]);

   useEffect(() => {
      setService(undefined);
  }, [serviceType]);

  useEffect(() => {
    setVehicle(undefined);
    setTowingOperator(undefined);
    setSelectedOperatorName(undefined);
  }, [isOpen, booking]);

  useEffect(() => {
    if (service) {
      const selectedService = services?.find((s: any) => s.id === service);
      if (selectedService) {
        setServiceFee(selectedService.amount);
      }
    }
  }, [service, services]);

  const pickupFee = fees?.find(fee => fee.tag === 'PICK_UP_FEE')?.amount || 0;
  const dropoffFee = fees?.find(fee => fee.tag === 'DROP_OFF_FEE')?.amount || 0;

  if (!isOpen || !booking) {
    return null;
  }

  const handleFinish = async () => {
    try {
      setIsSubmitting(true);
      const res = await approveTowingRequest(booking?.towing_id, {
        tow_company_id: towingOperator || '',
        asset_id: vehicle || '',
        driver_id: driver || '',
        service_id: String(serviceId) || ''
      });
         
      if (res.status === 'ok') {
        toast.success('Booking approved successfully');
        mutate(); // Refresh the booking data
      }
      else{
        const errorMsg = res?.response?.data?.msg;
        toast.error(errorMsg || 'Failed to approve booking');
      }
      onClose();
    } catch (error) {
      toast.error('Failed to approve booking');
      console.error('Approval error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAssetChange = (value: string) => {
    setVehicle(value);
    const asset = assets?.find((asset: any) => asset.asset_id === value);
    if (asset) {
      setSelectedAsset(asset);
      setTowingOperator(asset.operator_id);
      setSelectedOperatorName(asset.operator_data?.name);
      form.setFieldsValue({ towingOperator: asset.operator_data?.name });
    }
  };

  const handleServiceChange = (value: string) => {
    setService(value);
    const selectedService = services?.find((s: any) => s.name === value);
    if (selectedService) {
      setServiceFee(selectedService.amount);
      setServiceID(selectedService.service_id);
      form.setFieldsValue({ service: value });
    }
  };

  return (
    <div className="fixed inset-0 z-[999] flex justify-end bg-[#38383880] p-5 bg-opacity-50" onClick={onClose}>
      <div className="md:w-[48%] lg:w-1/3 w-100 z-[9999] h-full bg-white rounded-xl slide-in overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center py-3 px-6 border-b border-[#D6DADD]">
          <h2 className="text-md font-semibold text-[#1C2023]">Approve Booking</h2>
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
                <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-yellow-100 text-yellow-800">Pending</span>
          </div>
          <div className="mb-3 p-4 border border-[#E5E9F0] rounded-lg">
            <div className="grid grid-cols-2 gap-4 text-sm text-[#475467]">
              <div className=''>
                <p className="font-normal mb-3 text-[#667085]">Pickups</p>
                <p className="font-normal mb-3 text-[#667085]">Destination</p>
                <p className="font-normal mb-3 text-[#667085]">Pickup landmark</p>

              </div>
              <div className='text-right'>
                <p className='font-normal mb-3 text-[#475467] capitalize'>{booking?.start_address}</p>
                <p className='font-normal mb-3 text-[#475467] capitalize'>{booking?.end_address}</p>
                <p className='font-normal mb-3 text-[#475467] capitalize'>{booking?.landmark}</p>
              </div>
            </div>
          </div>

          <div className="mb-3 p-4 border border-[#E5E9F0] rounded-lg">
             <div className="grid grid-cols-2 gap-4 text-sm text-[#475467]">
                <div className=''>
                  <p className="font-normal mb-3 text-[#667085]">Customer Name</p>
                  <p className="font-normal mb-3 text-[#667085]">Email</p>
                  <p className="font-normal  text-[#667085]">Phone number</p>
                </div>
                 <div className='text-right'>
                  <p className='font-medium mb-3 text-[#475467] capitalize'>{booking?.user_data?.first_name} {booking?.user_data?.last_name}</p>
                  <p className='font-medium mb-3 text-[#475467] capitalize'>{booking?.user_data?.email || 'N/A'}</p>
                  <p className='font-medium  text-[#475467] capitalize'>{booking?.user_data?.phone_number || 'N/A'}</p>
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
                  <p className="text-[#667085]">Vehicle loading status</p>
                </div>
                 <div className='text-right'>
                  <p className='font-medium mb-3 text-[#475467] capitalize'>{booking?.vehicle_model}</p>
                  <p className='font-medium mb-3 text-[#475467] capitalize'>{booking?.vehicle_color}</p>
                  <p className='font-medium mb-3 text-[#475467] capitalize'>{booking?.plate_number}</p>
                  <p className='font-medium mb-3 text-[#475467] capitalize'>{booking?.tow_reason}</p>
                  <p className='font-medium text-[#475467] capitalize'>{booking?.vehicle_loaded === 1 ? 'Loaded' : 'Unloaded'}</p>
                </div>
             </div>
          </div>

          <Form form={form} layout="vertical" onFinish={handleFinish} className="flex flex-col justify-between flex-grow">
            <div>
             <Form.Item label="Vehicle (Asset)" name="vehicle" rules={[{ required: true, message: 'Please select a vehicle!' }]}>
                <Select placeholder="Select" value={vehicle} onChange={handleAssetChange} className='!h-[42px]' loading={isLoadingAssets}>
                   {assets?.map((asset: any, index:number) => (
                      <Select.Option key={index} value={asset.asset_id}>
                          {`${asset.brand_name || asset.vehicle_model} (${(asset?.distance_km || 0).toFixed(2)}km Away)`}
                      </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item label="Towing operator" name="towingOperator">
                 <Input value={selectedOperatorName} readOnly className='!h-[42px]' placeholder="Select an asset to see operator" />
              </Form.Item>

              <Form.Item label="Service type" name="serviceType" rules={[{ required: true, message: 'Please select a service type!' }]}>
                <Select placeholder="Select" value={serviceType} onChange={setServiceType} className='!h-[42px]'>
                  <Select.Option value="private ">Private </Select.Option>
                  <Select.Option value="commercial">Commercial</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item label="Service" name="service" rules={[{ required: true, message: 'Please select a service!' }]}>
                <Select placeholder="Select" value={service} onChange={handleServiceChange} className='!h-[42px]' loading={isLoadingServices}>
                  {services?.map((service: any, index:number) => (
                      <Select.Option key={index} value={service.name}>
                          {service.name} - ₦{service.amount}
                      </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item label="Select Driver" name="driver" rules={[{ required: true, message: 'Please select a driver!' }]}>
                <Select placeholder="Select" value={driver} onChange={setDriver} className='!h-[42px]' loading={isLoadingDrivers} disabled={!towingOperator}>
                  {drivers?.map((driver: any, index:number) => (
                      <Select.Option key={index} value={driver.driver_id}>
                          {`${driver.first_name} ${driver.last_name}`}
                      </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <div className="mb-6 p-4 border border-[#E5E9F0] rounded-lg">
                <div className="grid grid-cols-2 gap-4 text-sm text-[#475467]">
                    <div className=''>
                      <p className="font-normal mb-3 text-[#667085]">Approx. Distance</p>
                      <p className="font-normal mb-3 text-[#667085]">Service Cost</p>
                      <p className="font-normal mb-3 text-[#667085]">Pickup (Cost/Km)</p>
                      <p className="font-normal mb-3 text-[#667085]">Dropup (Cost/Km)</p>
                    </div>
                    <div className='text-right'>
                      <p className='font-normal mb-3 text-[#475467] capitalize'>{booking?.drop_off_dst + (selectedAsset?.distance_km || 0)}km</p>
                      <p className='font-normal mb-3 text-[#475467] capitalize'>₦{serviceFee}</p>
                      <p className='font-normal mb-3 text-[#475467] capitalize'>₦{pickupFee}/km</p>
                      <p className='font-normal mb-3 text-[#475467] capitalize'>₦{dropoffFee}/km</p>
                    </div>
                </div>
            </div>

            </div>

            <div className="border-t border-gray-200 py-4 flex justify-end gap-3">
                 <Button 
                   type="primary" 
                   htmlType="submit" 
                   loading={isSubmitting}
                   className="rounded-md h-[46px]! px-10! border border-transparent bg-[#FF6C2D] py-2 text-sm font-medium text-white shadow-sm hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                 >
                  Approve
                </Button>
            </div>

          </Form>
        </div>
      </div>
    </div>
  );
};

export default ApproveBookingSidebar; 