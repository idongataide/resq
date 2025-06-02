import React from 'react';
import { Table, type ColumnDefinition } from '@/components/ui/Table';
import { useRevenues } from '@/hooks/useAdmin';

interface OperatorRevenue {
  total_count: number;
  total_earning: number;
  operator_id: string;
  operator_name: string;
  operator_lga: string;
  operator_state: string;
  createdAt: string;
}

interface TableOperatorRevenue extends OperatorRevenue {
  id: string;
}

const RevenuePerOperatorsTable: React.FC = () => {
  const { data: revenues } = useRevenues('operator-earning');

  const columns: Array<ColumnDefinition<TableOperatorRevenue>> = [
    {
      title: "Operators list",
      dataIndex: "operator_name",
      key: "operator_name",
      render: (value, record) => (
        <div className="flex flex-col">
          <span className='font-medium text-[#475467]'>{value}</span>
          <span className='text-sm text-[#667085]'>{record.operator_lga}, {record.operator_state}</span>
        </div>
      ),
    },
    {
      title: "Total requests",
      dataIndex: "total_count",
      key: "total_count",
      render: (value) => <span className='text-[#475467]'>{value}</span>,
    },
    {
      title: "Total earnings",
      dataIndex: "total_earning",
      key: "total_earning",
      render: (value) => <span className='text-[#475467]'>₦{value?.toLocaleString()}</span>,
    },
    {
      title: "Date joined",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (value) => (
        <span className='text-[#475467]'>
          {new Date(value).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })}
        </span>
      ),
    },
  ];

  const tableData: TableOperatorRevenue[] = (revenues as OperatorRevenue[] || []).map((op: OperatorRevenue) => ({
    ...op,
    id: op.operator_id
  }));

  return (
    <div className="mb-6">
      <div className="py-2 px-4 bg-white rounded-md border-[#E5E9F0] flex justify-between items-center">
        <h1 className="text-md font-medium mb-0 text-[#344054]">Revenue per operator</h1>
        <button className="flex items-center gap-2 px-4 py-2 text-[#667085] bg-[#F9FAFB] rounded-lg border border-[#E5E9F0] hover:bg-gray-50">
          <span>Filter</span>          
        </button>
      </div>
      
      <Table
        columns={columns}
        data={tableData}
      />
    </div>
  );
};

export default RevenuePerOperatorsTable; 