import React, { useState } from 'react';
import { Table, type ColumnDefinition } from '../../../../components/ui/Table';
import Images from '../../../../components/images';
import {getStatusStyle, getAvatarColor} from '../../../../components/ui/statusStyles';
import { FaArrowRight } from 'react-icons/fa';
import TransactionDetailsModal from './TransactionDetailsModal';
import { GoArrowDownLeft } from "react-icons/go";

interface Transaction {
  id: string;
  bookingId: string;
  customer: string;
  vehicleModel: string;
  status: string;
  amount: string;
  dateTime: string;
  action?: string;
}

const mockData: Transaction[] = [
  {
    id: '1',
    bookingId: 'RESQ58120034',
    customer: 'Feranmi Akinwale',
    vehicleModel: 'Rav4 2018',
    status: 'Completed',
    amount: '₦32,500',
    dateTime: 'Wed, 14-04-25 6:30pm',
  },
  {
    id: '2',
    bookingId: 'RESQ58120034',
    customer: 'Morris Chikwelu',
    vehicleModel: 'Camry 2002',
    status: 'Failed',
    amount: '₦32,500',
    dateTime: 'Wed, 14-04-25 6:30pm',
  },
  {
    id: '3',
    bookingId: 'RESQ58120034',
    customer: 'Sanni Musa',
    vehicleModel: 'Mercedez GLE S',
    status: 'Completed',
    amount: '₦37,500',
    dateTime: 'Wed, 14-04-25 6:30pm',
  },
  {
    id: '4',
    bookingId: 'RESQ58120034',
    customer: 'Kiki Ovie',
    vehicleModel: 'Suzuki 2012',
    status: 'Pending',
    amount: '₦27,500',
    dateTime: 'Wed, 14-04-25 6:30pm',
  },
  {
    id: '5',
    bookingId: 'RESQ58120034',
    customer: 'Preye Johnson',
    vehicleModel: 'Toyota Hiace 2014',
    status: 'Abandoned',
    amount: '₦30,500',
    dateTime: 'Wed, 14-04-25 6:30pm',
  },
  {
    id: '6',
    bookingId: 'RESQ58120034',
    customer: 'Maddy Ataide',
    vehicleModel: 'Sienna s4 2003',
    status: 'Completed',
    amount: '₦27,500',
    dateTime: 'Wed, 14-04-25 6:30pm',
  },
  {
    id: '7',
    bookingId: 'RESQ58120034',
    customer: 'Dubem Orji',
    vehicleModel: 'Lexus 350 2018',
    status: 'Failed',
    amount: '₦27,500',
    dateTime: 'Wed, 14-04-25 6:30pm',
  },
  {
    id: '8',
    bookingId: 'RESQ58120034',
    customer: 'Caleb Careem',
    vehicleModel: 'Toyota truck 2012',
    status: 'Completed',
    amount: '₦41,500',
    dateTime: 'Wed, 14-04-25 6:30pm',
  },
  {
    id: '9',
    bookingId: 'RESQ58120034',
    customer: 'Funke Akinsanya',
    vehicleModel: 'MAN storm 2003',
    status: 'Completed',
    amount: '₦121,500',
    dateTime: 'Wed, 14-04-25 6:30pm',
  },
];

const AllTransactions: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewTransaction = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsModalOpen(true);
  };

  const columns: Array<ColumnDefinition<Transaction>> = [

  
    {
        title: "Booking ID",
        dataIndex: "bookingId",
        key: "name",
        render: (value, _, rowIndex) => (
          <div className="flex items-center gap-2">
            <div
              className={`w-8 h-8 flex items-center justify-center rounded-full font-semibold ${getAvatarColor(
                (rowIndex)
              )}`}
            >
              <GoArrowDownLeft className='text-[#475467]' />
            </div>
            <span className='font-medium text-[#475467]'>{value}</span>
          </div>
        ),
    },
    {
      title: "Customer",
      dataIndex: "customer",
      key: "customer",
    },
    {
      title: "Vehicle model",
      dataIndex: "vehicleModel",
      key: "vehicleModel",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <span className={getStatusStyle(status)}>
          {status}
        </span>
      ),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      className: "font-medium",
    },
    {
      title: "Date & time",
      dataIndex: "dateTime",
      key: "dateTime",
    },
    {
      title: "Actions",
      dataIndex: "action",
      key: "actions",
      render: (_, record) => (
        <div className="relative">
          <button 
            onClick={() => handleViewTransaction(record)}
            className="text-[#667085]! text-sm! font-medium flex items-center gap-2 cursor-pointer"
          >
            View <FaArrowRight className='ml-2' />
          </button>
        </div>
      ),
    },
  ];

  const handlePageChange = (page: number, size: number) => {
    setCurrentPage(page);
    setPageSize(size);
  };

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
        columns={columns}
        data={mockData.slice((currentPage - 1) * pageSize, currentPage * pageSize)}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: mockData.length,
          onChange: handlePageChange,
        }}
        showActions
        onRowClick={(id) => console.log('Clicked row:', id)}
      />

      <TransactionDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        transaction={selectedTransaction ? {
          ...selectedTransaction,
          serviceType: 'Malfunction',
          totalKm: '21km',
          date: selectedTransaction.dateTime,
          towingOperator: 'Move360',
          pickup: '14, Aku str, Ogudu GRA, Ogudu',
          dropoff: 'Mechanic Village Ikeja'
        } : null}
      />
    </div>
  );
};

export default AllTransactions;
