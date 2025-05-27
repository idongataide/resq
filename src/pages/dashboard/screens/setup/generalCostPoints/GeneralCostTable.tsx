import React, { useState, useMemo } from 'react';
import { Table, type ColumnDefinition } from '@/components/ui/Table';
// import Images from '@/components/images'; // Remove if not used
// import { FaArrowRight } from 'react-icons/fa'; // Remove if not used
// import { useNavigate } from 'react-router-dom'; // Remove if not used

// import Icons here if needed for actions (Edit/Delete)
import { MdOutlineEdit as IconEdit } from 'react-icons/md';
import { MdOutlineDeleteOutline as IconDelete } from 'react-icons/md';

export interface GeneralCostItem {
  id: string;
  itemName: string;
  amount: number;
  lastModified: string;
  action?: string; // Add optional action property
}

interface GeneralCostTableProps {
  data: GeneralCostItem[];
}

const GeneralCostTable: React.FC<GeneralCostTableProps> = ({ data }) => {
  // const navigate = useNavigate(); // Remove if not used
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5); // Keep a small page size for demo

  const columns: Array<ColumnDefinition<GeneralCostItem>> = [
    {
      title: "Item name",
      dataIndex: "itemName",
      key: "itemName",
      render: (value: string) => <span className='text-[#475467] font-medium'>{value}</span>,
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (value: number) => `₦${value?.toLocaleString() || 'N/A'}`,
    },
    {
      title: "Last modified",
      dataIndex: "lastModified",
      key: "lastModified",
    },
    {
      title: "Actions",
      dataIndex: "action", 
      key: "actions",
      render: (_, record) => (
        <div className="flex items-center gap-4">
          <button 
            className="flex items-center gap-1 text-[#667085] text-sm font-medium cursor-pointer"
            onClick={() => console.log('Edit', record.id)}
          >
            <IconEdit className='w-4 h-4'/> Edit
          </button>
          <button 
             className="flex items-center gap-1 text-[#667085] text-sm font-medium cursor-pointer"
             onClick={() => console.log('Delete', record.id)}
          >
             <IconDelete className='w-4 h-4'/> Delete
          </button>
        </div>
      ),
    },
  ];

  const handlePageChange = (page: number, size: number) => {
    setCurrentPage(page);
    setPageSize(size);
  };

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return data.slice(startIndex, startIndex + pageSize);
  }, [currentPage, pageSize, data]);

  return (
    <div className="mb-6">

      <div className="py-2 px-4 bg-white rounded-md border-[#E5E9F0] flex justify-between items-center">
        <h1 className="text-lg font-medium mb-0 text-[#344054]">General cost points</h1>
        <button className="flex items-center gap-2 px-4 py-2 text-[#667085] bg-[#F9FAFB] rounded-lg border border-[#E5E9F0] hover:bg-gray-50">
          {/* <img src={Images.icon.filter} alt="Filter" className="w-4 h-4" /> */}
          <span>Filters</span>          
        </button>
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
        // showActions={false} // Actions are handled in render
        // onRowClick={(id) => handleEditOperator(id)} // Remove or update
      />
    </div>
  );
};

export default GeneralCostTable; 