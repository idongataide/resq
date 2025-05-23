import React from 'react';
import { Form, Input, Button } from 'antd';
import ConfirmOperator from './2FA';
import { useOnboardingStore } from '@/global/store';
import { addOperators } from '@/api/operatorsApi';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const ContactDetails: React.FC = () => {
  const [form] = Form.useForm();
  const [show2FAModal, setShow2FAModal] = React.useState(false);
  const { setFormData, formData } = useOnboardingStore();
  const navigate = useNavigate()

  const handleFinish = async (values: any) => {
    setFormData({ ...formData, contactDetails: values });      
    setShow2FAModal(true);
  };

  const handle2FASuccess = async (otp?: string) => {
    try {
      const finalData = {
        operator_name: formData?.companyDetails?.companyName,
        operator_email: formData?.companyDetails?.email,
        phone_number: formData?.companyDetails?.phone,
        state: formData?.companyDetails?.state,
        lga: formData?.companyDetails?.lga,
        bank_name: formData?.accountDetails?.bankName,
        bank_code: formData?.accountDetails?.bankCode,
        account_number: formData?.accountDetails?.accountNumber,
        account_name: formData?.accountDetails?.accountName,
        contact_rep_email: formData?.contactDetails?.email,
        contact_rep_firstname: formData?.contactDetails?.firstName,
        contact_rep_lastname: formData?.contactDetails?.lastName,
        contact_rep_phone: formData?.contactDetails?.phone,
        otp,
      };

      const submitResponse = await addOperators(finalData);
      console.log(submitResponse?.response?.data?.status)
      if (submitResponse?.response?.data?.status === 'error') {
        toast.error(submitResponse?.response?.data?.msg || 'Failed to add operator');
        return;
      }

      toast.success('Operator added successfully');
      navigate('/operators')
      setShow2FAModal(false);
    } catch (error: any) {
      toast.error(error.message || 'An error occurred');
    }
  };

  return (
    <div className="w-full mx-auto">
      {show2FAModal && (
        <ConfirmOperator 
          onClose={() => setShow2FAModal(false)} 
          onSuccess={handle2FASuccess}
        />
      )}
      
      <div className="bg-[#F5F6FA] rounded-md px-4 py-2 mb-6 text-[#667085] font-medium">
        Contact person details
      </div>
      
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        requiredMark={false}
      >
        <Form.Item 
          label="First name" 
          name="firstName" 
          rules={[{ required: true, message: 'Please enter first name' }]}
        > 
          <Input className="h-[42px] border-[#D0D5DD]!" placeholder="Enter first name" size="large" />
        </Form.Item>
        
        <Form.Item 
          label="Last name" 
          name="lastName" 
          rules={[{ required: true, message: 'Please enter last name' }]}
        > 
          <Input className="h-[42px] border-[#D0D5DD]!" placeholder="Enter last name" size="large" />
        </Form.Item>
        
        <Form.Item 
          label="Email address" 
          name="email" 
          rules={[{ required: true, type: 'email', message: 'Please enter a valid email address' }]}
        > 
          <Input className="h-[42px] border-[#D0D5DD]!" placeholder="johndoe@xyz.com" size="large" />
        </Form.Item>
        
        <Form.Item 
          label="Phone number" 
          name="phone" 
          rules={[{ required: true, message: 'Please enter phone number' }]}
        > 
          <Input 
            addonBefore={
              <span className="flex items-center">
                <img src="https://hatscripts.github.io/circle-flags/flags/ng.svg" alt="NG" className="w-5 h-5 mr-1" />
                NG
              </span>
            } 
            maxLength={11}
            className="h-[42px] border-[#D0D5DD]!" 
            placeholder="+234" 
            size="large" 
          />
        </Form.Item>
        
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="h-[46px]! px-10! mt-5! rounded-lg bg-[#FF6C2D] text-white font-medium text-lg hover:bg-[#E55B1F] transition border-0"
          >
            Proceed
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ContactDetails;