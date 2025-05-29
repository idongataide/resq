import React, { useState, useMemo } from 'react';
import { Table, type ColumnDefinition } from '@/components/ui/Table';
import { useRemittedRevenue } from '@/hooks/useAdmin';
import { StakeholderItemData } from './StakeholderPayoutTable';

interface RemittedRevenueData {
  id: string;
  date: string;
  totalRevenue: number;
  [key: string]: any;
}

interface RemittedRevenueTableProps {
  onRowClick?: (rowData: any) => void;
}

const RemittedRevenueTable: React.FC<RemittedRevenueTableProps> = ({ onRowClick }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { data : revenues } = useRemittedRevenue()

  const handlePageChange = (page: number, size: number) => {
    setCurrentPage(page);
    setPageSize(size);
  };
  

  const processedData = useMemo(() => {
    if (!revenues) return { data: [], columns: [] };

    const uniqueStakeholders = new Set<string>();
    const transformedData = revenues.map((revenue: any) => {
      const rowData: any = {
        id: revenue?.id || revenue?.date,
        date: revenue?.date,
        totalRevenue: revenue?.totalAmount,
        originalItems: revenue?.items || []
      };
      revenue?.items?.forEach((item: any) => {
        uniqueStakeholders.add(item.name);
        rowData[item.name] = item.amount;
      });
      return rowData;
    });

    const dynamicColumns: Array<ColumnDefinition<RemittedRevenueData>> = Array.from(uniqueStakeholders).map(stakeholderName => ({
      title: stakeholderName,
      dataIndex: stakeholderName,
      key: stakeholderName,
      render: (value: number) => `₦${value?.toLocaleString() || 'N/A'}`,
    }));

    const staticColumns: Array<ColumnDefinition<RemittedRevenueData>> = [
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
    ];

    const allColumns = [...staticColumns, ...dynamicColumns];

    return {
      data: transformedData,
      columns: allColumns,
    };

  }, [revenues]);

  const { data: tableData, columns } = processedData;

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return tableData?.slice(startIndex, startIndex + pageSize);
  }, [currentPage, pageSize, tableData]);

  const handleRowClick = (id: string) => {
    if (!id) return; // Early return if no id is provided
    
    console.log('Clicked row ID:', id);
    // Find the full row data using the id and assert the type
    const clickedRowData = tableData?.find((row: RemittedRevenueData & { originalItems: StakeholderItemData[] }): row is RemittedRevenueData & { originalItems: StakeholderItemData[] } => row.id === id);
    
    if (clickedRowData && onRowClick) {
      onRowClick(clickedRowData);
    }
  };

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
        pagination={tableData?.length > pageSize ? {
          current: currentPage,
          pageSize: pageSize,
          total: tableData?.length,
          onChange: handlePageChange,
        } : undefined}
        onRowClick={handleRowClick}
      />
    </div>
  );
};

export default RemittedRevenueTable; 