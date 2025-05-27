import React, { useState, useMemo } from 'react';
import { Table, type ColumnDefinition } from '@/components/ui/Table';

interface RevenuePerOperatorsData {
  id: string;
  operatorName: string;
  location: string;
  requestsCompleted: number;
  dateOnboarded: string;
  amount: number;
}

const RevenuePerOperatorsTable: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Placeholder data
  const data: RevenuePerOperatorsData[] = [
    // Add sample data based on the image
    // Add more data here for pagination to be visible
    { id: '1', operatorName: 'Baba Adugbo Towing & Co', location: 'Yaba, Lagos', requestsCompleted: 320, dateOnboarded: '16-09-2024', amount: 200856 },
    { id: '2', operatorName: 'Uptown towing limited', location: 'Lekki, Lagos', requestsCompleted: 330, dateOnboarded: '16-09-2024', amount: 200050 },
    { id: '3', operatorName: 'Move360', location: 'Oshodi, Lagos', requestsCompleted: 324, dateOnboarded: '16-09-2024', amount: 190050 },
    { id: '4', operatorName: 'Towing & more', location: 'Sango, Ogun', requestsCompleted: 299, dateOnboarded: '16-09-2024', amount: 210050 },
    { id: '5', operatorName: 'Alhaji Amusan towing', location: 'Ikotun, Lagos', requestsCompleted: 312, dateOnboarded: '20-10-2024', amount: 160050 },
    { id: '6', operatorName: 'MobilityOne', location: 'Maryland, Lagos', requestsCompleted: 190, dateOnboarded: '01-11-2024', amount: 170066 },
    { id: '7', operatorName: 'Road Rescue', location: 'Ajah, Lagos', requestsCompleted: 100, dateOnboarded: '12-12-2024', amount: 160000 },
  ];

  const handlePageChange = (page: number, size: number) => {
    setCurrentPage(page);
    setPageSize(size);
  };

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return data.slice(startIndex, startIndex + pageSize);
  }, [currentPage, pageSize, data]);

  const columns: Array<ColumnDefinition<RevenuePerOperatorsData>> = [
    {
      title: "Operators list",
      dataIndex: "operatorName",
      key: "operatorName",
      render: (value: string) => <span className='text-[#475467] font-medium'>{value}</span>,
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
    },
    {
      title: "Requests completed",
      dataIndex: "requestsCompleted",
      key: "requestsCompleted",
    },
    {
      title: "Date onboarded",
      dataIndex: "dateOnboarded",
      key: "dateOnboarded",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (value: number) => `₦${value?.toLocaleString() || 'N/A'}`,
    },
  ];

  return (
    <div className="mb-6 mt-6">
        <div className="py-2 px-4 bg-white rounded-md border-[#E5E9F0] flex justify-between items-center">
            <h1 className="text-md font-medium mb-0 text-[#344054]">Top five (5) performing operators</h1>
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

export default RevenuePerOperatorsTable; 