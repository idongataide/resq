import React, { useState, useMemo } from 'react';
import { Table, type ColumnDefinition } from '@/components/ui/Table';

interface StakeholderPayoutData {
  id: string;
  date: string;
  beneficiary: string;
  amountDue: number;
  amountPaid: number;
  bankName: string;
  accountNumber: string;
}

const StakeholderPayoutTable: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Placeholder data
  const data: StakeholderPayoutData[] = [
    // Add sample data based on the image
    // Add more data here for pagination to be visible
    { id: '1', date: 'Wed, 16-09-2025\n10:40am', beneficiary: 'Transco', amountDue: 1000000, amountPaid: 1000000, bankName: 'GTbank', accountNumber: '2004600224' },
    { id: '2', date: 'Wed, 16-09-2025\n10:40am', beneficiary: 'RESQ', amountDue: 1000000, amountPaid: 1000000, bankName: 'SunTrust', accountNumber: '6604600224' },
    { id: '3', date: 'Wed, 16-09-2025\n10:40am', beneficiary: 'LASG Tax', amountDue: 1000000, amountPaid: 1000000, bankName: 'Wema', accountNumber: '6604600277' },
    { id: '4', date: 'Wed, 16-09-2025\n10:40am', beneficiary: 'Wintra', amountDue: 1000000, amountPaid: 1000000, bankName: 'SunTrust', accountNumber: '6604600555' },
    { id: '5', date: 'Wed, 16-09-2025\n10:40am', beneficiary: 'FIRS', amountDue: 1000000, amountPaid: 1000000, bankName: 'GTbank', accountNumber: '8814600224' },
  ];

  const handlePageChange = (page: number, size: number) => {
    setCurrentPage(page);
    setPageSize(size);
  };

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return data.slice(startIndex, startIndex + pageSize);
  }, [currentPage, pageSize, data]);

  const columns: Array<ColumnDefinition<StakeholderPayoutData>> = [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Beneficiary",
      dataIndex: "beneficiary",
      key: "beneficiary",
    },
    {
      title: "Amount due",
      dataIndex: "amountDue",
      key: "amountDue",
      render: (value: number) => `₦${value?.toLocaleString() || 'N/A'}`,
    },
    {
      title: "Amount paid",
      dataIndex: "amountPaid",
      key: "amountPaid",
      render: (value: number) => `₦${value?.toLocaleString() || 'N/A'}`,
    },
    {
      title: "Bank name",
      dataIndex: "bankName",
      key: "bankName",
    },
    {
      title: "Account number",
      dataIndex: "accountNumber",
      key: "accountNumber",
    },
  ];

  return (
    <div className="mb-6">
        <div className="py-2 px-4 bg-white rounded-md border-[#E5E9F0] flex justify-between items-center">
            <h1 className="text-md font-medium mb-0 text-[#344054]">Stakeholder’s Payout</h1>
            <div className="text-sm text-gray-500">
            <button className="px-3 py-1 text-[#475467] text-xs cursor-pointer rounded-bl-md rounded-tl-md  border border-[#F2F4F7]">Daily</button>
            <button className="px-3 py-1 text-[#475467] text-xs cursor-pointer  border border-[#F2F4F7]">Weekly</button>
            <button className="px-3 py-1 text-[#475467] text-xs cursor-pointer rounded-br-md rounded-tr-md  border border-[#F2F4F7]">Monthly</button>
            </div>
        </div>
        <Table 
            columns={columns} 
            data={paginatedData} 
            pagination={data.length > pageSize ? {
            current: currentPage,
            pageSize: pageSize,
            total: data.length,
            onChange: handlePageChange,
            } : undefined}
        />
    </div>
  );
};

export default StakeholderPayoutTable; 
