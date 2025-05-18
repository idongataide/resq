import React, { useState, useEffect } from 'react';
import { Table, type ColumnDefinition } from '@/components/ui/Table';
import Images from '@/components/images';
import { getStatusStyle, getAvatarColor } from '@/components/ui/statusStyles';
import { FaArrowRight, FaCheck, FaTimes } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import { BookingRequest, getBookingsByStatus, BookingStatus } from '@/data/bookingData';
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { FaAngleLeft } from "react-icons/fa6";


const BookingTable: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [selectedRequest, setSelectedRequest] = useState<BookingRequest | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookingData, setBookingData] = useState<BookingRequest[]>([]);
  const [title, setTitle] = useState('');

  const { status } = useParams<{ status: BookingStatus }>();
  

  useEffect(() => {
    if (status) {
      const data = getBookingsByStatus(status as BookingStatus);
      setBookingData(data);
      setTitle(status.charAt(0).toUpperCase() + status.slice(1) + ' Requests');
    }
  }, [status]);

  const handleViewRequest = (request: BookingRequest) => {
    setSelectedRequest(request);
    setIsModalOpen(true);
  };

  const handleApprove = (request: BookingRequest) => {
    // Handle approve action
    console.log('Approved:', request);
  };

  const handleReject = (request: BookingRequest) => {
    // Handle reject action
    console.log('Rejected:', request);
  };

  const columns: Array<ColumnDefinition<BookingRequest>> = [
    {
      title: "Booking ID",
      dataIndex: "bookingId",
      key: "bookingId",
      render: (value, _, rowIndex) => (
        <div className="flex items-center gap-2">
          <div
            className={`w-8 h-8 flex items-center justify-center rounded-full font-semibold ${getAvatarColor(
              (rowIndex)
            )}`}
          >
            <IoIosCheckmarkCircleOutline className='text-[#98A2B3]' />
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
      title: "Towing operator",
      dataIndex: "towingOperator",
      key: "towingOperator",
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
          {status === 'pending' ? (
            <div className="flex items-center gap-4">
              <button 
                onClick={() => handleApprove(record)}
                className="text-[#12B76A] text-sm font-medium flex items-center gap-2 cursor-pointer hover:text-green-700"
              >
                <FaCheck className="w-4 h-4" /> Approve
              </button>
              <button 
                onClick={() => handleReject(record)}
                className="text-[#F04438] text-sm font-medium flex items-center gap-2 cursor-pointer hover:text-red-700"
              >
                <FaTimes className="w-4 h-4" /> Reject
              </button>
            </div>
          ) : (
            <button 
              onClick={() => handleViewRequest(record)}
              className="text-[#667085]! text-sm! font-medium flex items-center gap-2 cursor-pointer"
            >
              View <FaArrowRight className='ml-2' />
            </button>
          )}
        </div>
      ),
    },
  ];

  const handlePageChange = (page: number, size: number) => {
    setCurrentPage(page);
    setPageSize(size);
  };

  if (!status) {
    return <div>Invalid booking status</div>;
  }

  return (
    <>
    
    <div className="mb-6 px-6">
       <div 
        className="flex items-center mb-5 mt-10 cursor-pointer"
        onClick={() => window.history.back()}
         >
        <FaAngleLeft className='text-lg text-[#667085]' />
        <p className='ml-2 font-bold text-[#667085] text-lg'>Back</p>
      </div>
      <div className="py-2 px-4 bg-white rounded-md border-[#E5E9F0] flex justify-between items-center">
        <h1 className="text-lg font-bold mb-0! text-[#1C2023]">{title}</h1>
        <button className="flex items-center gap-2 px-4 py-2 text-[#667085] bg-[#F9FAFB] rounded-lg border border-[#E5E9F0] hover:bg-gray-50">
          <img src={Images.icon.filter} alt="Filter" className="w-4 h-4" />
          <span>Filter</span>          
        </button>
      </div>
      
      <Table
        columns={columns}
        data={bookingData.slice((currentPage - 1) * pageSize, currentPage * pageSize)}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: bookingData.length,
          onChange: handlePageChange,
        }}
        showActions
        onRowClick={(id) => console.log('Clicked row:', id)}
      />
    </div>
    </>
  );
};

export default BookingTable;
