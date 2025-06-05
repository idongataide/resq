import React, { useState, useEffect } from 'react';
import { Button, Form, Input, Select } from 'antd';
import { updateAsset } from '@/api/operatorsApi';
import toast from 'react-hot-toast';
import ConfirmOperator from '@/pages/dashboard/screens/operations/2FA';

interface EditAssetProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  onAssetUpdated?: () => void;
  assetData: {
    asset_id: string;
    operator_id: string;
    brand_name: string;
    vehicle_model: string;
    plate_number: string;
    availability: 'Available' | 'Unavailable';
    status: 'Enroute' | 'At rest';
  };
}

const EditAsset: React.FC<EditAssetProps> = ({ showModal, setShowModal, onAssetUpdated, assetData }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [availability, setAvailability] = useState<'Available' | 'Unavailable'>(assetData.availability);
  const [status, setStatus] = useState<'Enroute' | 'At rest'>(assetData.status);
  const [show2FA, setShow2FA] = useState(false);
  const [formValues, setFormValues] = useState<any>(null);

  useEffect(() => {
    if (showModal && assetData) {
      form.setFieldsValue({
        brandName: assetData.brand_name,
        vehicleModel: assetData.vehicle_model,
        numberPlate: assetData.plate_number,
        availability: assetData.availability,
        operator_id: assetData.operator_id,
        status: assetData.status
      });
    }
  }, [showModal, assetData, form]);

  const handleClose = () => {
    setShowModal(false);
    form.resetFields();
    setLoading(false);
    setShow2FA(false);
    setFormValues(null);
  };

  const handleFinish = async (values: any) => {
    const plateNumberRegex = /^[A-Za-z0-9]{3}-[A-Za-z0-9]+$/;
    if (!plateNumberRegex.test(values.numberPlate)) {
      toast.error('Plate number should be in ABC-123');
      return;
    }

    setFormValues(values);
    setShow2FA(true);
  };

  const handle2FASuccess = async (otp: string) => {
    if (!formValues) return;

    setLoading(true);
    
    const payload = {
      brand_name: formValues.brandName,
      plate_number: formValues.numberPlate,
      vehicle_model: formValues.vehicleModel,
      availability: availability,
      operator_id: assetData.operator_id,
      status: status,
      otp: otp
    };

    try {
      const response = await updateAsset(assetData.asset_id, payload);
      if (response?.status !== 'ok') {
        toast.error(response?.response?.data?.msg || 'Failed to update asset.');
      } else {
        toast.success('Asset updated successfully!');
        handleClose();
        if (onAssetUpdated) onAssetUpdated();
      }
    } catch (error: any) {
      toast.error(error.message || 'An error occurred while updating asset.');
    } finally {
      setLoading(false);
      setShow2FA(false);
      setFormValues(null);
    }
  };

  if (!showModal) return null;

  return (
    <>
      <div className="fixed inset-0 z-[999] flex justify-end bg-[#38383880] p-5 bg-opacity-50" onClick={handleClose}>
        <div className="md:w-[48%] lg:w-1/3 w-100 z-[9999] h-full bg-white rounded-xl slide-in overflow-hidden" onClick={e => e.stopPropagation()}>
          <div className="flex justify-between items-center py-3 px-6">
            <h2 className="text-md font-semibold mb-0 text-[#1C2023] capitalize">Edit asset</h2>
            <button
              onClick={handleClose}
              className="text-[#7D8489] bg-[#EEF0F2] cursor-pointer py-2 px-3 rounded-3xl hover:text-black"
            >
              ✕
            </button>
          </div>
          <div className='overflow-y-auto flex flex-col border-t border-[#D6DADD] justify-between mb-5 h-[87%] slide-in scrollbar-hide hover:scrollbar-show'>
            <div className="px-10 pt-3 mt-8">
              <Form
                form={form}
                layout="vertical"
                onFinish={handleFinish}
                className="space-y-4"
              >
                <Form.Item
                  label="Brand Name"
                  name="brandName"
                  rules={[{ required: true, message: 'Please enter brand name!' }]}
                >
                  <Input className="h-[42px]" placeholder="Enter brand name" />
                </Form.Item>

                <Form.Item
                  label="Vehicle Model"
                  name="vehicleModel"
                  rules={[{ required: true, message: 'Please enter vehicle model!' }]}
                >
                  <Input className="h-[42px]" placeholder="Enter vehicle model" />
                </Form.Item>

                <Form.Item
                  label="Number Plate"
                  name="numberPlate"
                  rules={[{ required: true, message: 'Please enter number plate!' }]}
                >
                  <Input className="h-[42px]" placeholder="Enter number plate (e.g., ABC-123)" />
                </Form.Item>

                <Form.Item
                  label="Availability"
                  name="availability"
                  rules={[{ required: true, message: 'Please select availability!' }]}
                >
                  <Select
                    className="h-[42px]!"
                    value={availability}
                    onChange={(value) => setAvailability(value)}
                  >
                    <Select.Option value="Available">Available</Select.Option>
                    <Select.Option value="Unavailable">Unavailable</Select.Option>
                  </Select>
                </Form.Item>

                <Form.Item
                  label="Status"
                  name="status"
                  rules={[{ required: true, message: 'Please select status!' }]}
                >
                  <Select
                    className="h-[42px]!"
                    value={status}
                    onChange={(value) => setStatus(value)}
                  >
                    <Select.Option value="Enroute">Enroute</Select.Option>
                    <Select.Option value="At rest">At rest</Select.Option>
                  </Select>
                </Form.Item>

                <div className="flex justify-end gap-4 mt-6">
                  <Button
                    onClick={handleClose}
                    className="px-4 py-2 rounded-lg h-[42px]! cursor-pointer border border-[#D0D5DD] text-[#344054] font-medium hover:bg-gray-100"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    className="px-4 py-2 rounded-lg h-[42px]! cursor-pointer bg-[#FF6C2D] text-white font-medium hover:bg-[#E55B1F]"
                  >
                    Update
                  </Button>
                </div>
              </Form>
            </div>
          </div>
        </div>
      </div>

      {show2FA && (
        <ConfirmOperator
          onClose={() => setShow2FA(false)}
          onSuccess={handle2FASuccess}
        />
      )}
    </>
  );
};

export default EditAsset; 