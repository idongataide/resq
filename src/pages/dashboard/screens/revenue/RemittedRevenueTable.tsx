import React, { useState, useMemo } from 'react';
import { Table, type ColumnDefinition } from '@/components/ui/Table';
import { useRemittedRevenue } from '@/hooks/useAdmin';

interface RemittedRevenueData {
  id: string;
  date: string;
  totalRevenue: number;
  transco: number;
  resq: number;
  lasgTax: number;
  wintra: number;
  firs: number;
}

const RemittedRevenueTable: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { data : revenues } = useRemittedRevenue()

  const handlePageChange = (page: number, size: number) => {
    setCurrentPage(page);
    setPageSize(size);
  };

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return revenues?.slice(startIndex, startIndex + pageSize);
  }, [currentPage, pageSize, revenues]);

  const columns: Array<ColumnDefinition<RemittedRevenueData>> = [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (value: string) => <span className='text-[#475467] font-medium'>{value}</span>,
    },
    {
      title: "Total Revenue",
      dataIndex: "totalRevenue",
      key: "totalRevenue",
      render: (value: number) => `₦${value?.toLocaleString() || 'N/A'}`,
    },
    {
      title: "Transco",
      dataIndex: "transco",
      key: "transco",
      render: (value: number) => `₦${value?.toLocaleString() || 'N/A'}`,
    },
    {
      title: "RESQ",
      dataIndex: "resq",
      key: "resq",
      render: (value: number) => `₦${value?.toLocaleString() || 'N/A'}`,
    },
    {
      title: "LASG tax",
      dataIndex: "lasgTax",
      key: "lasgTax",
      render: (value: number) => `₦${value?.toLocaleString() || 'N/A'}`,
    },
    {
      title: "Wintra",
      dataIndex: "wintra",
      key: "wintra",
      render: (value: number) => `₦${value?.toLocaleString() || 'N/A'}`,
    },
    {
      title: "FIRS",
      dataIndex: "firs",
      key: "firs",
      render: (value: number) => `₦${value?.toLocaleString() || 'N/A'}`,
    },
  ];

  return (
    <div className="mb-6">
        <div className="py-2 px-4 bg-white rounded-md border-[#E5E9F0] flex justify-between items-center">
            <h1 className="text-md font-medium mb-0 text-[#344054]">Remitted Revenue (Daily bookings)</h1>
            <div className="text-sm text-gray-500">
            <button className="px-3 py-1 text-[#475467] text-xs cursor-pointer rounded-bl-md rounded-tl-md  border border-[#F2F4F7]">Daily</button>
            <button className="px-3 py-1 text-[#475467] text-xs cursor-pointer  border border-[#F2F4F7]">Weekly</button>
            <button className="px-3 py-1 text-[#475467] text-xs cursor-pointer rounded-br-md rounded-tr-md  border border-[#F2F4F7]">Monthly</button>
            </div>
        </div>
      <Table 
        columns={columns} 
        data={paginatedData} 
        pagination={revenues?.length > pageSize ? {
          current: currentPage,
          pageSize: pageSize,
          total: revenues?.length,
          onChange: handlePageChange,
        } : undefined}
      />
    </div>
  );
};

export default RemittedRevenueTable; 