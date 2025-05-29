import React, { useState, useMemo } from 'react';
import { Table, type ColumnDefinition } from '@/components/ui/Table';

export interface StakeholderItemData {
  id: string;
  name: string;
  amount: number;
  bank: {
    bank_name: string;
    bank_code: string;
    account_number: string;
    account_name: string;
  };
}

interface StakeholderPayoutTableProps {
  itemsData: StakeholderItemData[];
  payoutDate: string;
}

const StakeholderPayoutTable: React.FC<StakeholderPayoutTableProps> = ({ itemsData, payoutDate }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const handlePageChange = (page: number, size: number) => {
    setCurrentPage(page);
    setPageSize(size);
  };

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return itemsData?.slice(startIndex, startIndex + pageSize);
  }, [currentPage, pageSize, itemsData]);

  const columns: Array<ColumnDefinition<StakeholderItemData>> = [
    {
      title: "Date",
      dataIndex: "id",
      key: "date",
      render: () => <span className='text-[#475467] font-medium'>{payoutDate}</span>,
    },        
    {
      title: "Beneficiary",
      dataIndex: "name",
      key: "beneficiary",
    },
    {
      title: "Amount due",
      dataIndex: "amount",
      key: "amountDue",
      render: (value: number) => `₦${value?.toLocaleString() || 'N/A'}`,
    },
    {
      title: "Bank name",
      dataIndex: "bank",
      key: "bankName",
      render: (bank: StakeholderItemData['bank']) => bank?.bank_name || 'N/A',
    },
    {
      title: "Account number",
      dataIndex: "bank",
      key: "accountNumber",
      render: (bank: StakeholderItemData['bank']) => bank?.account_number || 'N/A',
    },
  ];

  return (
    <div className="mb-6">
        <div className="py-2 px-4 bg-white rounded-md border-[#E5E9F0] flex justify-between items-center">
            <h1 className="text-md font-medium mb-0 text-[#344054]">Stakeholder's Payout</h1>
            <div className="text-sm text-gray-500">
            <button className="px-3 py-1 text-[#475467] text-xs cursor-pointer rounded-bl-md rounded-tl-md  border border-[#F2F4F7]">Daily</button>
            <button className="px-3 py-1 text-[#475467] text-xs cursor-pointer  border border-[#F2F4F7]">Weekly</button>
            <button className="px-3 py-1 text-[#475467] text-xs cursor-pointer rounded-br-md rounded-tr-md  border border-[#F2F4F7]">Monthly</button>
            </div>
        </div>
        <Table 
            columns={columns} 
            data={paginatedData} 
            pagination={itemsData?.length > pageSize ? {
            current: currentPage,
            pageSize: pageSize,
            total: itemsData?.length,
            onChange: handlePageChange,
            } : undefined}
        />
    </div>
  );
};

export default StakeholderPayoutTable; 
