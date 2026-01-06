import React, { useState, useEffect, useRef } from 'react';
import { Form, Input, Button, InputNumber, AutoComplete, Spin } from 'antd';
import toast from 'react-hot-toast';
import { useSWRConfig } from 'swr';
import { updateCommandCenter } from '@/api/settingsApi';

interface EditCommandCenterFormProps {
  isOpen: boolean;
  onClose: () => void;
  onCommandCenterUpdated?: () => void;
  commandCenterData: {
    _id: string;
    name: string;
    address: string;
    location: {
      type: string;
      coordinates: [number, number]; // [longitude, latitude]
    };
    command_id: string;
  };
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

interface LocationData {
  address: string;
  fullAddress: string;
  coordinates?: Coordinates;
}

interface AutocompleteOption {
  value: string;
  label: React.ReactNode;
}

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GMAPS_API_KEY || '';

const EditCommandCenterForm: React.FC<EditCommandCenterFormProps> = ({
  isOpen,
  onClose,
  onCommandCenterUpdated,
  commandCenterData,
}) => {
  const [form] = Form.useForm<FormValues>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addressSearch, setAddressSearch] = useState('');
  const [autocompleteOptions, setAutocompleteOptions] = useState<AutocompleteOption[]>([]);
  const [loadingAddress, setLoadingAddress] = useState(false);
  const { mutate: globalMutate } = useSWRConfig();
  const autocompleteTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize form with existing data
  useEffect(() => {
    if (isOpen && commandCenterData) {
      const coordinates = commandCenterData.location?.coordinates || [];
      const longitude = coordinates.length > 0 ? coordinates[0].toString() : '';
      const latitude = coordinates.length > 1 ? coordinates[1].toString() : '';
      
      form.setFieldsValue({
        command_name: commandCenterData.name || '',
        address: commandCenterData.address || '',
        longitude: longitude,
        latitude: latitude,
      });
      setAddressSearch(commandCenterData.address || '');
    }
  }, [isOpen, commandCenterData, form]);

  // Reset form when component closes
  useEffect(() => {
    if (!isOpen) {
      form.resetFields();
      setAddressSearch('');
      setAutocompleteOptions([]);
    }
  }, [isOpen, form]);

  const fetchAutocompleteSuggestions = async (input: string) => {
    if (!input || input.length < 3) {
      setAutocompleteOptions([]);
      return;
    }

    setLoadingAddress(true);

    try {
      const response = await fetch(
        `/maps/api/place/autocomplete/json?input=${encodeURIComponent(
          input
        )}&key=${GOOGLE_MAPS_API_KEY}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.status === 'OK' && data.predictions) {
        const options = data.predictions.map(
          (prediction: any) => ({
            value: prediction.description,
            label: (
              <div className="py-1">
                <div className="font-medium">{prediction.structured_formatting?.main_text || prediction.description}</div>
                <div className="text-xs text-gray-500">
                  {prediction.structured_formatting?.secondary_text || ''}
                </div>
              </div>
            ),
          })
        );
        setAutocompleteOptions(options);
      } else {
        setAutocompleteOptions([]);
        if (data.status === 'ZERO_RESULTS') {
          setAutocompleteOptions([{
            value: 'No results found',
            label: <div className="text-gray-500 italic">No results found</div>,
          }]);
        }
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setAutocompleteOptions([]);
    } finally {
      setLoadingAddress(false);
    }
  };

  const fetchCoordinates = async (address: string): Promise<LocationData | null> => {
    if (!address.trim()) return null;

    setLoadingAddress(true);

    try {
      const response = await fetch(
        `/maps/api/geocode/json?address=${encodeURIComponent(
          address
        )}&key=${GOOGLE_MAPS_API_KEY}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.status === 'OK' && data.results?.length > 0) {
        const result = data.results[0];
        const location = result.geometry.location;

        return {
          address,
          fullAddress: result.formatted_address || address,
          coordinates: {
            latitude: location.lat,
            longitude: location.lng,
          },
        };
      }

      return {
        address,
        fullAddress: address,
        coordinates: undefined,
      };
    } catch (error) {
      console.error('Error fetching coordinates:', error);
      return {
        address,
        fullAddress: address,
        coordinates: undefined,
      };
    } finally {
      setLoadingAddress(false);
    }
  };

