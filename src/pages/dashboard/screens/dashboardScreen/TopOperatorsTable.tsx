import React from 'react';
import { Table, type ColumnDefinition } from '@/components/ui/Table';
import Images from '@/components/images';

interface Operator {
  id: string;
  assetco_id: string;
  name: string;
  email: string;
  phone_number: string;
  lga: string;
  state: string;
  createdAt: string;
  requests_assigned: number;
  requests_completed: number;
  performance: number;
  tour_rating: number;
  action?: string;
}

interface AllOperationsProps {
  data?: Operator[];
  isLoading?: boolean;
}

const TopOperators: React.FC<AllOperationsProps> = ({ data }) => {
  // Mock data if no data is provided
  const operatorsData = data || [
    {
      id: "1",
      assetco_id: "1",
      name: "Baba Adugbo Towing & Co",
      email: "babaadugbo@example.com",
      phone_number: "+2348012345678",
      lga: "Ikeja",
      state: "Lagos",
      createdAt: "2023-01-15",
      requests_assigned: 350,
      requests_completed: 320,
      performance: 91.4,
      tour_rating: 4.9
    },
    {
      id: "2",
      assetco_id: "2",
      name: "Uptown towing limited",
      email: "uptown@example.com",
      phone_number: "+2348023456789",
      lga: "Victoria Island",
      state: "Lagos",
      createdAt: "2023-02-20",
      requests_assigned: 323,
      requests_completed: 330,
      performance: 87,
      tour_rating: 4.8
    },
    {
      id: "3",
      assetco_id: "3",
      name: "Move360",
      email: "move360@example.com",
      phone_number: "+2348034567890",
      lga: "Lekki",
      state: "Lagos",
      createdAt: "2023-03-10",
      requests_assigned: 323,
      requests_completed: 324,
      performance: 86.1,
      tour_rating: 4.8
    },
    {
      id: "4",
      assetco_id: "4",
      name: "Towing & more",
      email: "towingmore@example.com",
      phone_number: "+2348045678901",
      lga: "Apapa",
      state: "Lagos",
      createdAt: "2023-01-25",
      requests_assigned: 310,
      requests_completed: 299,
      performance: 80.6,
      tour_rating: 4.6
    },
    {
      id: "5",
      assetco_id: "5",
      name: "Alhaji Amusan towing",
      email: "amusan@example.com",
      phone_number: "+2348056789012",
      lga: "Surulere",
      state: "Lagos",
      createdAt: "2023-02-05",
      requests_assigned: 350,
      requests_completed: 300,
      performance: 79,
      tour_rating: 4.5
    }
  ];

  const columns: Array<ColumnDefinition<Operator>> = [
    {
      title: "Operators list",
      dataIndex: "name",
      key: "name",
      render: (value) => (
        <div className="flex items-center gap-2">  
          <img src={Images.icon.medal} alt="Star" className="w-7 h-7" />         
          <span className='font-medium text-[#475467]'>{value}</span>
        </div>
      ),
    },
    {
      title: "Requests assigned",
      dataIndex: "requests_assigned",
      key: "requests_assigned",
      render: (value) => <span className='text-[#475467]'>{value}</span>,
    },
    {
      title: "Requests completed",
      dataIndex: "requests_completed",
      key: "requests_completed",
      render: (value) => <span className='text-[#475467]'>{value}</span>,
    },
    {
      title: "Performance(%)",
      dataIndex: "performance",
      key: "performance",
      render: (value) => <span className='text-[#475467]'>{value}%</span>,
    },
    {
      title: "Tour rating",
      dataIndex: "tour_rating",
      key: "tour_rating",
      render: (value) => (
        <div className="flex items-center gap-1">
          <span className='text-[#475467]'>{value}</span>
        </div>
      ),
    },
  ];

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
        data={operatorsData?.map(op => ({ ...op, id: op.assetco_id }))}
      />
    </div>
  );
};

export default TopOperators;