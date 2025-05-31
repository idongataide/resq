import React from 'react';
import { Table, type ColumnDefinition } from '@/components/ui/Table';
import Images from '@/components/images';
import { useDashboardOperators } from '@/hooks/useAdmin';

interface Operator {
  operator_id: string | null;
  total_assign: number;
  total_complete: number;
  name: string;
  avg_rating: number;
}

interface TableOperator extends Operator {
  id: string;
}

interface AllOperationsProps {
  data?: Operator[];
  isLoading?: boolean;
}

const TopOperators: React.FC<AllOperationsProps> = () => {
  const { data: operatorsData } = useDashboardOperators();

  const columns: Array<ColumnDefinition<TableOperator>> = [
    {
      title: "Operators list",
      dataIndex: "name",
      key: "name",
      render: (value) => (
        <div className="flex items-center gap-2">  
          <img src={Images.icon.medal} alt="Star" className="w-7 h-7" />         
          <span className='font-medium text-[#475467]'>{value || 'Unnamed Operator'}</span>
        </div>
      ),
    },
    {
      title: "Requests assigned",
      dataIndex: "total_assign",
      key: "total_assign",
      render: (value) => <span className='text-[#475467]'>{value}</span>,
    },
    {
      title: "Requests completed",
      dataIndex: "total_complete",
      key: "total_complete",
      render: (value) => <span className='text-[#475467]'>{value}</span>,
    },
    {
      title: "Performance(%)",
      dataIndex: "total_assign",
      key: "performance",
      render: (_, record) => {
        const performance = record.total_assign > 0 
          ? Math.round((record.total_complete / record.total_assign) * 100) 
          : 0;
        return <span className='text-[#475467]'>{performance}%</span>;
      },
    },
    {
      title: "Tow rating",
      dataIndex: "avg_rating",
      key: "avg_rating",
      render: (value) => (
        <div className="flex items-center gap-1">
          <span className='text-[#475467]'>{value?.toFixed(1)}</span>
        </div>
      ),
    },
  ];

  const tableData: TableOperator[] = (operatorsData as Operator[] || []).map((op: Operator) => ({
    ...op,
    id: op.operator_id || 'unknown'
  }));

  return (
    <div className="mb-6">
      <div className="py-2 px-4 bg-white rounded-md border-[#E5E9F0] flex justify-between items-center">
        <h1 className="text-md font-medium mb-0 text-[#344054]">Top five (5) performing operators</h1>
        <button className="flex items-center gap-2 px-4 py-2 text-[#667085] bg-[#F9FAFB] rounded-lg border border-[#E5E9F0] hover:bg-gray-50">
          <img src={Images.icon.filter} alt="Filter" className="w-4 h-4" />
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

export default TopOperators;