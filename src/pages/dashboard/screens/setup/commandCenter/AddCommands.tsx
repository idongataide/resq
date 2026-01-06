import React, { useState, useEffect, useRef } from 'react';
import { Form, Input, Button, InputNumber, AutoComplete } from 'antd';
import ConfirmOperator from '@/pages/dashboard/screens/setup/2FA';
import toast from 'react-hot-toast';
import { useSWRConfig } from 'swr';
import { addCommandCenter } from '@/api/settingsApi';

interface AddCommandCenterFormProps {
  isOpen: boolean;
  onClose: () => void;
  onCommandCenterAdded?: () => void;
}

interface FormValues {
  command_name: string;
  address: string;
  longitude: string;
  latitude: string;
}

interface Coordinates {
  longitude: number;
  latitude: number;
}

interface AutocompleteOption {
  value: string;
  label: React.ReactNode;
  coordinates?: Coordinates;
}

const AddCommandCenterForm: React.FC<AddCommandCenterFormProps> = ({
  isOpen,
  onClose,
  onCommandCenterAdded,
}) => {
  const [form] = Form.useForm<FormValues>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [show2FA, setShow2FA] = useState(false);
  const [formValues, setFormValues] = useState<FormValues | null>(null);
  const [isLoadingAutocomplete, setIsLoadingAutocomplete] = useState(false);
  const [autocompleteOptions, setAutocompleteOptions] = useState<AutocompleteOption[]>([]);
  const [addressInputValue, setAddressInputValue] = useState('');
  const { mutate: globalMutate } = useSWRConfig();
  const autocompleteTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Reset form when component opens/closes
  useEffect(() => {
    if (!isOpen) {
      form.resetFields();
      setAddressInputValue('');
      setAutocompleteOptions([]);
    }
  }, [isOpen, form]);

  // Debounced function to fetch autocomplete suggestions
  const fetchAutocompleteSuggestions = async (query: string) => {
    if (!query || query.length < 3) {
      setAutocompleteOptions([]);
      return;
    }

    try {
      setIsLoadingAutocomplete(true);
      const response = await fetch(
        `/maps/api/place/autocomplete/json?input=${encodeURIComponent(query)}&key=AIzaSyC6OO39gLvWbZpMzBiLSs1pGNehjJbr2Vg`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
        console.warn('Autocomplete API warning:', data.status);
      }
      
      if (data.predictions && data.predictions.length > 0) {
        const options = data.predictions.map((prediction: any) => ({
          value: prediction.description,
          label: (
            <div className="flex flex-col">
              <span className="font-medium">{prediction.structured_formatting?.main_text || prediction.description}</span>
              {prediction.structured_formatting?.secondary_text && (
                <span className="text-xs text-gray-500">{prediction.structured_formatting.secondary_text}</span>
              )}
            </div>
          ),
        }));
        setAutocompleteOptions(options);
      } else {
        setAutocompleteOptions([]);
      }
    } catch (error) {
      console.error('Autocomplete error:', error);
      setAutocompleteOptions([]);
    } finally {
      setIsLoadingAutocomplete(false);
    }
  };

  // Function to geocode a selected address
  const geocodeSelectedAddress = async (address: string): Promise<Coordinates | null> => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=AIzaSyC6OO39gLvWbZpMzBiLSs1pGNehjJbr2Vg`
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
      
      const result = data.results[0];
      const location = result.geometry.location;
      
      return { 
        longitude: location.lng, 
        latitude: location.lat 
      };
    } catch (error) {
      console.error('Geocoding error:', error);
      toast.error('Failed to get coordinates for selected address. Please enter them manually.');
      return null;
    }
  };

  // Handle address input change with debouncing
  const handleAddressSearch = (value: string) => {
    setAddressInputValue(value);
    
    // Clear previous timeout
    if (autocompleteTimeoutRef.current) {
      clearTimeout(autocompleteTimeoutRef.current);
    }
    
    // Set new timeout for debouncing
    autocompleteTimeoutRef.current = setTimeout(() => {
      fetchAutocompleteSuggestions(value);
    }, 500); // 500ms debounce delay
  };

  // Handle address selection from autocomplete
  const handleAddressSelect = async (value: string) => {
    setAddressInputValue(value);
    form.setFieldValue('address', value);
    setAutocompleteOptions([]);
    
    try {
      toast.loading('Getting coordinates for selected address...', { id: 'geocoding' });
      const coordinates = await geocodeSelectedAddress(value);
      
      if (coordinates) {
        form.setFieldsValue({
          longitude: coordinates.longitude.toString(),
          latitude: coordinates.latitude.toString()
        });
        toast.success('Address geocoded successfully!', { id: 'geocoding' });
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to geocode address', { id: 'geocoding' });
    }
  };

  const handleFinish = async (values: FormValues) => {
    if (!values.longitude || !values.latitude) {
      toast.error('Please select an address from suggestions or enter coordinates manually');
      return;
    }

    setFormValues(values);
    setShow2FA(true);
  };

  const handle2FASuccess = async (otp: string) => {
    if (!formValues) return;

    try {
      setIsSubmitting(true);
      const response = await addCommandCenter({
        command_name: formValues.command_name,
        address: formValues.address,
        longitude: formValues.longitude,
        latitude: formValues.latitude,
        otp: otp,
      });

      if (response?.status === 'ok') {
        toast.success('Command center added successfully');
        globalMutate('/settings/command-centers');
        globalMutate('/settings/command-centers?component=count');
        onCommandCenterAdded?.();
        onClose();
        form.resetFields();
        setAddressInputValue('');
        setAutocompleteOptions([]);
      } else {
        const errorMsg = response?.response?.data?.msg;
        toast.error(errorMsg || 'Failed to add command center');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error('An error occurred while adding command center');
    } finally {
      setIsSubmitting(false);
      setShow2FA(false);
    }
  };

  const handleManualCoordinatesChange = () => {
    // Clear any autocomplete suggestions when manually editing
    setAutocompleteOptions([]);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (autocompleteTimeoutRef.current) {
        clearTimeout(autocompleteTimeoutRef.current);
      }
    };
  }, []);

  if (!isOpen) {
    return null;
  }

  return (
    <>
      <div className="fixed inset-0 z-[999] flex justify-end bg-[#38383880] p-5 bg-opacity-50" onClick={onClose}>
        <div className="md:w-[48%] lg:w-1/3 w-100 z-[9999] h-full bg-white rounded-xl slide-in overflow-hidden" onClick={(e) => e.stopPropagation()}>
          <div className="h-full bg-white rounded-xl overflow-hidden">
            <div className="flex justify-between items-center py-3 px-6 border-b border-[#D6DADD]">
              <h2 className="text-md font-semibold text-[#1C2023]">Add Command Center</h2>
              <button
                onClick={onClose}
                className="text-[#7D8489] bg-[#EEF0F2] cursor-pointer py-2 px-3 rounded-3xl hover:text-black"
              >
                ✕
              </button>
            </div>
            <div className='overflow-y-auto flex flex-col h-[calc(100vh-160px)] slide-in scrollbar-hide hover:scrollbar-show px-7 py-4'>
              <Form
                form={form}
                layout="vertical"
                onFinish={handleFinish}
                className="flex flex-col justify-between flex-grow"
              >
                <div>
                  <div className="form-section mb-4">
                    <h3 className="text-md font-medium text-[#475467] mb-3">Enter required details</h3>
                    <div className='border border-[#F2F4F7] p-3 rounded-lg'>

                      
                      <Form.Item
                        name="command_name"
                        label="Command Name"
                        rules={[{ required: true, message: 'Please enter command name!' }]}
                      >
                        <Input placeholder="Enter command center name" className="!h-[42px]" />
                      </Form.Item>

                      <Form.Item
                        name="address"
                        label="Address"
                        rules={[{ required: true, message: 'Please enter address!' }]}
                      >
                        <AutoComplete
                          options={autocompleteOptions}
                          onSearch={handleAddressSearch}
                          onSelect={handleAddressSelect}
                          value={addressInputValue}
                          notFoundContent={isLoadingAutocomplete ? "Loading..." : "No suggestions"}
                          className="w-full"
                        >
                          <Input 
                            placeholder="Start typing address..." 
                            className="!h-[42px]"
                            onChange={(e) => {
                              setAddressInputValue(e.target.value);
                              form.setFieldValue('address', e.target.value);
                            }}
                            allowClear
                          />
                        </AutoComplete>
                        <div className="text-xs text-gray-500 mt-3">
                          Start typing to see address suggestions
                        </div>
                      </Form.Item>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <Form.Item
                          name="latitude"
                          label="Latitude"
                          rules={[{ required: true, message: 'Latitude is required' }]}
                        >
                          <InputNumber
                            placeholder="e.g., 40.7128"
                            className="!h-[42px] w-full!"
                            onChange={handleManualCoordinatesChange}
                          />
                        </Form.Item>

                        <Form.Item
                          name="longitude"
                          label="Longitude"
                          rules={[{ required: true, message: 'Longitude is required' }]}
                        >
                          <InputNumber
                            placeholder="e.g., -74.0060"
                            className="!h-[42px] w-full!"
                            onChange={handleManualCoordinatesChange}
                          />
                        </Form.Item>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 py-4 flex justify-end gap-3">
                  <Button
                    onClick={onClose}
                    className="rounded-md h-[46px] px-10 border border-[#D0D5DD] bg-white text-[#344054] py-2 text-sm font-medium shadow-sm hover:bg-gray-50"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={isSubmitting}
                    className="rounded-md h-[46px] px-10 border border-transparent bg-[#FF6C2D] py-2 text-sm font-medium text-white shadow-sm hover:bg-orange-700 focus:outline-none focus:ring-2 focus::ring-orange-500 focus:ring-offset-2"
                  >
                    Save
                  </Button>
                </div>
              </Form>
            </div>
          </div>
        </div>
      </div>

      {show2FA && formValues && (
        <ConfirmOperator
          onClose={() => setShow2FA(false)}
          onSuccess={handle2FASuccess}
        />
      )}
    </>
  );
};

export default AddCommandCenterForm;