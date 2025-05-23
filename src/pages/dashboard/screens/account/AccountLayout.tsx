import React from 'react';
import {Toaster} from 'react-hot-toast';
import { Link, Outlet, useLocation } from 'react-router-dom';

const AccountLayout: React.FC = () => {
  const location = useLocation();

  const navLinks = [
    { name: 'Personal details', path: '/account' }, // Default path for Personal details
    { name: 'Change Password', path: '/account/change-password' },
    { name: 'Passcode', path: '/account/passcode' },
    { name: 'Notifications', path: '/account/notifications' },
    { name: 'FAQs', path: '/account/faqs' },
  ];

  return (
    <div className="mt-5 px-10">
      <Toaster />
      <h2 className="text-lg font-semibold mb-4">My Account</h2>
        <div className='flex bg-white border-[#E5E9F0] border'>        
        <div className="w-64 border-r border-gray-200 p-4">
            <nav className='bg-white'>
            <ul>
                {navLinks.map((link) => (
                <li key={link.path} className="mb-2">
                    <Link
                    to={link.path}
                    className={`block py-3 px-3 rounded-md text-sm font-medium ${location.pathname === link.path ? 'bg-[#FFF0EA] text-[#E86229] border-r-4 border-[#FF8957]' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
                    >
                    {link.name}
                    </Link>
                </li>
                ))}
            </ul>
            </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-4">
            <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AccountLayout; 