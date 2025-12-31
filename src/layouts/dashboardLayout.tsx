import React, { useState, useRef, useEffect, useMemo } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { IoIosNotificationsOutline } from "react-icons/io";
import { FaSun, FaMoon, FaChevronDown, FaLock, FaQuestionCircle, FaSignOutAlt, FaUser } from "react-icons/fa";
import { useOnboardingStore } from "../global/store";
import SiderScreen from "../pages/dashboard/common/sideBar";
import Images from "@/components/images";
import { useGetNotification } from "@/hooks/useAdmin";
import NotificationsSidebar from "@/components/NotificationsSidebar";

const DashboardLayout: React.FC = () => {
  const { siderBarView, userType, setUserType, role } = useOnboardingStore();
  const { data: notifications } = useGetNotification();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const datas = useOnboardingStore();
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Auto-detect lastma_admin role and set userType
  useEffect(() => {
    if (role === 'lastma_admin' && userType !== 'lastma') {
      setUserType('lastma');
    }
  }, [role, userType, setUserType]);


  const toggleNotifications = () => {
    setIsNotificationsOpen(!isNotificationsOpen);
  };

  const toggleUserDropdown = () => {
    setIsUserDropdownOpen(!isUserDropdownOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsUserDropdownOpen(false);
      }
    };

    if (isUserDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isUserDropdownOpen]);

  const handleLogout = () => {
    useOnboardingStore.persist.clearStorage();
    localStorage.clear();
    sessionStorage.clear();
    useOnboardingStore.setState({
      token: null,
      isAuthorized: false,
      firstName: "",
      lastName: "",
    });
    navigate("/login");
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

  const dropdownMenuItems = useMemo(() => [
    {
      id: 1,
      label: userType === 'lastma' ? "User Admin Mode" : "Lastma mode",
      icon: <FaUser className="text-[#667085]" />,
      onClick: () => {
        setUserType(userType === 'lastma' ? '' : 'lastma');
        setIsUserDropdownOpen(false);
        navigate('/home');
        setTimeout(() => {
          window.location.reload();
        }, 100);
      }
    },
    {
      id: 2,
      label: "Change Password",
      icon: <FaLock className="text-[#667085]" />,
      onClick: () => {
        navigate("/account/change-password");
        setIsUserDropdownOpen(false);
      }
    },
    {
      id: 3,
      label: "FAQs",
      icon: <FaQuestionCircle className="text-[#667085]" />,
      onClick: () => {
        setIsUserDropdownOpen(false);
      }
    },
    {
      id: 4,
      label: "Log out",
      icon: <FaSignOutAlt className="text-[#667085]" />,
      onClick: handleLogout
    }
  ], [userType, setUserType]);

  return (
    <main className="overflow-hidden bg-black">
      <div className="flex w-full bg-[rgb(249,250,251)]">
        <div
          className={`w-[100px] ${siderBarView ? "md:w-[280px]" : "md:w-[100px]"} z-[999] transition-all duration-500 border-r-gray-300 border-r-1 h-screen fixed rounded-r-3xl ${userType === 'lastma' || role === 'lastma_admin' ? 'bg-[#1D2939]' : 'bg-[#E86229]'} `}
        >
          <SiderScreen />
        </div>

        <div className="w-full min-h-screen flex justify-end">
          <div
            className={`w-[100%] ${siderBarView ? "md:pl-[280px]" : "md:pl-[100px]"} pl-[100px]
              transition-all duration-500 flex flex-col min-h-screen`}
          >
            <div className={`fixed ${siderBarView ? "w-[calc(100vw-280px)]" : "w-[calc(100vw-100px)]"} z-[800] py-4 mb-6 lg:flex-row- items-center flex-row flex justify-start md:justify-between bg-[#F9FAFB] px-8`}>
              <div className="flex items-center">
                <p className="text-lg pb-0 mb-0 md:mr-3 text-[#344054] font-medium capitalize">
                  {greeting.text} {datas?.firstName || ''}
                </p>
                {greeting.icon}
              </div>
              <div className="hidden md:flex items-center justify-between mt-3 lg:mt-0">
                <div className="flex gap-4 justify-center mr-10 items-center text-[20px] text-gray-500">
                  <IoIosNotificationsOutline onClick={toggleNotifications} className="cursor-pointer" />
                  {notifications && notifications.length > 0 && (
                    <span onClick={toggleNotifications} className="absolute top-5 cursor-pointer right-70 h-5 w-5 text-[11px] inline-flex items-center justify-center px-2 py-1 text-xs leading-none text-[#fff] transform translate-x-1/2 -translate-y-1/2 bg-[#FF6C2D] rounded-full">
                      {notifications.length}
                    </span>
                  )}
                </div>
                <div className="relative" ref={dropdownRef}>
                  <div
                    className="flex items-center justify-center bg-white rounded-full p-2 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={toggleUserDropdown}
                  >
                    <span className="text-[12px] text-[#667085] font-medium me-3">{datas?.email}</span>
                    <FaChevronDown className={`text-[12px] text-[#667085] font-medium transition-transform ${isUserDropdownOpen ? 'rotate-180' : ''}`} />
                  </div>

                  {isUserDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-gray-200 z-[1000] overflow-hidden">
                      {/* User Info Section */}
                      <div className="px-4 py-4 border-b border-gray-200 flex items-center gap-3">
                        <img
                          src={datas?.avatar || Images.avatar}
                          alt="Profile"
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-[#344054]">
                            {datas?.firstName} {datas?.lastName}
                          </p>
                          <p className="text-xs text-[#667085] mt-1">
                            {datas?.email}
                          </p>
                        </div>
                      </div>

                      <div className="py-2">
                        {dropdownMenuItems.map((item) => (
                          <button
                            key={item.id}
                            onClick={item.onClick}
                            className="w-full px-4 py-3 cursor-pointer flex items-center gap-3 text-sm text-[#344054] hover:bg-gray-50 transition-colors"
                          >
                            {item.icon}
                            <span>{item.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
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