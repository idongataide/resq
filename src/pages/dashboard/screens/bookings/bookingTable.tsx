import React, { useState, useEffect, useRef } from 'react';
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
import AcceptedBookingsSidebar from './AcceptedBookingsSidebar';
import CompletedBookingsSidebar from './CompletedBookingsSidebar';
import CancelledBookingsSidebar from './CancelledBookingsSidebar';
import OngoingBookingsSidebar from './OngoingBookingSidebar';
import LoadingScreen from '../../common/LoadingScreen';
import { Toaster } from 'react-hot-toast';


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
  cancel_data?: {
    cancel_by: string;
  };
}

const BookingTable: React.FC = () => {
  const { status } = useParams<{ status: string }>();
  const filterRef = useRef<HTMLDivElement>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [title, setTitle] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<BookingData | null>(null);
  const [activeSidebar, setActiveSidebar] = useState<'approve' | 'reject' | 'accepted' | 'completed' | 'cancelled' | 'ongoing' | null>(null);
  const [cancelledByFilter, setCancelledByFilter] = useState<string | undefined>(undefined);
  const [toggle1, setToggle1] = useState(false);
  const [selected, setSelected] = useState<{ id: string; title: string; icon: React.ReactNode } | null>(null);
  const [startDate, setStartDate] = useState<string | undefined>(undefined);
  const [endDate, setEndDate] = useState<string | undefined>(undefined);


  
  useEffect(() => {
    if (status) {
      setTitle(status.charAt(0).toUpperCase() + status.slice(1) + ' Requests');
    }
  }, [status]);

  const handleViewRequest = (request: BookingData) => {
    if (request.ride_status === 1 && request.charge_status === 1) {
      setSelectedBooking(request);
      setActiveSidebar('ongoing');
    } else if (request.ride_status === 2 ){
      setSelectedBooking(request);
      setActiveSidebar('ongoing');
    } else if (request.ride_status === 1) {
      setSelectedBooking(request);
      setActiveSidebar('accepted');
    } else if (request.ride_status === 3) {
      setSelectedBooking(request);
      setActiveSidebar('completed');
    } else if (request.ride_status === 4) {
      setSelectedBooking(request);
      setActiveSidebar('cancelled');
    } else {
      handleCloseSidebar();
    }
  };

  const handleApprove = (request: BookingData) => {
    setSelectedBooking(request);
    setActiveSidebar('approve');
  };

  const handleReject = (request: BookingData) => {
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
      case 1: return 'Awaiting payment';
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
      default: return '0'; 
    }
  };
 

  const { data: bookingData, isLoading, mutate } = useAllBookings(getRideStatus(status), cancelledByFilter, startDate, endDate);

  
  if (isLoading) {
    return (
      <LoadingScreen/>
    );
  }

  const bokingCount = bookingData?.lenght

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
      title: "Vehicle Reg",
      dataIndex: "vehicle_reg",
      key: "vehicle_reg",
    },
    {
      title: "Vehicle Type",
      dataIndex: "vehicle_type",
      key: "vehicle_type",
    },
    {
      title: "Status",
      dataIndex: "ride_status",
      key: "ride_status",
      render: (value: any, record: BookingData) => 
        record.ride_status === 1 && record.charge_status === 1 ?  (
          <span className={getStatusStyle('Ongoing')}>
             Ongoing
          </span>
        ) : record.ride_status === 4 ? (
          <div className="">          
            {record.cancel_data?.cancel_by && (
              <span className="text-[#B11B1B] bg-[#FFEFEF] px-2 py-1 rounded-full whitespace-nowrap text-xs font-medium">
                Cancelled by: {record.cancel_data.cancel_by}
              </span>
            )}
          </div>
        ) : (
          <span className={getStatusStyle(getStatusText(value))}>
            {getStatusText(value)}
          </span>
        ),
    },
    ...(status !== 'pending' && status !== 'rejected' ? [{
      title: "Amount",
      dataIndex: "est_fare" as keyof BookingData,
      key: "est_fare",
      render: (value: number) => `₦${value?.toLocaleString()}`
    }] : []),
    {
      title: "Date & time",
      dataIndex: "createdAt" as keyof BookingData,
      key: "createdAt",
      render: (value: string) => {
        if (!value) return 'N/A';
        const date = new Date(value);
        if (isNaN(date.getTime())) return 'N/A';
        return date?.toLocaleString('en-US', {
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
    <LoadingScreen/>
  }

  return (
    <>
    <Toaster/>
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
        <div className="relative">
          <div 
            onClick={() => setToggle1(!toggle1)}
            className="flex items-center gap-2 px-4 py-2 text-[#667085] bg-[#F9FAFB] rounded-lg border border-[#E5E9F0] hover:bg-gray-50 cursor-pointer"
          >
            <img src={Images.icon.filter} alt="Filter" className="w-4 h-4" />
            <span>Filter</span>
          </div>

          {toggle1 && (
            <div ref={filterRef} className="absolute border border-gray-200 min-h-[120px] w-[200px] bg-white rounded-md right-0 top-full mt-2 z-50 p-2 text-[14px] shadow-lg">
              <p className="text-[14px] text-left text-gray-400 mb-2">
                Filter by
              </p>

              {status === 'rejected' ? (
                // Filter options for rejected status
                [
                  { id: 'all', title: 'All', icon: null },
                  { id: 'admin', title: 'Cancelled By: Admin', icon: null },
                  { id: 'user', title: 'Cancelled By: User', icon: null }
                ].map((el) => (
                  <div
                    onClick={() => {
                      setSelected(el);
                      setCancelledByFilter(el.id === 'all' ? undefined : el.id);
                      setToggle1(false);
                    }}
                    key={el.id}
                    className={`flex gap-2 items-center mb-1 cursor-pointer hover:bg-gray-500/20 hover:border border-transparent border hover:border-gray-400 transition-all duration-300 p-2 rounded-md font-[300] text-gray-500 ${el.id === selected?.id && "bg-gray-500/20 border border-gray-400"}`}
                  >
                    {el.icon}
                    <div>{el.title}</div>
                  </div>
                ))
              ) : (
                // Date filter options for other statuses
                [
                  { 
                    id: 'this_week', 
                    title: 'This Week', 
                    icon: null,
                    getDateRange: () => {
                      const now = new Date();
                      const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
                      const endOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 6));
                      return {
                        start_date: startOfWeek.toISOString().split('T')[0],
                        end_date: endOfWeek.toISOString().split('T')[0]
                      };
                    }
                  },
                  { 
                    id: 'this_month', 
                    title: 'This Month', 
                    icon: null,
                    getDateRange: () => {
                      const now = new Date();
                      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
                      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
                      return {
                        start_date: startOfMonth.toISOString().split('T')[0],
                        end_date: endOfMonth.toISOString().split('T')[0]
                      };
                    }
                  },
                  { 
                    id: 'this_year', 
                    title: 'This Year', 
                    icon: null,
                    getDateRange: () => {
                      const now = new Date();
                      const startOfYear = new Date(now.getFullYear(), 0, 1);
                      const endOfYear = new Date(now.getFullYear(), 11, 31);
                      return {
                        start_date: startOfYear.toISOString().split('T')[0],
                        end_date: endOfYear.toISOString().split('T')[0]
                      };
                    }
                  }
                ].map((el) => (
                  <div
                    onClick={() => {
                      setSelected(el);
                      const dateRange = el.getDateRange();
                      setStartDate(dateRange.start_date);
                      setEndDate(dateRange.end_date);
                      setToggle1(false);
                    }}
                    key={el.id}
                    className={`flex gap-2 items-center font-medium mb-1 cursor-pointer hover:bg-gray-100 hover:border border-transparent border hover:border-gray-300 transition-all duration-300 p-2 rounded-md text-gray-600 ${el.id === selected?.id ? "bg-gray-100 border border-gray-300" : "hover:shadow-sm"}`}
                  >
                    {el.icon}
                    <div>{el.title}</div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
      
      <Table
        columns={columns}
        data={bookingData?.slice((currentPage - 1) * pageSize, currentPage * pageSize) || []}
        pagination={bokingCount > pageSize ? {
          current: currentPage,
          pageSize: pageSize,
          total: bookingData?.length || 0,
          onChange: handlePageChange,
        }: undefined}
        showActions
        onRowClick={(id) => console.log('Clicked row:', id)}
      />
    </div>

    {activeSidebar === 'approve' && (
      <ApproveBookingSidebar
        isOpen={activeSidebar === 'approve' && !!selectedBooking}
        onClose={handleCloseSidebar}
        booking={selectedBooking}
        mutate={mutate}
      />
    )}
    {activeSidebar === 'reject' && (
      <RejectBookingSidebar
        isOpen={activeSidebar === 'reject' && !!selectedBooking}
        onClose={handleCloseSidebar}
        booking={selectedBooking}
        mutate={mutate}
      />
    )}
    {activeSidebar === 'accepted' && (
      <AcceptedBookingsSidebar
        isOpen={activeSidebar === 'accepted' && !!selectedBooking}
        onClose={handleCloseSidebar}
        booking={selectedBooking}
       
      />
    )}
    {activeSidebar === 'completed' && (
      <CompletedBookingsSidebar
        isOpen={activeSidebar === 'completed' && !!selectedBooking}
        onClose={handleCloseSidebar}
        booking={selectedBooking}
      />
    )}
    {activeSidebar === 'cancelled' && (
      <CancelledBookingsSidebar
        isOpen={activeSidebar === 'cancelled' && !!selectedBooking}
        onClose={handleCloseSidebar}
        booking={selectedBooking}
      />
    )}
    {activeSidebar === 'ongoing' && (
      <OngoingBookingsSidebar
        isOpen={activeSidebar === 'ongoing' && !!selectedBooking}
        onClose={handleCloseSidebar}
        booking={selectedBooking}     
        mutate={mutate}
      />
    )}
    </>
  );
};

export default BookingTable;