  // Handle address search with debouncing
  const handleAddressSearch = (value: string) => {
    setAddressSearch(value);
    form.setFieldValue('address', value);
    
    if (autocompleteTimeoutRef.current) {
      clearTimeout(autocompleteTimeoutRef.current);
    }
    
    autocompleteTimeoutRef.current = setTimeout(() => {
      fetchAutocompleteSuggestions(value);
    }, 500);
  };

  // Handle address selection from autocomplete
  const handleAddressSelect = async (value: string) => {
    setAddressSearch(value);
    form.setFieldValue('address', value);
    setAutocompleteOptions([]);

    toast.loading('Getting coordinates for selected address...', { id: 'geocoding' });
    
    const locationData = await fetchCoordinates(value);
    
    if (locationData?.coordinates) {
      form.setFieldsValue({
        latitude: locationData.coordinates.latitude.toString(),
        longitude: locationData.coordinates.longitude.toString(),
      });
      toast.success('Address geocoded successfully!', { id: 'geocoding' });
    } else {
      toast('Address saved without coordinates. You can enter them manually.', { id: 'geocoding' });
    }
  };

  const handleFinish = async (values: FormValues) => {
    // Validate coordinates
    const lat = parseFloat(values.latitude);
    const lng = parseFloat(values.longitude);
    
    if (isNaN(lat) || isNaN(lng)) {
      toast.error('Please enter valid latitude and longitude values');
      return;
    }
    
    if (lat < -90 || lat > 90) {
      toast.error('Latitude must be between -90 and 90');
      return;
    }
    
    if (lng < -180 || lng > 180) {
      toast.error('Longitude must be between -180 and 180');
      return;
    }

    // Check if any changes were made
    const currentValues = form.getFieldsValue();
    const originalValues = {
      command_name: commandCenterData.name,
      address: commandCenterData.address,
      longitude: commandCenterData.location?.coordinates?.[0]?.toString() || '',
      latitude: commandCenterData.location?.coordinates?.[1]?.toString() || '',
    };

    const hasChanges = 
      currentValues.command_name !== originalValues.command_name ||
      currentValues.address !== originalValues.address ||
      currentValues.longitude !== originalValues.longitude ||
      currentValues.latitude !== originalValues.latitude;

    if (!hasChanges) {
      toast('No changes detected.');
      onClose();
      return;
    }

    // Submit the form directly without 2FA
    try {
      setIsSubmitting(true);
      const response = await updateCommandCenter(commandCenterData.command_id, {
        command_name: values.command_name,
        address: values.address,
        longitude: values.longitude,
        latitude: values.latitude,
        // Removed otp field
      });

      if (response?.status === 'ok') {
        toast.success('Command center updated successfully');
        globalMutate('/settings/command-centers');
        globalMutate('/settings/command-centers?component=count');
        onCommandCenterUpdated?.();
        onClose();
        form.resetFields();
        setAddressSearch('');
        setAutocompleteOptions([]);
      } else {
        const errorMsg = response?.response?.data?.msg || response?.message;
        toast.error(errorMsg || 'Failed to update command center');
      }
    } catch (error: any) {
      console.error('Form submission error:', error);
      toast.error(error.message || 'An error occurred while updating command center');
    } finally {
      setIsSubmitting(false);
    }
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
    <div 
      className="fixed inset-0 z-[999] flex justify-end bg-[#38383880] p-5 bg-opacity-50" 
      onClick={onClose}
    >
      <div 
        className="md:w-[48%] lg:w-1/3 w-100 z-[9999] h-full bg-white rounded-xl slide-in overflow-hidden" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-full bg-white rounded-xl overflow-hidden">
          <div className="flex justify-between items-center py-3 px-6 border-b border-[#D6DADD]">
            <h2 className="text-md font-semibold text-[#1C2023]">Edit Zonal Office</h2>
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
                  <h3 className="text-md font-medium text-[#475467] mb-3">Edit command center details</h3>
                  <div className='border border-[#F2F4F7] p-3 rounded-lg'>
                    <Form.Item
                      name="command_name"
                      label="Zonal Office Name"
                      rules={[
                        { required: true, message: 'Please enter command name!' },
                        { min: 2, message: 'Name must be at least 2 characters' },
                        { max: 100, message: 'Name cannot exceed 100 characters' }
                      ]}
                    >
                      <Input 
                        placeholder="Enter command center name" 
                        className="!h-[42px]"
                        maxLength={100}
                      />
                    </Form.Item>

                    <Form.Item
                      name="address"
                      label="Address"
                      rules={[
                        { required: true, message: 'Please enter address!' },
                        { min: 3, message: 'Address must be at least 3 characters' }
                      ]}
                    >
                      <AutoComplete
                        options={autocompleteOptions}
                        onSelect={handleAddressSelect}
                        onSearch={handleAddressSearch}
                        value={addressSearch}
                        onChange={(value) => {
                          setAddressSearch(value);
                          form.setFieldValue('address', value);
                        }}
                        className="w-full"
                        placeholder="Enter address (start typing for suggestions)"
                        size="large"
                        notFoundContent={loadingAddress ? 
                          <div className="flex items-center justify-center p-2">
                            <Spin size="small" /> 
                            <span className="ml-2">Searching...</span>
                          </div> : 
                          <div className="p-2 text-gray-500">No results found</div>
                        }
                        filterOption={false}
                        dropdownStyle={{
                          maxHeight: 300,
                          overflow: 'auto',
                          borderRadius: '8px',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        }}
                        dropdownRender={(menu) => (
                          <div>
                            {loadingAddress && (
                              <div className="flex items-center justify-center p-3">
                                <Spin size="small" />
                                <span className="ml-2">Loading suggestions...</span>
                              </div>
                            )}
                            {!loadingAddress && menu}
                          </div>
                        )}
                      >
                        <Input 
                          placeholder="Enter address (start typing for suggestions)"
                          className="!h-[42px]"
                          allowClear
                        />
                      </AutoComplete>
                    </Form.Item>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <Form.Item
                        name="latitude"
                        label="Latitude"
                        rules={[
                          { required: true, message: 'Latitude is required' },
                          {
                            validator: (_, value) => {
                              const num = parseFloat(value);
                              if (isNaN(num)) {
                                return Promise.reject(new Error('Please enter a valid number'));
                              }
                              if (num < -90 || num > 90) {
                                return Promise.reject(new Error('Must be between -90 and 90'));
                              }
                              return Promise.resolve();
                            }
                          }
                        ]}
                      >
                        <InputNumber
                          placeholder="e.g., 40.7128"
                          className="!h-[42px] w-full!"
                          step="0.000001"
                          precision={6}
                          min={-90}
                          max={90}
                          stringMode
                        />
                      </Form.Item>

                      <Form.Item
                        name="longitude"
                        label="Longitude"
                        rules={[
                          { required: true, message: 'Longitude is required' },
                          {
                            validator: (_, value) => {
                              const num = parseFloat(value);
                              if (isNaN(num)) {
                                return Promise.reject(new Error('Please enter a valid number'));
                              }
                              if (num < -180 || num > 180) {
                                return Promise.reject(new Error('Must be between -180 and 180'));
                              }
                              return Promise.resolve();
                            }
                          }
                        ]}
                      >
                        <InputNumber
                          placeholder="e.g., -74.0060"
                          className="!h-[42px] w-full!"
                          step="0.000001"
                          precision={6}
                          min={-180}
                          max={180}
                          stringMode
                        />
                      </Form.Item>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 py-4 flex justify-end gap-3">
                <Button
                  onClick={onClose}
                  className="rounded-md h-[46px]! px-10! border border-[#D0D5DD] bg-white text-[#344054] py-2 text-sm font-medium shadow-sm hover:bg-gray-50"
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={isSubmitting}
                  className="rounded-md h-[46px]! px-10! border border-transparent bg-[#FF6C2D] py-2 text-sm font-medium text-white shadow-sm hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                >
                  Update
                </Button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditCommandCenterForm;