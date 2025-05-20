import React, { useState, useEffect } from 'react';
import { Table, type ColumnDefinition } from '@/components/ui/Table';
import Images from '@/components/images';
import { getStatusStyle, getAvatarColor } from '@/components/ui/statusStyles';
import { FaArrowRight, FaCheck, FaTimes } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { FaAngleLeft } from "react-icons/fa6";
import { useAllBookings } from "@/hooks/useAdmin";
import RejectBookingSidebar from './RejectBookingSidebar';
import ApproveBookingSidebar from './ApproveBookingSidebar';


interface BookingData {
  id: string;
  customer_name: string;
  vehicle_model: string;
  operator_name: string;
  status: string;
  amount: string;
  createdAt: string;
  actions?:string;
  booking_ref: string;
  user_id: string;
  plate_number: string;
  vehicle_color: string;
  landmark: string;
  vehicle_reg: string;
  vehicle_type: string;
  tow_reason: string;
  start_address: string;
  end_address: string;
  user_data: {
    _id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
  };
  start_coord: { longitude: number; latitude: number };
  end_coord: { longitude: number; latitude: number };
  pickup_coord: { type: string; coordinates: [number, number] };
  ride_status: number;
  charge_status: number;
  settle_status: number;
  vehicle_loaded: number;
  url: string[];
  share_holders_pay: { id: string; name: string; amount: number; setup_amount_type: string; setup_amount_value: number; }[];
  remainder: number;
  est_time: number;
  drop_off_dst: number;
  request_area_data: { area_name: string; lga: string };
  updatedAt: string;
  asset_id?: string;
  driver_id?: string;
  est_fare: number;
  operator_id?: string;
  pick_up_dst: number;
  service_fee: number;
  service_id: string;
  towing_id: string;
  operator?: {
    _id: string;
    name: string;
  };
}

const BookingTable: React.FC = () => {
  const { status } = useParams<{ status: string }>();

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [title, setTitle] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<BookingData | null>(null);
  const [activeSidebar, setActiveSidebar] = useState<'approve' | 'reject' | null>(null);

  useEffect(() => {
    if (status) {
      setTitle(status.charAt(0).toUpperCase() + status.slice(1) + ' Requests');
    }
  }, [status]);

  const handleViewRequest = (request: BookingData) => {
    console.log(request);
  };

  const handleApprove = (request: BookingData) => {
    console.log('Approved:', request);
    setSelectedBooking(request);
    setActiveSidebar('approve');
  };

  const handleReject = (request: BookingData) => {
    console.log('Rejected:', request);
    setSelectedBooking(request);
    setActiveSidebar('reject');
  };

  const handleCloseSidebar = () => {
    setSelectedBooking(null);
    setActiveSidebar(null);
  };

  const getStatusText = (rideStatus: number) => {
    switch(rideStatus) {
      case 0: return 'Pending';
      case 1: return 'Accepted';
      case 2: return 'Ongoing';
      case 3: return 'Completed';
      case 4: return 'Rejected';
      default: return 'Unknown';
    }
  };

  const getRideStatus = (status: string | undefined) => {
    switch(status) {
      case 'pending': return '0';
      case 'accepted': return '1';
      case 'ongoing': return '2';
      case 'completed': return '3';
      case 'rejected': return '4';
      default: return '0'; // Default to pending if status is not recognized
    }
  };

  const { data: bookingData, isLoading } = useAllBookings(getRideStatus(status));

  const columns: Array<ColumnDefinition<BookingData>> = [
    {
      title: "Booking ID",
      dataIndex: "booking_ref",
      key: "booking_ref",
      render: (value, _, rowIndex) => (
        <div className="flex items-center gap-2">
          <div
            className={`w-8 h-8 flex items-center justify-center rounded-full font-semibold ${getAvatarColor(
              rowIndex
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
      dataIndex: "user_data",
      key: "user_data",
      render: (_, record) => (
        <span>{record.user_data?.first_name} {record.user_data?.last_name}</span>
      ),
    },
    {
      title: "Vehicle model",
      dataIndex: "vehicle_model",
      key: "vehicle_model",
    },
    {
      title: "Towing operator",
      dataIndex: "operator",
      key: "operator",
      render: (_, record) => (
        <span>{record.operator?.name || 'N/A'}</span>
      ),
    },
    {
      title: "Status",
      dataIndex: "ride_status",
      key: "ride_status",
      render: (status: number) => (
        <span className={getStatusStyle(getStatusText(status))}>
          {getStatusText(status)}
        </span>
      ),
    },
    {
      title: "Amount",
      dataIndex: "est_fare",
      key: "est_fare",
      className: "font-medium",
      render: (value: number) => `₦${value.toLocaleString()}`,
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
      dataIndex: "actions",
      key: "actions",
      render: (_, record) => (
        <div className="relative">
          {record.ride_status === 0 ? (
            <div className="flex items-center gap-4">
              <button 
                onClick={() => handleApprove(record)}
                className="text-[#667085] text-sm font-medium flex items-center gap-2 cursor-pointer "
              >
                <FaCheck className="w-4 h-4 font-medium" /> Approve
              </button>
              <button 
                onClick={() => handleReject(record)}
                className="text-[#667085] text-sm font-medium flex items-center gap-2 cursor-pointer "
              >
                <FaTimes className="w-4 h-4 font-medium" /> Reject
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

  if (isLoading) {
    return <div>Loading...</div>;
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
        data={bookingData?.slice((currentPage - 1) * pageSize, currentPage * pageSize) || []}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: bookingData?.length || 0,
          onChange: handlePageChange,
        }}
        showActions
        onRowClick={(id) => console.log('Clicked row:', id)}
      />
    </div>

    {activeSidebar === 'approve' && (
      <ApproveBookingSidebar
        isOpen={activeSidebar === 'approve' && !!selectedBooking}
        onClose={handleCloseSidebar}
        booking={selectedBooking}
      />
    )}
    {activeSidebar === 'reject' && (
      <RejectBookingSidebar
        isOpen={activeSidebar === 'reject' && !!selectedBooking}
        onClose={handleCloseSidebar}
        booking={selectedBooking}
      />
    )}
    </>
  );
};

export default BookingTable;
