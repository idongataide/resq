import React, { useState } from 'react';
import { Table, type ColumnDefinition } from '@/components/ui/Table';
import Images from '@/components/images';
import { getStatusStyle } from '@/components/ui/statusStyles';
import { FaArrowRight } from 'react-icons/fa';
import { GoArrowDownLeft } from "react-icons/go";
import { useTransactions } from '@/hooks/useAdmin';
import TransactionDetailsSidebar from './TransactionDetailsSidebar';
import LoadingScreen from '@/pages/dashboard/common/LoadingScreen';
import { Transaction } from '@/types/transaction';
import { useOnboardingStore } from '@/global/store';

const getStatusText = (status: number) => {
  switch(status) {
    case 0: return 'Pending';
    case 1: return 'Successful';
    case 2: return 'Failed';
    case 3: return 'Abandoned';
    case 4: return 'Cancelled';
    default: return 'Unknown';
  }
};

const AllTransactions: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const { data: transactionsData, isLoading } = useTransactions();
  const { userType, role } = useOnboardingStore();
  const isLastmaAdmin = userType === 'lastma' || role === 'lastma_admin';

  
  const handleViewTransaction = (transaction: Transaction) => {
    if (!transaction) return;
    setSelectedTransaction(transaction);
    setIsSidebarOpen(true);
  };

  const handleCloseSidebar = () => {
    setSelectedTransaction(null);
    setIsSidebarOpen(false);
  };

  const baseColumns: Array<ColumnDefinition<Transaction & { id: string | number }>> = [
    {
        title: "Booking ID",
        dataIndex: "booking_ref",
        key: "booking_ref",
        render: (value) => (
          <div className="flex items-center gap-2">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center bg-[#EBF7F2] text-[#2FA270]`}>
              <GoArrowDownLeft className='text-[#2FA270] font-extrabold' size={14} />
            </div>
            <span className='font-medium text-[#475467]'>{value || 'N/A'}</span>
          </div>
        ),
    },
    {
      title: isLastmaAdmin ? "Officer Name" : "Customer",
      dataIndex: "user_data",
      key: isLastmaAdmin ? "officer_name" : "customer",
      render: (_, record) => (
        <span>{record?.user_data?.first_name} {record?.user_data?.last_name || 'N/A'}</span>
      ),
    },
  ];

  const lastmaColumns: Array<ColumnDefinition<Transaction & { id: string | number }>> = isLastmaAdmin ? [
    {
      title: "Driver",
      dataIndex: ["user_data", "first_name"] as any,
      key: "driver",
      render: (_, record) => (
        <span>{record?.booking_data?.first_name} {record?.booking_data?.last_name || 'N/A'}</span>
      ),
    },
    {
      title: "Driver Phone, no.",
      dataIndex: ["user_data", "phone_number"] as any,
      key: "driver_phone",
      render: (_, record) => (
        <span>{record?.booking_data?.phone_number || 'N/A'}</span>
      ),
    },
  ] : [];

  const commonColumns: Array<ColumnDefinition<Transaction & { id: string | number }>> = [
    {
      title: "Vehicle model",
      dataIndex: "vehicle_model",
      key: "vehicle_model",
      render: (_, record) => (
        <span>{record?.booking_data?.vehicle_model} </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: number) => (
        <span className={getStatusStyle(getStatusText(status))}>
          {getStatusText(status)}
        </span>
      ),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      className: "font-medium",
      render: (value: number) => `₦${value?.toLocaleString() || 'N/A'}`,
    },
    {
      title: "Date & time",
      dataIndex: "createdAt",
      key: "createdAt",
       render: (value: string) => {
        if (!value) return 'N/A';
        const date = new Date(value);
        if (isNaN(date.getTime())) return 'N/A';
        return date.toLocaleString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      },
    },
    {
      title: "Actions",
      dataIndex: ["action"] as any,
      key: "actions",
      render: (_, record) => (
        <div className="relative">
           <span
            className="flex items-center gap-1 text-[#344054] cursor-pointer hover:underline"
            onClick={() => handleViewTransaction(record)}
          >
            View <FaArrowRight size={12} />
          </span>
        </div>
      ),
    },
  ];

  const columns = [...baseColumns, ...lastmaColumns, ...commonColumns];

  const handlePageChange = (page: number, size: number) => {
    setCurrentPage(page);
    setPageSize(size);
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  const formattedTransactions = transactionsData?.map((transaction: Transaction) => ({
    ...transaction,
    id: transaction.trasaction_id,
  })) || [];

  return (
    <div className="mb-6">
      <div className="py-2 px-4 bg-white rounded-md border-[#E5E9F0] flex justify-between items-center">
        <h1 className="text-lg font-bold mb-0! text-[#1C2023]">Transaction Log</h1>
        <button className="flex items-center gap-2 px-4 py-2 text-[#667085] bg-[#F9FAFB] rounded-lg border border-[#E5E9F0] hover:bg-gray-50">
          <img src={Images.icon.filter} alt="Filter" className="w-4 h-4" />
          <span>Filter</span>          
        </button>
      </div>
      
      <Table
        columns={columns as ColumnDefinition<{ id: string }>[]}
        data={formattedTransactions.slice((currentPage - 1) * pageSize, currentPage * pageSize)}
        pagination={formattedTransactions?.length > pageSize ? {
          current: currentPage,
          pageSize: pageSize,
          total: formattedTransactions?.length,
          onChange: handlePageChange,
        } : undefined}
        showActions
        onRowClick={(id: string) => {
           const selected = formattedTransactions?.find((transaction: Transaction & { id: string | number }) => transaction.id === id);
           if (selected) {
             handleViewTransaction(selected as Transaction);
           }
        }}
      />

      <TransactionDetailsSidebar
        isOpen={isSidebarOpen}
        onClose={handleCloseSidebar}
        transaction={selectedTransaction}
      />
    </div>
  );
};

export default AllTransactions;
