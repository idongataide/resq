import React, { useState } from 'react';
import { Button, Form, Input, DatePicker } from 'antd';
import { addDrivers } from '@/api/operatorsApi';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import moment from 'moment';

interface AddDriverProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  onDriverAdded?: () => void;
}

const AddDriver: React.FC<AddDriverProps> = ({ showModal, setShowModal, onDriverAdded }) => {
  const [form] = Form.useForm();
  const { id: operatorId } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    setShowModal(false);
    form.resetFields();
    setLoading(false);
  };

  const handleFinish = async (values: any) => {
    if (!operatorId) {
      toast.error('Operator ID is missing from the URL.');
      return;
    }

    setLoading(true);

    const payload = {
      first_name: values.firstName,
      last_name: values.lastName,
      phone_number: values.phone,
      expiry_date: values.expirationDate ? moment(values.expirationDate).format('YYYY-MM-DD') : undefined,
      operator_id: operatorId,
      driver_license: values.licenseNumber,
    };


    try {
      const response = await addDrivers(payload);
      console.log('Add Driver API Response:', response);

      if (response?.status !== 'ok') {
        toast.error(response?.response?.data?.msg || 'Failed to add driver.');
      } else {
        toast.success('Driver added successfully!');
        handleClose();
        if (onDriverAdded) onDriverAdded();
      }
    } catch (error: any) {
      toast.error(error.message || 'An error occurred while adding driver.');
    } finally {
      setLoading(false);
    }
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-[999] flex justify-end bg-[#38383880] p-5 bg-opacity-50" onClick={handleClose}>
      <div className="md:w-[48%] lg:w-1/3 w-100 z-[9999] h-full bg-white rounded-xl slide-in overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center py-3 px-6">
          <h2 className="text-md font-semibold mb-0 text-[#1C2023]">Add Driver</h2>
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
            <Form
              form={form}
              layout="vertical"
              onFinish={handleFinish}
            >
              <Form.Item
                label="First name"
                name="firstName"
                rules={[{ required: true, message: 'Please enter first name' }]}
              >
                <Input placeholder="Enter details" />
              </Form.Item>
              <Form.Item
                label="Last name"
                name="lastName"
                rules={[{ required: true, message: 'Please enter last name' }]}
              >
                <Input placeholder="Enter details" />
              </Form.Item>
              <Form.Item
                label="Phone number"
                name="phone"
                rules={[{ required: true, message: 'Please enter phone number' }]}
              >
                <Input addonBefore={<span className="flex items-center"><img src="https://flagcdn.com/ng.svg" alt="NG" style={{ width: 20, marginRight: 4 }} />NG </span>} placeholder="Enter details" />
              </Form.Item>
              <Form.Item
                label="Driver license number"
                name="licenseNumber"
                rules={[{ required: true, message: 'Please enter license number' }]}
              >
                <Input placeholder="Enter details" />
              </Form.Item>
              <Form.Item
                label="Expiration date"
                name="expirationDate"
                rules={[{ required: true, message: 'Please select expiration date' }]}
              >
                <DatePicker className='!h-[42px]'  style={{ width: '100%' }} placeholder="Select" />
              </Form.Item>
              <Form.Item>
                <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    disabled={loading}
                    className="h-[46px]! px-10! mt-5!  rounded-lg bg-[#FF6C2D] text-white font-medium text-lg hover:bg-[#E55B1F] transition border-0"
                >
                    Proceed
                </Button>
            </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddDriver;