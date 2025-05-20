import React from 'react';
import { Form, Input, Button, Select } from 'antd';
import { useOnboardingStore } from '@/global/store';
import { useBanksList } from '@/hooks/useAdmin';
import { verifyAccount } from '@/api/banks';
import toast from 'react-hot-toast';
import { DefaultOptionType } from 'antd/es/select';

const { Option } = Select;

interface Bank {
  name: string;
  code: string;
}

const AccountDetails: React.FC = () => {
  const [form] = Form.useForm();
  const { setNavPath, setFormData, formData } = useOnboardingStore();
  const { data: bankList, isLoading: isLoadingBanks } = useBanksList();

  const [isVerifying, setIsVerifying] = React.useState(false);
  const [accountName, setAccountName] = React.useState<string | null>(null);

  // Function to handle account verification
  const handleVerifyAccount = async () => {
    const { accountNumber, bankName } = form.getFieldsValue();

    // Check if bank is selected before verifying
    if (!bankName) {
        toast.error('Please select a bank before verifying account number.');
        return;
    }

    const selectedBank = bankList?.find((bank: Bank) => bank.name === bankName);

    if (!selectedBank?.code) {
        toast.error('Could not find bank code for the selected bank.');
        return;
    }

    setIsVerifying(true);
    setAccountName(null);
    try {
        const payload = {
            account_number: accountNumber,
            bank_code: selectedBank.code
        };
        const response = await verifyAccount(payload);
        
        console.log(response,'response');

        if (response?.status === 'ok') {
            setAccountName(response.data.data.account_name);
            toast.success('Account name fetched successfully.');
        } else {
            toast.error(response?.message || 'Failed to verify account.');
            setAccountName(null);
        }

    } catch (error: any) {
        toast.error(error.message || 'An error occurred during verification.');
        setAccountName(null);
    } finally {
        setIsVerifying(false);
    }
  };

  // Handle change on account number input
  const handleAccountNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const accountNumber = e.target.value;
    // Allow only digits for verification trigger, but don't restrict input type here if non-digits are needed for final form submission
    const digitsOnly = accountNumber.replace(/\D/g, '');
    form.setFieldsValue({ accountNumber: digitsOnly }); // Update form state with digits only for trigger
    setAccountName(null); 

    const bankName = form.getFieldValue('bankName');

    // Trigger verification if account number is at least 10 digits and bank is selected
    if (digitsOnly.length >= 10 && bankName) {
      handleVerifyAccount();
    }
  };

  // Handle change on bank name select
  const handleBankNameChange = (value: string) => {
    form.setFieldsValue({ bankName: value }); 
    setAccountName(null); 

    const accountNumber = form.getFieldValue('accountNumber');
    // Trigger verification if account number is already at least 10 digits
     if (accountNumber?.length >= 10) {
       handleVerifyAccount();
     }
  };

  const handleFinish = (values: any) => {
    // Ensure accountName is available if verification was triggered
     if (values.accountNumber?.length >= 10 && values.bankName && !accountName) {
       toast.error('Please wait for account verification to complete.');
       return;
     }

    const selectedBank = bankList?.find((bank: Bank) => bank.name === values.bankName);
    
    setFormData({ 
      ...formData, 
      accountDetails: {
        ...values,
        bankCode: selectedBank?.code,
        accountName: accountName 
      }
    });
    setNavPath("contact-details");
  };

  return (
    <div className="w-full mx-auto">
      <div className="bg-[#F5F6FA] rounded-md px-4 py-2 mb-6 text-[#667085] font-medium">Account details</div>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        requiredMark={false}
      >
        
        <Form.Item 
          label="Bank name" 
          name="bankName" 
          rules={[{ required: true, message: 'Please select a bank' }]}>
          <Select 
            showSearch
            placeholder="Select bank" 
            size="large"
            loading={isLoadingBanks}
            onChange={handleBankNameChange} 
            filterOption={(input: string, option?: DefaultOptionType) => {
              const childrenText = option?.children as string | undefined;
              return childrenText ? childrenText.toLowerCase().includes(input.toLowerCase()) : false;
            }}
          >
            {bankList?.map((bank: Bank, index: number) => (
              <Option key={index} value={bank.name}>
                {bank.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item 
          label="Account number" 
          name="accountNumber" 
          rules={[{ required: true, message: 'Please enter account number' }]}>
          <Input 
            placeholder="Enter details" 
            size="large" 
            onChange={handleAccountNumberChange} 
            maxLength={10} // Set max length to 11
            type="number" 
          />
        </Form.Item>
        
        {isVerifying ? (
          <div className="bg-[#FFF0EA] rounded-md px-4 py-3 mb-4 text-[#FF6C2D] font-medium text-base">
            Fetching account name...
          </div>
        ) : ( accountName &&
          <div className="bg-[#FFF0EA] rounded-md px-4 py-3 mb-4 text-[#FF6C2D] font-medium text-base">
            {accountName}
          </div>
        )}

        <Form.Item>
            <Button
                type="primary"
                htmlType="submit"
            loading={isVerifying} 
            disabled={isVerifying || !accountName} // Disable submit until account is verified
            className="h-[46px]! px-10! mt-5! rounded-lg bg-[#FF6C2D] text-[#FF6C2D] font-medium text-lg hover:bg-gray-300 transition border-0"
            >
                Proceed
            </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AccountDetails; 