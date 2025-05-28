import React, { useState } from 'react';
import { Form, Input, Button, Select } from 'antd';
import { useBanksList } from '@/hooks/useAdmin'; // Assuming this hook is available
import { verifyAccount } from '@/api/banks'; // Assuming this API call is available
import toast from 'react-hot-toast';
import { DefaultOptionType } from 'antd/es/select';

const { Option } = Select;

interface AddStakeHolderFormProps {
  onClose: () => void;
}

interface Bank {
  name: string;
  code: string;
}

const AddStakeHolderForm: React.FC<AddStakeHolderFormProps> = ({ onClose }) => {
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [preferredValueType, setPreferredValueType] = useState('Percentage');
  const [isVerifyingAccount, setIsVerifyingAccount] = useState(false);
  const [accountName, setAccountName] = useState<string | null>(null);

  const { data: bankList, isLoading: isLoadingBanks } = useBanksList();

  // Function to handle account verification
  const handleVerifyAccount = async (accountNumber: string, bankName: string) => {
    if (!bankName || !accountNumber || accountNumber.length < 10) {
        setAccountName(null);
        return;
    }

    const selectedBank = bankList?.find((bank: Bank) => bank.name === bankName);

    if (!selectedBank?.code) {
        toast.error('Could not find bank code for the selected bank.');
        setAccountName(null);
        return;
    }

    setIsVerifyingAccount(true);
    setAccountName(null);
    try {
        const payload = {
            account_number: accountNumber,
            bank_code: selectedBank.code
        };
        const response = await verifyAccount(payload);
        
        if (response?.status === 'ok') {
            setAccountName(response.data.data.account_name);
            toast.success('Account name fetched successfully.');
        } else {
            toast.error(response?.response?.data?.msg || 'Failed to verify account.');
            setAccountName(null);
        }

    } catch (error: any) {
        toast.error(error.message || 'An error occurred during verification.');
        setAccountName(null);
    } finally {
        setIsVerifyingAccount(false);
    }
  };

  const handleAccountNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const accountNumber = e.target.value;
    const digitsOnly = accountNumber.replace(/\D/g, '');
    form.setFieldsValue({ accountNumber: digitsOnly });
    setAccountName(null); // Clear account name on change

    const bankName = form.getFieldValue('bankName');
    if (digitsOnly.length >= 10 && bankName) {
      handleVerifyAccount(digitsOnly, bankName);
    }
  };

  const handleBankNameChange = (value: string) => {
    form.setFieldsValue({ bankName: value });
    setAccountName(null); // Clear account name on change

    const accountNumber = form.getFieldValue('accountNumber');
     if (accountNumber?.length >= 10) {
       handleVerifyAccount(accountNumber, value);
     }
  };

  const handleFinish = async (values: any) => {
     if (!accountName) {
       toast.error('Please verify the account number first.');
       return;
     }

    try {
      setIsSubmitting(true);
      // Add your form submission logic here, using values.accountName for the verified name
      console.log('Form values:', { ...values, accountName });
      onClose();
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
     <div className="fixed inset-0 z-[999] flex justify-end bg-[#38383880] p-5 bg-opacity-50" onClick={onClose}>
      <div className="md:w-[48%] lg:w-1/3 w-100 z-[9999] h-full bg-white rounded-xl slide-in overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="h-full bg-white rounded-xl overflow-hidden">
          <div className="flex justify-between items-center py-3 px-6 border-b border-[#D6DADD]">
            <h2 className="text-md font-semibold text-[#1C2023]">Add stakeholder</h2>
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
                      name="stakeholderName"
                      label="Stakeholder name"
                      rules={[{ required: true, message: 'Please enter stakeholder name!' }]}
                    >
                      <Input placeholder="Enter details" className="!h-[42px]" />
                    </Form.Item>

                    <Form.Item
                      name="bankName"
                      label="Bank name"
                      rules={[{ required: true, message: 'Please select bank name!' }]}
                    >
                      <Select
                        showSearch
                        placeholder="Select bank" 
                        className="!h-[42px]"
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
                      name="accountNumber"
                      label="Account number"
                      rules={[{ required: true, message: 'Please enter account number!' }]}
                    >
                      <Input
                         placeholder="Enter details"
                         className="!h-[42px]"
                         onChange={handleAccountNumberChange}
                         maxLength={10}
                         type="number"
                      />
                    </Form.Item>

                    {isVerifyingAccount ? (
                      <div className="mb-3 p-2 bg-[#FFF0EA] text-[#FF6C2D] text-sm rounded-lg">
                        Fetching account name...
                      </div>
                    ) : ( accountName &&
                      <div className="mb-3 p-2 bg-[#FFF0EA] text-[#FF6C2D] text-sm rounded-lg">
                        {accountName}
                      </div>
                    )}

                    <Form.Item
                      label="Preferred value type"
                      className="mb-3"
                    >
                      <div className="flex rounded-lg border border-[#E5E9F0]">
                        <button
                          type="button"
                          className={`flex-1 py-2 text-center text-sm font-medium ${preferredValueType === 'Percentage' ? 'bg-[#FF6C2D] text-white' : 'text-[#475467]'} rounded-l-lg`}
                          onClick={() => setPreferredValueType('Percentage')}
                        >
                          Percentage
                        </button>
                        <button
                          type="button"
                          className={`flex-1 py-2 text-center text-sm font-medium ${preferredValueType === 'Amount' ? 'bg-[#FF6C2D] text-white' : 'text-[#475467]'} rounded-r-lg`}
                          onClick={() => setPreferredValueType('Amount')}
                        >
                          Amount
                        </button>
                      </div>
                    </Form.Item>

                    <Form.Item
                      name="value"
                      label={preferredValueType === 'Percentage' ? 'Percentage' : 'Amount'}
                      rules={[{ required: true, message: `Please enter ${preferredValueType.toLowerCase()}!` }]}
                    >
                      <Input 
                        type={preferredValueType === 'Percentage' ? 'number' : 'text'} 
                        placeholder="Enter details" 
                        className="!h-[42px]"
                        suffix={preferredValueType === 'Percentage' ? '%' : '₦'}
                      />
                    </Form.Item>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 py-4 flex justify-end gap-3">
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  loading={isSubmitting}
                  disabled={isSubmitting || isVerifyingAccount || !accountName} // Disable if submitting, verifying, or account name not fetched
                  className="rounded-md h-[46px]! px-10! border border-transparent bg-[#FF6C2D] py-2 text-sm font-medium text-white shadow-sm hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                >
                  Save
                </Button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddStakeHolderForm; 