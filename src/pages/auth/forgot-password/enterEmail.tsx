"use client";
import { Helmet } from "react-helmet-async";
import { Form, Input, Button } from "antd";
import Images from "../../../components/images";
import { Link } from "react-router-dom";


const EnterEmail = () => {
    
    const onFinish = (values: any) => {
        // Handle login logic here
        console.log('Login values:', values);
    };

    return (
        <div className="flex flex-col items-start w-full">
            <Helmet>
                <meta charSet="utf-8" />
                <title>RESQ: Forgot Password</title>
                <link rel="canonical" href={`${URL}`} />
            </Helmet> 
          
            <div className="flex justify-center m-auto mb-6">
                <img src={Images.logo} alt="RESQ Logo" className="h-10" />
            </div>

            {/* Welcome Text */}
            <div className="mb-8 text-start ">
                <h2 className="text-2xl font-bold! text-[#475467] mb-1!">Forgot password</h2>
                <p className="text-sm font-medium text-[#667085]">Please enter your email to request a password reset</p>
            </div>
            <Form
                name="login"
                layout="vertical"
                onFinish={onFinish}
                className="w-full"
            >
                <Form.Item
                    label="Email Address"
                    name="email"
                    rules={[{ required: true, message: 'Please input your email!' }]}
                >
                    <Input placeholder="johndoe@xyz.com" className="h-[42px] border-[#D0D5DD]!" type="email" />
                </Form.Item>


                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        className="w-full h-[46px]! mt-3!  rounded-lg bg-[#FF6C2D] text-[#FF6C2D] font-medium text-lg hover:bg-gray-300 transition border-0"
                    >
                        Send reset OTP
                    </Button>
                </Form.Item>

                <div className="flex justify-center mt-3 mb-2">
                    <Link to="/login" 
                     className="text-[14px] text-[#FF6C2D]! hover:underline">
                        Back to login
                    </Link>
                </div>
            </Form>
        </div>
    )
}
    

export default EnterEmail;