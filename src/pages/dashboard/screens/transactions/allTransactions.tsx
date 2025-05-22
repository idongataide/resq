import React, { useState } from 'react';
import { Table, type ColumnDefinition } from '@/components/ui/Table';
import Images from '@/components/images';
import {getStatusStyle, getAvatarColor} from '@/components/ui/statusStyles';
import { FaArrowRight } from 'react-icons/fa';
import { GoArrowDownLeft } from "react-icons/go";
import { useTransactions } from '@/hooks/useAdmin';
import TransactionDetailsSidebar from './TransactionDetailsSidebar';

interface Transaction {
  _id: string;
  booking_ref?: string;
  user_data?: { first_name: string; last_name: string; email: string; phone_number: string; };
  vehicle_model?: string;
  status?: string;
  amount?: number;
  createdAt?: string;
  operator?: { _id: string; name: string; };
  drop_off_dst?: number;
  start_address?: string;
  end_address?: string;
  action?:string;
  service_fee?: number;
}

const AllTransactions: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const { data: transactionsData, isLoading } = useTransactions();

  console.log(transactionsData,'transactionsData')
  
  const handleViewTransaction = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsSidebarOpen(true);
  };

  const handleCloseSidebar = () => {
    setSelectedTransaction(null);
    setIsSidebarOpen(false);
  };

  const columns: Array<ColumnDefinition<Transaction & { id: string | number }>> = [
    {
        title: "Booking ID",
        dataIndex: "booking_ref",
        key: "booking_ref",
        render: (value) => (
          <div className="flex items-center gap-2">
            <GoArrowDownLeft className='text-[#475467]' />
            <span className='font-medium text-[#475467]'>{value || 'N/A'}</span>
          </div>
        ),
    },
    {
      title: "Customer",
      dataIndex: "user_data",
      key: "customer",
      render: (_, record) => (
        <span>{record.user_data?.first_name} {record.user_data?.last_name || 'N/A'}</span>
      ),
    },
    {
      title: "Vehicle model",
      dataIndex: "vehicle_model",
      key: "vehicle_model",
      render: (value) => value || 'N/A',
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <span className={getStatusStyle(status)}>
          {status || 'Unknown'}
        </span>
      ),
    },
    {
      title: "Amount",
      dataIndex: "service_fee",
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
      dataIndex: "action",
      key: "actions",
      render: (_, record) => (
        <div className="relative">
        </div>
      ),
    },
  ];

  const handlePageChange = (page: number, size: number) => {
    setCurrentPage(page);
    setPageSize(size);
  };

  if (isLoading) {
    return <div>Loading transactions...</div>;
  }

  const formattedTransactions = transactionsData?.map((transaction: Transaction) => ({
    ...transaction,
    id: transaction._id,
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
        pagination={formattedTransactions.length > pageSize ? {
          current: currentPage,
          pageSize: pageSize,
          total: formattedTransactions.length,
          onChange: handlePageChange,
        } : undefined}
        showActions
        onRowClick={(id: string) => {
           const selected = formattedTransactions.find((transaction: Transaction & { id: string | number }) => transaction.id === id);
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
