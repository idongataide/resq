import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { CiSearch } from "react-icons/ci";
import { IoIosNotificationsOutline } from "react-icons/io";
import { FaRegQuestionCircle, FaSun, FaMoon } from "react-icons/fa";
import { useOnboardingStore } from "../global/store";
import SiderScreen from "../pages/dashboard/common/sideBar";
import Images from "@/components/images";
import { useGetNotification } from "@/hooks/useAdmin";
import NotificationsSidebar from "@/components/NotificationsSidebar";



const DashboardLayout: React.FC = () => {
  const { siderBarView } = useOnboardingStore();
  const { data: notifications } = useGetNotification();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const datas = useOnboardingStore()

  const toggleNotifications = () => {
    setIsNotificationsOpen(!isNotificationsOpen);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      return {
        text: 'Good morning',
        icon: <img src={Images.greetings} alt="user" className="w-7 h-7" />
      };
    } else if (hour >= 12 && hour < 17) {
      return {
        text: 'Good afternoon',
        icon: <FaSun className="w-5 h-5 text-orange-500" />
      };
    } else {
      return {
        text: 'Good evening',
        icon: <FaMoon className="w-5 h-5 text-[#344054]" />
      };
    }
  };

  const greeting = getGreeting();

 return (
    <main className="overflow-hidden bg-black">
      <div className="flex w-full bg-[rgb(249,250,251)]">
        <div
          className={`w-[100px] ${siderBarView ? "md:w-[280px]" : "md:w-[100px]"} z-[999] transition-all duration-500 border-r-gray-300 border-r-1 h-screen fixed rounded-r-3xl bg-[#E86229] `}
        >
          <SiderScreen />
        </div>

        <div className="w-full min-h-screen flex justify-end">
          <div
              className={`w-full ${siderBarView ? "lg:pl-[280px] pl-[100px]" : "md:pl-[100px]"} 
              transition-all duration-500 flex flex-col min-h-screen`}
            >
            <div className="fixed w-[calc(100vw-100px)] md:w-[calc(100vw-280px)] z-[800]  py-4 mb-6 lg:flex-row- items-center flex-row flex justify-start md:justify-between bg-white px-8 ">
              <div className="flex items-center">
                <p className="text-lg pb-0 mb-0 md:mr-3 text-[#344054] font-medium capitalize">
                  {greeting.text} {datas?.firstName || ''}
                </p>
                {greeting.icon}
              </div>
              <div className="hidden md:flex items-center justify-between mt-3 lg:mt-0">
                <div className="flex items-center border border-[#e5e8ea] md:w-[250px] lg:w-[400px] w-[220px] rounded-full pl-2 bg-[#F9FAFB] md:mr-2 lg:mr-10">
                  <CiSearch className="text-[24px] text-[#B5BDC2] " />
                  <input
                    className="border-0 outline-none h-[45px] w-full pl-1 text-[14px] text-[#B5BDC2] tracking-wide"
                    placeholder="search anything here..."
                  />
                </div>
                <div className="flex gap-4 justify-center mr-10 items-center text-[20px] text-gray-500">
                  <FaRegQuestionCircle className="mr-4 text-[15px] cursor-pointer" />
                  <IoIosNotificationsOutline onClick={toggleNotifications} className="cursor-pointer" />
                  {notifications && notifications.length > 0 && (
                    <span onClick={toggleNotifications} className="absolute top-7 cursor-pointer right-18 h-5 w-5 text-[11px] inline-flex items-center justify-center px-2 py-1 text-xs leading-none text-[#fff] transform translate-x-1/2 -translate-y-1/2 bg-[#FF6C2D] rounded-full">
                      {notifications.length}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <section className="px-6- mt-20">
              <Outlet />
            </section>
          </div>
        </div>
      </div>
    
      <NotificationsSidebar isOpen={isNotificationsOpen} onClose={toggleNotifications} notifications={notifications || []} />
    </main>
  );
};

export default DashboardLayout;
