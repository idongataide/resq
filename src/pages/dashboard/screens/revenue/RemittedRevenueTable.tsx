import React, { useState, useMemo } from 'react';
import { Table, type ColumnDefinition } from '@/components/ui/Table';

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

  // Placeholder data
  const data: RemittedRevenueData[] = [
    // Add sample data based on the image
    // Add more data here for pagination to be visible
    { id: '1', date: 'Wed, 16-09-2025', totalRevenue: 5500000, transco: 1000000, resq: 800000, lasgTax: 700000, wintra: 1500000, firs: 1500000 },
    { id: '2', date: 'Tue, 15-09-2025', totalRevenue: 5500000, transco: 1000000, resq: 800000, lasgTax: 700000, wintra: 1500000, firs: 1500000 },
    { id: '3', date: 'Mon, 14-09-2025', totalRevenue: 5500000, transco: 1000000, resq: 800000, lasgTax: 700000, wintra: 1500000, firs: 1500000 },
    { id: '4', date: 'Sun, 13-09-2025', totalRevenue: 5500000, transco: 1000000, resq: 800000, lasgTax: 700000, wintra: 1500000, firs: 1500000 },
    { id: '5', date: 'Sat, 12-09-2025', totalRevenue: 5500000, transco: 1000000, resq: 800000, lasgTax: 700000, wintra: 1500000, firs: 1500000 },
    { id: '6', date: 'Fri, 11-09-2025', totalRevenue: 5500000, transco: 1000000, resq: 800000, lasgTax: 700000, wintra: 1500000, firs: 1500000 },
  ];

  const handlePageChange = (page: number, size: number) => {
    setCurrentPage(page);
    setPageSize(size);
  };

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return data.slice(startIndex, startIndex + pageSize);
  }, [currentPage, pageSize, data]);

  const columns: Array<ColumnDefinition<RemittedRevenueData>> = [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
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

export default RemittedRevenueTable; 