import React, { useState, useMemo } from 'react';
import { Table, type ColumnDefinition } from '@/components/ui/Table';
// import Images from '@/components/images'; // Remove if not used
// import { FaArrowRight } from 'react-icons/fa'; // Remove if not used
// import { useNavigate } from 'react-router-dom'; // Remove if not used

// Import Icons here if needed for actions (Edit/Delete)
import { MdOutlineEdit as IconEdit } from 'react-icons/md';
import { MdOutlineDeleteOutline as IconDelete } from 'react-icons/md';

interface StakeHolderItem {
  id: string;
  stakeholderName: string;
  accountNumber: string;
  bankName: string;
  accountName: string;
  value: string; // Can be percentage or amount
  action?: string; // Add optional action property
}

interface StakeHolderTableProps {
  data: StakeHolderItem[];
}

const StakeHolderTable: React.FC<StakeHolderTableProps> = ({ data }) => {
  // const navigate = useNavigate(); // Remove if not used
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5); // Keep a small page size for demo

  const columns: Array<ColumnDefinition<StakeHolderItem>> = [
    {
      title: "Stakeholder",
      dataIndex: "stakeholderName",
      key: "stakeholderName",
      render: (value: string) => <span className='text-[#475467] font-medium'>{value}</span>,
    },
    {
      title: "Account number",
      dataIndex: "accountNumber",
      key: "accountNumber",
    },
    {
      title: "Bank name",
      dataIndex: "bankName",
      key: "bankName",
    },
    {
      title: "Account name",
      dataIndex: "accountName",
      key: "accountName",
    },
    {
      title: "Value (Percentage/Amount)",
      dataIndex: "value",
      key: "value",
      render: (value: string) => <span className='text-[#475467] font-medium'>{value}</span>, // Apply styling if needed
    },
    {
      title: "Actions",
      dataIndex: "action",
      key: "actions",
      render: (_, record) => (
        <div className="flex items-center gap-4">
          <button
            className="flex items-center gap-1 text-[#667085] text-sm font-medium cursor-pointer"
            onClick={() => console.log('Edit stakeholder', record.id)}
          >
            <IconEdit className='w-4 h-4'/> Edit
          </button>
          <button
             className="flex items-center gap-1 text-[#667085] text-sm font-medium cursor-pointer"
             onClick={() => console.log('Delete stakeholder', record.id)}
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
        <h1 className="text-lg font-medium mb-0 text-[#344054]">Stakeholders Disbursements</h1>
        {/* Adapting the filter button to a Sort by button */}
        <button className="flex items-center gap-2 px-4 py-2 text-[#667085] bg-[#F9FAFB] rounded-lg border border-[#E5E9F0] hover:bg-gray-50">
          {/* You might need a different icon here */}
          <span>Sort by</span>
          {/* Add sorting functionality later */}
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
        // onRowClick={(id) => handleEditStakeholder(id)} // Add/update as needed
      />
    </div>
  );
};

export default StakeHolderTable; 