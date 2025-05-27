import React, { useState, useMemo } from 'react';
import { Table, type ColumnDefinition } from '@/components/ui/Table';

interface OperatorPayoutData {
  id: string;
  date: string;
  beneficiary: string;
  amountDue: number;
  amountPaid: number;
  bankName: string;
  accountNumber: string;
}

const OperatorPayoutTable: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Placeholder data
  const data: OperatorPayoutData[] = [
    // Add sample data based on the image
    // Add more data here for pagination to be visible
    { id: '1', date: 'Wed, 16-09-2025\n10:40am', beneficiary: 'Road Rescue', amountDue: 1000000, amountPaid: 1000000, bankName: 'GTbank', accountNumber: '2004600224' },
    { id: '2', date: 'Wed, 16-09-2025\n10:40am', beneficiary: 'MobilityOne', amountDue: 1000000, amountPaid: 1000000, bankName: 'SunTrust', accountNumber: '6604600224' },
    { id: '3', date: 'Wed, 16-09-2025\n10:40am', beneficiary: 'Towing & more', amountDue: 1000000, amountPaid: 1000000, bankName: 'Wema', accountNumber: '6604600277' },
    { id: '4', date: 'Wed, 16-09-2025\n10:40am', beneficiary: 'Ridera', amountDue: 1000000, amountPaid: 1000000, bankName: 'SunTrust', accountNumber: '6604600555' },
    { id: '5', date: 'Wed, 16-09-2025\n10:40am', beneficiary: 'Alhaji Amusan', amountDue: 1000000, amountPaid: 1000000, bankName: 'GTbank', accountNumber: '8814600224' },
  ];

  // In a real application, you would use dateFilter here to filter the data
  const filteredData = data; // Placeholder for filtering

  const handlePageChange = (page: number, size: number) => {
    setCurrentPage(page);
    setPageSize(size);
  };

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredData.slice(startIndex, startIndex + pageSize);
  }, [currentPage, pageSize, filteredData]);

  const columns: Array<ColumnDefinition<OperatorPayoutData>> = [
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
            <h1 className="text-md font-medium mb-0 text-[#344054]">Operator Payout</h1>
            <div className="text-sm text-gray-500">
            <button className="px-3 py-1 text-[#475467] text-xs cursor-pointer rounded-bl-md rounded-tl-md  border border-[#F2F4F7]">Daily</button>
            <button className="px-3 py-1 text-[#475467] text-xs cursor-pointer  border border-[#F2F4F7]">Weekly</button>
            <button className="px-3 py-1 text-[#475467] text-xs cursor-pointer rounded-br-md rounded-tr-md  border border-[#F2F4F7]">Monthly</button>
            </div>
      </div>
      <Table 
        columns={columns} 
        data={paginatedData} 
        pagination={filteredData.length > pageSize ? {
          current: currentPage,
          pageSize: pageSize,
          total: filteredData.length,
          onChange: handlePageChange,
        } : undefined}
      />
    </div>
  );
};

export default OperatorPayoutTable; 