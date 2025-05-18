import React from 'react';
import { Form, Input, Button, Select } from 'antd';
import { useOnboardingStore } from '@/global/store';

const { Option } = Select;

const CompanyDetails: React.FC<{ onProceed?: () => void }> = () => {
  const [form] = Form.useForm();
  const { setNavPath, setFormData, formData } = useOnboardingStore();

  const handleFinish = (values: any) => {
    setFormData({ ...formData, companyDetails: values });
    setNavPath("account-details");

   
  };

  return (
    <div className="w-full mx-auto">
      <div className="bg-[#F2F4F7] rounded-md px-4 py-2 mb-6 text-[#475467] font-medium">Company details</div>
        <Form
            form={form}
            layout="vertical"
            onFinish={handleFinish}
            requiredMark={false}
        >
            <Form.Item label="Company Name" name="companyName" rules={[{ required: true, message: 'Please enter company name' }]}> 
                <Input className="h-[42px]" placeholder="Enter company name" size="large" />
            </Form.Item>
            <Form.Item label="Email Address" name="email" rules={[{ required: true, type: 'email', message: 'Please enter a valid email address' }]}> 
                <Input className="h-[42px]" placeholder="johndoe@xyz.com" size="large" />
            </Form.Item>
            <Form.Item label="Phone number" name="phone" rules={[{ required: true, message: 'Please enter phone number' }]}> 
                <Input  maxLength={11} addonBefore={<span className="flex items-center">
                    <img src="https://hatscripts.github.io/circle-flags/flags/ng.svg" alt="NG" className="w-5 h-5 mr-1" />NG </span>} className="h-[42px]"   placeholder="+234" size="large" />
            </Form.Item>
            <Form.Item label="State located" name="state" rules={[{ required: true, message: 'Please select a state' }]}> 
                <Select className='mb-10 !h-[42px]'   placeholder="Select" size="large">
                    <Option value="lagos">Lagos</Option>
                </Select>
            </Form.Item>
            <Form.Item label="LGA" name="lga" rules={[{ required: true, message: 'Please select an LGA' }]}> 
                <Select  placeholder="Select" className='mb-10 !h-[42px]' size="large">
                    <Option value="ikeja">Ikeja</Option>
                    <Option value="lekki">Lekki</Option>
                    {/* Add more LGAs as needed */}
                </Select>
            </Form.Item>
            <Form.Item>
                <Button
                    type="primary"
                    htmlType="submit"
                    className="h-[46px]! px-10! mt-5!  rounded-lg bg-[#FF6C2D] text-[#FF6C2D] font-medium text-lg hover:bg-gray-300 transition border-0"
                >
                    Proceed
                </Button>
            </Form.Item>
        </Form>
    </div>
  );
};

export default CompanyDetails; 