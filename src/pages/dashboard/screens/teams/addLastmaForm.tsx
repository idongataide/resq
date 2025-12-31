import React from 'react';
import { Form, Input, Button, Select } from 'antd';
import { addTeams } from '@/api/teamsApi';
import { ResponseValue } from '@/interfaces/enums';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
const { Option } = Select;

const AddLastmaMembersForm: React.FC<{ onProceed?: () => void }> = () => {
 
    const navigate = useNavigate();
    const [loading, setLoading] = React.useState(false);
    const [form] = Form.useForm();

    const onFinish = (values: any) => {
        setLoading(true);
        const data = {
            first_name: values.firstName,
            last_name: values.lastName,
            email: values.email,
            phone_number: values.phone,
            // role: values.role,
            command: values.command,
        };
      
        addTeams(data)
            .then((res) => {
                if (res?.error) {
                    toast.error(res.message);
                    return;
                }
                if (res.status === ResponseValue.SUCCESS) {
                    toast.success('Team member added successfully');
                    navigate("/teams"); 
                } else {
                    const errorMsg = res?.response?.data?.msg || 'Failed to add team member';
                    toast.error(errorMsg);
                }
            })
            .catch((error) => {
                toast.error(error.message || "An unexpected error occurred");
            })
            .finally(() => {
                setLoading(false);
            });
    };

  return (
   <div className="flex flex-col gap-4 p-14">
    <div className="w-full mx-auto">   
        <Toaster/>
        <h2 className="text-[#667085] text-xl font-medium mb-6">Add Latsma members</h2>
            <Form 
                form={form}
                layout="vertical" 
                onFinish={onFinish}
            >
                <Form.Item label="First Name" name="firstName" rules={[{ required: true, message: 'Enter first name' }]}>
                    <Input placeholder="Enter first name" />
                </Form.Item>
                <Form.Item label="Last Name" name="lastName" rules={[{ required: true, message: 'Enter last name' }]}>
                    <Input placeholder="Enter last name" />
                </Form.Item>
                <Form.Item label="Phone number" name="phone" rules={[{ required: true, message: 'Enter phone number' }]}>
                    <Input
                        addonBefore={
                            <span className="flex items-center">
                                <img src="https://flagcdn.com/ng.svg" alt="NG" style={{ width: 20, marginRight: 4 }} />NG
                            </span>
                        }
                        placeholder="+234"
                    />
                </Form.Item>
                {/* <Form.Item label="Role" name="role" rules={[{ required: true, message: 'Select role' }]}>
                    <Select placeholder="Select" className='!h-[46px]'>
                        <Option value="lastma">Lastma User</Option>
                    </Select>
                </Form.Item> */}
                <Form.Item label="Command" name="command" rules={[{ required: true, message: 'Select command' }]}>
                    <Select placeholder="Select" className='!h-[46px]'>
                        <Option value="ikoyi">Ikoyi</Option>
                        <Option value="jakande">Jakande</Option>
                    </Select>
                </Form.Item>
                <Form.Item label="Email address" name="email" rules={[{ required: true, message: 'Enter email address' }]}>
                    <Input placeholder="johndoe@xyz.com" />
                </Form.Item>
                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                        className="h-[46px]! px-10! mt-5! rounded-lg bg-[#FF6C2D] text-white font-medium text-lg hover:bg-[#E55B1F] transition border-0"
                    >
                        Send Invite
                    </Button>
                </Form.Item>
            </Form>
    </div>
  </div>
  );
};

export default AddLastmaMembersForm; 