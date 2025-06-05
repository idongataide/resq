import React, { useState } from 'react';
import { Button, Form, Input, Select, AutoComplete } from 'antd';
import { MdOutlineCloudUpload } from 'react-icons/md';
import { addAssets } from '@/api/operatorsApi';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';

interface AddAssetProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  onAssetAdded?: () => void;
}

const { Option } = Select;

const AddAsset: React.FC<AddAssetProps> = ({ showModal, setShowModal, onAssetAdded }) => {
  const [form] = Form.useForm();
  const { id: operatorId } = useParams<{ id: string }>();
  const [availability, setAvailability] = useState<'Available' | 'Unavailable'>('Available');
  const [loading, setLoading] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [fetchedCoordinates, setFetchedCoordinates] = useState<{ longitude: number; latitude: number } | null>(null);
  const [addressSuggestions, setAddressSuggestions] = useState<string[]>([]);
  const [fetchingAddress] = useState(false);

  const handleClose = () => {
    setShowModal(false);
    form.resetFields();
    setAvailability('Available');
    setLoading(false);
    setFetchedCoordinates(null);
    setSelectedAddress('');
  };

  const fetchCoordinatesForAddress = async (address: string) => {
    if (!address) {
      setFetchedCoordinates(null);
      return;
    }

    setLoading(true);
    setFetchedCoordinates(null);
    setSelectedAddress(address);

    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=AIzaSyAw3wjMqZQWUIkMNHJCHZPcmyPeTfUnuGQ`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.status !== 'OK') {
        throw new Error(data.error_message || 'Failed to geocode address');
      }
      
      if (!data.results || data.results.length === 0) {
        throw new Error('No results found for this address');
      }
      
      const location = data.results[0].geometry.location;
      const coordinates = { 
        longitude: location.lng, 
        latitude: location.lat 
      };
      
      setFetchedCoordinates(coordinates);
      toast.success('Location found successfully');
      return coordinates;
    } catch (error) {
      console.error('Error fetching coordinates:', error);
      toast.error('Failed to get coordinates for this address');
      setFetchedCoordinates(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handleAddressSelect = (value: string) => {
    fetchCoordinatesForAddress(value);
    setAddressSuggestions([]);
  };

  const handleAddressSearch = (value: string) => {
    if (value.length > 3) {
      fetchCoordinatesForAddress(value);
    }
  };

  const handleFinish = async (values: any) => {
    if (!operatorId) {
      toast.error('Operator ID is missing from the URL.');
      return;
    }

    if (!fetchedCoordinates) {
      toast.error('Please enter a valid address and wait for coordinates to be fetched.');
      return;
    }

    const plateNumberRegex = /^[A-Za-z0-9]{3}-[A-Za-z0-9]+$/;
    if (!plateNumberRegex.test(values.numberPlate)) {
      toast.error('Plate number should be in ABC-123');
      return;
    }

    setLoading(true);
    
    const payload = {
      brand_name: values.brandName,
      plate_number: values.numberPlate,
      home_area_address: selectedAddress,
      operator_id: operatorId,
      vehicle_model: values.vehicleModel,
      home_area_coordinate: fetchedCoordinates,
      availability: availability,
      category: values.Category,
    };

    try {
      const response = await addAssets(payload);
      if (response?.status !== 'ok') {
        toast.error(response?.response?.data?.msg || 'Failed to add asset.');
      } else {
        toast.success('Asset added successfully!');
        handleClose();
    if (onAssetAdded) onAssetAdded();
      }
    } catch (error: any) {
      toast.error(error.message || 'An error occurred while adding asset.');
    } finally {
      setLoading(false);
    }
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-[999] flex justify-end bg-[#38383880] p-5 bg-opacity-50" onClick={handleClose}>
      <div className="md:w-[48%] lg:w-1/3 w-100 z-[9999] h-full bg-white rounded-xl slide-in overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center py-3 px-6">
          <h2 className="text-md font-semibold mb-0 text-[#1C2023]">Add new assets</h2>
          <button
            onClick={handleClose}
            className="text-[#7D8489] bg-[#EEF0F2] cursor-pointer py-2 px-3 rounded-3xl hover:text-black"
          >
            ✕
          </button>
        </div>
        <div className='overflow-y-auto flex flex-col border-t border-[#D6DADD] justify-between mb-5 h-[87%] slide-in scrollbar-hide hover:scrollbar-show'>
          <div className="px-10 pt-3 mt-8">
            <div className="text-[#475467] font-medium mb-4">Road Rescue</div>
            <div className="border border-[#E5E9F0] rounded-xl p-6 mb-6">
                <div className="bg-[#FCFCFD] border border-[#F2F4F7] rounded-xl p-6 mb-6">
                <div className="flex items-center gap-4 mb-2">
                    <span className="flex items-center justify-center w-10 h-10 rounded-full bg-[#FFF3ED]">
                    <MdOutlineCloudUpload className="text-[#FF6C2D] tex t-2xl" />
                    </span>
                    <div>
                    <div className="text-[#475467] font-medium text-base">Upload Assets</div>
                    <div className="text-[#667085] text-sm">Upload an csv file to add assets</div>
                    </div>
                </div>              
              </div>
            <div className="text-[#475467] text-sm mt-2">
                Get a template to upload assets. <a href="#" className="text-[#FF6C2D] underline font-medium">Download now</a>
                </div>
            </div>
            <Form
              form={form}
              layout="vertical"
              onFinish={handleFinish}
            >
              <Form.Item
                label="Brand name"
                name="brandName"
                rules={[{ required: true, message: 'Please select brand name' }]}
              >
                <Select placeholder="Select" className='!h-[42px]'>
                  <Option value="Toyota">Toyota</Option>
                  <Option value="Honda">Honda</Option>
                  <Option value="Ford">Ford</Option>
                </Select>
              </Form.Item>
              <Form.Item
                label="Vehicle Model"
                name="vehicleModel"  
                rules={[{ required: true, message: 'Please enter vehicle model' }]}           
              >
                <Input placeholder="Enter details" />
              </Form.Item>
              <Form.Item
                label="Category"
                name="Category"
                rules={[{ required: true, message: 'Please select a Category' }]}
              >
                <Select placeholder="Select" className='!h-[42px]'>
                  <Option value="Category A">Category A</Option>
                  <Option value="Category B">Category B</Option>
                  <Option value="Category C">Category C</Option>
                </Select>
              </Form.Item>
              <Form.Item
                label="Number plate"
                name="numberPlate"
                rules={[
                  { required: true, message: 'Please enter number plate' },
                  { 
                    pattern: /^[A-Za-z0-9]{3}-[A-Za-z0-9]+$/,
                    message: 'Plate number should be in ABC-123 or 0PA-12121A format.'
                  }
                ]}
              >
                <Input placeholder="Enter details" />
              </Form.Item>
              <div className="mb-4">
                <div className="text-[#344054] text-sm font-medium mb-2">Asset availability</div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className={`flex-1 py-2 rounded-lg border text-base font-medium transition ${availability === 'Available' ? 'bg-[#FFF3ED] border-[#FF6C2D] text-[#FF6C2D]' : 'bg-white border-[#D0D5DD] text-[#667085]'}`}
                    onClick={() => setAvailability('Available')}
                  >
                    Available
                  </button>
                  <button
                    type="button"
                    className={`flex-1 py-2 rounded-lg border text-base font-medium transition ${availability === 'Unavailable' ? 'bg-[#FFF3ED] border-[#FF6C2D] text-[#FF6C2D]' : 'bg-white border-[#D0D5DD] text-[#667085]'}`}
                    onClick={() => setAvailability('Unavailable')}
                  >
                    Unavailable
                  </button>
                </div>
              </div>
              <Form.Item
                label="Vehicle location"
                name="vehicleLocation"
                rules={[{ required: true, message: 'Please enter vehicle location' }]}
              >
                <AutoComplete
                  options={addressSuggestions.map(address => ({ value: address }))}
                  onSelect={handleAddressSelect}
                  onSearch={handleAddressSearch}
                  className='!h-[42px]'
                  placeholder="Start typing an address..."
                  notFoundContent={fetchingAddress ? 'Searching...' : null}
                />
              </Form.Item>
              {fetchedCoordinates && (
                <div className="bg-[#E9F7EF] rounded-md px-4 py-3 mb-4 text-[#054F31] font-medium text-sm">
                  Selected Address: {selectedAddress}<br />
                  Coordinates: Longitude {fetchedCoordinates.longitude.toFixed(4)}, Latitude {fetchedCoordinates.latitude.toFixed(4)}
                </div>
              )}
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  disabled={loading || !fetchedCoordinates}
                  className="h-[46px]! px-10! mt-5! rounded-lg bg-[#FF6C2D] text-white font-medium text-lg hover:bg-[#E55B1F] transition border-0"
                >
                  Save
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddAsset;