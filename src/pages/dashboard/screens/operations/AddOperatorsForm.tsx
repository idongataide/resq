import React from 'react';
import { useOnboardingStore } from '@/global/store';
import CompanyDetails from './CompanyDetails';
import AccountDetails from './AccountDetails';
import ContactDetails from './ContactDetails';

const AddOperatorsForm: React.FC = () => {
  const navPath = useOnboardingStore();

  return (
    <div className="p-14">
      <h2 className="text-lg! font-medium text-[#667085] mb-7">Add Operators</h2>
      <div className="flex flex-col gap-4">
        {navPath?.navPath === "company-details" && <CompanyDetails /> }
        {navPath?.navPath === "account-details" && <AccountDetails /> }
        {navPath?.navPath === "contact-details" && <ContactDetails /> }
    </div>
  </div>
);
};

export default AddOperatorsForm; 