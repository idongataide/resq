import React from 'react';
import { Form, Input, Button } from 'antd';
import Images from '@/components/images';
import { CiEdit } from "react-icons/ci";


const Profile: React.FC = () => {
  const [form] = Form.useForm();

  // You would typically fetch the user's profile data here
  // and set the form initial values

  return (
    <div className="p-4">
        <div className='w-full h-[124px] bg-[#FFF0EA] rounded-md'>

        </div>
      
        <div className="flex w-[80%] mx-auto items-center mb-6 mt-[-40px]">
            <div className="mr-2">
                <img
                    src={Images.profile} // Replace with actual image source
                    alt="Profile"
                    className="w-30 h-30 rounded-full object-cover"
                />
            </div>
            <div>
                <h3 className="text-xl font-semibold text-[#344054] mt-5">Finidi George</h3>
                <p className="text-[#667085]">finidigeorge@gmail.com</p>
            </div>
        </div>

      <div className='p-5 pt-0'>

      <div className="flex justify-between items-center">
        <div className=''>
            <h4 className="font-semibold mb-1 text-[#344054]">Profile Information</h4>
            <p className="text-[#667085]">Lorem ipsum dolour of the dorlor rolor</p>
        </div>            
         <span className="text-[#667085] flex items-center bg-[#E5E9F0] rounded-sm whitespace-nowrap text-nowrap font-medium px-4 py-1"><CiEdit  className='text-[#667085] mr-2'/> Edit</span>
      </div>

        <div className='mt-10  border-t border-[#E5E9F0] py-7'>
            <Form form={form} layout="vertical" >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 mb-9">
                    <Form.Item label="First name" name="firstName">
                        <Input placeholder="Finidi" /> {/* Replace with actual value */}
                    </Form.Item>
                    <Form.Item label="Last name" name="lastName">
                        <Input placeholder="George" /> {/* Replace with actual value */}
                    </Form.Item>
                    <Form.Item label="Phone number" name="phoneNumber">
                        <Input placeholder="+234 8008 800 800" /> {/* Replace with actual value */}
                    </Form.Item>
                    <Form.Item label="Email Address" name="emailAddress">
                        <Input placeholder="finidigeorge@gmail.com" /> {/* Replace with actual value */}
                    </Form.Item>
                    <Form.Item label="Role" name="role">
                        <Input placeholder="Super admin" readOnly /> {/* Replace with actual value */}
                    </Form.Item>
                </div>

                <div className="border-t border-gray-200 py-7 flex justify-end gap-3">
                    <Button type="primary" htmlType="submit" className="rounded-md h-[46px]! px-10! border border-transparent bg-[#FF6C2D] py-2 text-sm font-medium text-white shadow-sm hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2">
                    Save changes
                    </Button>
                </div>
            </Form>
        </div>
      </div>
    </div>
  );
};

export default Profile; 