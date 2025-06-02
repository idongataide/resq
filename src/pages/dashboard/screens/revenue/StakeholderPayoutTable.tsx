import React, { useState, useMemo } from 'react';
import { Table, type ColumnDefinition } from '@/components/ui/Table';
import { useStakeholderPayouts } from '@/hooks/useAdmin';
import LoadingScreen from '@/pages/dashboard/common/LoadingScreen';

export interface StakeholderItemData {
  id: string;
  name: string;
  amount: number;
  date  : string;
  bank_info: {
    bank_data: {
      bank_name: string;
      bank_code: string;
      account_number: string;
      account_name: string;
    }
  };
}


const StakeholderPayoutTable: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const { data: itemsData, isLoading } = useStakeholderPayouts();

  if (isLoading) {
    return <LoadingScreen />;
  }

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
      dataIndex: "date",
      key: "date",
      render: (date: string) => {
        if (!date) return 'N/A';
        const d = new Date(date);
        // Format: Mon, 02-06-2025
        const formatted = d.toLocaleDateString('en-GB', {
          weekday: 'short',
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        }).replace(/\//g, '-');
        return <span className='text-[#475467] font-medium'>{formatted}</span>;
      },
    },
    {
      title: "Beneficiary",
      dataIndex: "name",
      key: "beneficiary",
      render: (value: string) => <span className='text-[#475467] font-medium'>{value}</span>,
    },
    {
      title: "Amount due",
      dataIndex: "amount",
      key: "amountDue",
      render: (value: number) => `₦${value?.toLocaleString() || 'N/A'}`,
    },
    {
      title: "Bank name",
      dataIndex: "bank_info",
      key: "bankName",
      render: (bank_info: StakeholderItemData['bank_info']) => bank_info?.bank_data?.bank_name || 'N/A',
    },
    {
      title: "Account number",
      dataIndex: "bank_info",
      key: "accountNumber",
      render: (bank_info: StakeholderItemData['bank_info']) => bank_info?.bank_data?.account_number || 'N/A',
    },
  ];

  return (
    <div className="mb-6">
        <div className="py-2 px-4 bg-white rounded-md border-[#E5E9F0] flex justify-between items-center">
            <h1 className="text-md font-medium mb-0 text-[#344054]">Stakeholder's Payout</h1>
            <button className="flex items-center gap-2 px-4 py-2 text-[#667085] bg-[#F9FAFB] rounded-lg border border-[#E5E9F0] hover:bg-gray-50">
              <span>Filter</span>          
            </button>
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
